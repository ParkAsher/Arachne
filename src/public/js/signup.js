function signup() {
    // 에러메시지 초기화
    signupErrorRemove();

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
        .post(`/api/users/signup`, userInfo)
        .then((res) => {
            alert('회원가입 신청을 하였습니다.');
            window.location.href = '/';
        })
        .catch((err) => {
            if (err.response.data.statusText === 'Validation Error') {
                for (let errPosition of err.response.data.message) {
                    signupValidationErrorHandler(errPosition);
                }
            }

            if (err.response.statusText === 'Conflict') {
                signupExistErrorHandler(err.response.data.message);
            }
        });
}

function signupValidationErrorHandler(errorPosition) {
    const errorPositionElement = document.getElementById(
        `signup-${errorPosition}-wrap`,
    );
    const errorPositionInputElement = document.getElementById(
        `user-${errorPosition}`,
    );

    let errorMessage = `<div class="signup-error-message">형식이 일치하지 않습니다.</div>`;

    errorPositionElement.insertAdjacentHTML('beforeend', errorMessage);
    errorPositionInputElement.value = null;
}

function signupErrorRemove() {
    let targetElements = document.getElementsByClassName(
        'signup-error-message',
    );

    while (targetElements.length > 0) {
        targetElements[0].parentNode.removeChild(targetElements[0]);
    }
}

function signupExistErrorHandler(errorPosition) {
    let errorText = '';
    switch (errorPosition) {
        case 'id':
            errorText = '아이디';
            break;
        case 'email':
            errorText = '이메일';
            break;
        case 'phone':
            errorText = '휴대폰번호';
            break;
        case 'nickname':
            errorText = '닉네임';
        default:
            break;
    }

    const errorPositionElement = document.getElementById(
        `signup-${errorPosition}-wrap`,
    );
    const errorPositionInputElement = document.getElementById(
        `user-${errorPosition}`,
    );

    let errorMessage = `<div class="signup-error-message">이미 사용중인 ${errorText}입니다.</div>`;

    errorPositionElement.insertAdjacentHTML('beforeend', errorMessage);
    errorPositionInputElement.value = null;
}
