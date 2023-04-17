let isUserModalOpen = false;

// 로그인 유무
axios
    .get(`/api/users/isLoggedIn`)
    .then((res) => {
        const { isLoggedIn, userInfo } = res.data;

        const headerRightElements = document.querySelector('.header-right');

        if (!isLoggedIn) {
            // 로그아웃 상태
            const headerRightHtml = `
                <a class="header-btn-signin" href="/signin">로그인</a>
                <a class="header-btn-signup" href="/signup">회원가입</a>
            `;
            headerRightElements.innerHTML = headerRightHtml;
        } else {
            // 로그인 상태
            const profileImg = !userInfo.profileImg
                ? '/images/default_profile_image.png'
                : userInfo.profileImg;

            const headerRightHtml = `
                <div class="header-btn-user-wrap">
                    <button type='button' class='header-btn-user' onclick='showUserModal()'>
                        <img src='${profileImg}' />
                    </button>     
                    <div class='header-btn-user-modal'>
                        <div class='header-btn-user-modal-menu'>
                            <a href='/mypage'>마이페이지</a>
                        </div>
                        <div class='header-btn-user-modal-signout'>
                            <button type='button' onclick='signout()'>로그아웃</button>
                        </div>                                
                    </div>                    
                </div>
                
            `;
            headerRightElements.innerHTML = headerRightHtml;
        }
    })
    .catch((err) => {
        console.log(err);
    });

function showUserModal() {
    if (!isUserModalOpen) {
        document.querySelector('.header-btn-user-modal').style.display =
            'block';
        isUserModalOpen = true;
    } else {
        document.querySelector('.header-btn-user-modal').style.display = 'none';
        isUserModalOpen = false;
    }
}

function signout() {
    axios
        .get(`/api/users/signout`)
        .then((res) => {
            window.location.href = '/';
        })
        .catch((err) => {
            console.log(err);
        });
}
