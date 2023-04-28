const profileImageView = document.getElementById('profile-image-view');
const profileImageInput = document.getElementById('profile-image');
const idInput = document.getElementById('id');
const nicknameInput = document.getElementById('nickname');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const updateBtn = document.getElementById('mypage-update-btn');

let isNicknameChanged = false;
let isEmailChanged = false;

let userInfo = {};

// 회원 정보
document.addEventListener('DOMContentLoaded', async () => {
    userInfo = await getUserInfo();

    // 요소에 값 넣기
    profileImageView.src = userInfo.profileImg;
    idInput.value = userInfo.id;
    nicknameInput.value = userInfo.nickname;
    nameInput.value = userInfo.name;
    emailInput.value = userInfo.email;
});

// 이미지 업로드
profileImageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/uploads/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    document.getElementById('profile-image-view').src =
        response.data.profileImagePath;
});

// 값 변경 감지
nicknameInput.addEventListener('input', (e) => {
    if (userInfo.nickname !== e.target.value) {
        isNicknameChanged = true;
    } else {
        isNicknameChanged = false;
    }

    updateBtn.disabled = !(isEmailChanged || isNicknameChanged);
});

emailInput.addEventListener('input', (e) => {
    if (userInfo.email !== e.target.value) {
        isEmailChanged = true;
    } else {
        isEmailChanged = false;
    }

    updateBtn.disabled = !(isEmailChanged || isNicknameChanged);
});

// 회원 정보 불러오기
async function getUserInfo() {
    try {
        const response = await axios.get('/api/users');

        const { email, id, name, nickname, profileImg } = response.data;

        const imgUrl = !profileImg
            ? '/images/default_profile_image.png'
            : profileImg;

        return { email, id, name, nickname, profileImg: imgUrl };
    } catch (error) {}
}

// 회원 정보 수정
async function updateUserInfo() {
    // 에러 메시지 초기화
    updateErrorRemove();

    let body = {};

    if (isNicknameChanged) body.nickname = nicknameInput.value;
    if (isEmailChanged) body.email = emailInput.value;

    console.log(body);

    try {
        const response = await axios.patch('/api/users', body);

        // 성공 시 페이지 새로고침
        window.location.reload();
    } catch (err) {
        console.log(err);

        const { error, message } = err.response.data;

        // 닉네임, 이메일 유효성 검사 에러
        if (error === 'VALIDATION_FAILD') {
            for (const errPosition of message) {
                mypageValidationErrorHandler(errPosition);
            }
        }

        // 중복 검사 에러
        if (error === 'Conflict') {
            mypageDuplicateErrorHandler(message);
        }
    }
}

// 회원 정보 유효성 검사 에러핸들러
function mypageValidationErrorHandler(errorPosition) {
    const errorMessage = `<div class="mypage-error-message">형식이 일치하지 않습니다.</div>`;

    document
        .querySelector(`.mypage-content-${errorPosition}-wrap`)
        .insertAdjacentHTML('beforeend', errorMessage);
}

// 회원 정보 중복 검사 에러핸들러
function mypageDuplicateErrorHandler(errorPosition) {
    let errorText = '';
    switch (errorPosition) {
        case 'nickname':
            errorText = '닉네임';
            break;
        case 'email':
            errorText = '이메일';
            break;
        default:
            break;
    }

    const errorMessage = `<div class="mypage-error-message">이미 사용중인 ${errorText}입니다.</div>`;

    document
        .querySelector(`.mypage-content-${errorPosition}-wrap`)
        .insertAdjacentHTML('beforeend', errorMessage);
}

// 에러메시지 초기화
function updateErrorRemove() {
    const targetElements =
        document.getElementsByClassName(`mypage-error-message`);

    while (targetElements.length > 0) {
        targetElements[0].parentNode.removeChild(targetElements[0]);
    }
}
