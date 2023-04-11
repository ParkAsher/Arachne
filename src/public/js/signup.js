function signup() {
    const id = document.getElementById('user-id').value; // 아이디
    const password = document.getElementById('user-password').value; // 비밀번호
    const passwordCheck = document.getElementById('user-password-check').value; // 비밀번호확인
    const name = document.getElementById('user-name').value; // 이름
    const email = document.getElementById('user-email').value; // 이메일
    const phone = document.getElementById('user-phone').value; // 휴대폰번호
    const nickname = document.getElementById('user-nickname').value; // 닉네임

    if (
        !id ||
        !password ||
        !passwordCheck ||
        !name ||
        !email ||
        !phone ||
        !nickname
    ) {
        alert('빈칸을 모두 입력해주세요.');
        return;
    }

    // 비밀번호 확인
    if (password !== passwordCheck) {
        // 비밀번호 확인 입력칸 비우기
        let errorMessage = `<div class="signup-error-message">비밀번호가 일치하지 않습니다.</div>`;
        document
            .getElementById('signup-password-check-wrap')
            .insertAdjacentHTML('beforeend', errorMessage);
        document.getElementById('user-password-check').value = null;
        document.getElementById('user-password-check').focus();
        return;
    }

    const userInfo = {
        id,
        password,
        name,
        email,
        phone,
        nickname,
    };

    axios
        .post(`/api/user/signup`, userInfo)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            for (let errPosition of err.response.data.message) {
                signupErrorHandler(errPosition);
            }
        });
}

function signupErrorHandler(errorPosition) {
    console.log(errorPosition);
    const errorPositionDOM = document.getElementById(
        `signup-${errorPosition}-wrap`,
    );
    const errorPositionInputDOM = document.getElementById(
        `user-${errorPosition}`,
    );

    let errorMessage = `<div class="signup-error-message">형식이 일치하지 않습니다.</div>`;

    errorPositionDOM.insertAdjacentHTML('beforeend', errorMessage);
    errorPositionInputDOM.value = null;
}
