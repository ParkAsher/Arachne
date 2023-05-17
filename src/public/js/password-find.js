// 비밀번호를 찾기 위해 유저정보를 체크하는 기능
async function checkUserForFindPassword() {
    const id = document.getElementById('user-id');
    const name = document.getElementById('user-name');
    const email = document.getElementById('user-email');

    // element의 데이터가 유효한지 확인
    const arrInvalidData = [id, name, email].filter(
        (element) => !isDataValid(element),
    );

    // element아래에 요구메세지를 프린트
    arrInvalidData.forEach((element) => dataValidErrorPrint(element));

    if (arrInvalidData.length !== 0) {
        return;
    }

    const body = {
        id: id.value.trim(),
        name: name.value.trim(),
        email: email.value.trim(),
    };

    try {
        const response = await axios.post(
            '/api/users/password-reset-request',
            body,
        );

        if (response.status === 200) {
            // 인증과정을 실행시키는 함수
            emailAuthenticationCode(email.value.trim());
        }
    } catch (err) {
        if (err.response.status === 404) {
            alert(err.response.data.message);
            return window.location.reload();
        }

        err.response.data.message.forEach((element) => {
            if (element === 'name') {
                dataValidErrorPrint(name);
            } else if (element === 'email') {
                dataValidErrorPrint(email);
            } else if (element === 'id') {
                dataValidErrorPrint(id);
            }
        });
    }
}

// 인증과정을 진행하는 함수
async function emailAuthenticationCode(email) {
    const authBtn = document.getElementById('auth-code-action-btn');
    authBtn.textContent = '인증 확인';
    // 인증 확인 API호출
    authBtn.onclick = () => verifyAuthenticationCode(email);

    const body = {
        email,
    };

    try {
        // 인증번호 인풋 생성
        createAuthInput();

        const result = await axios.post('/api/auth/send-auth-code', body);
        // 인증메일 보내는 API 호출
        alert('인증메일 보내는 API 호출');
        console.log(result);
    } catch (err) {
        console.log(err);
        alert(err);
    }
}

// element의 데이터가 유효한지 확인하는 기능
function isDataValid(element) {
    if (element.value.trim().indexOf(' ') !== -1) {
        return false;
    }

    if (element.nextSibling.tagName === 'SPAN') {
        element.parentNode.removeChild(element.nextSibling);
    }

    return true;
}

// element아래에 요구메세지를 프린트 해주는 기능
function dataValidErrorPrint(element) {
    // element 아래에 이미 요구메세지가 있다면 함수종료.
    if (element.nextSibling.tagName === 'SPAN') {
        return;
    }

    const newSpanElement = document.createElement('span');
    newSpanElement.style.color = 'red';

    if (element.id === 'user-id') {
        newSpanElement.textContent = '유효한 아이디를 입력해주세요.';
    } else if (element.id === 'user-name') {
        newSpanElement.textContent = '유효한 이름을 입력해주세요.';
    } else if (element.id === 'user-email') {
        newSpanElement.textContent = '유효한 이메일을 입력해주세요.';
    }

    newSpanElement.style.display = 'inline-block';
    newSpanElement.style.marginTop = '10px';
    element.parentNode.insertBefore(newSpanElement, element.nextSibling);
}

function verifyAuthenticationCode() {
    const authCodeInput = document.getElementById('auth-code');

    try {
        // 인증번호 확인 API 호출
        alert(`인증번호 확인 API 호출 ${authCodeInput.value.trim()}전달`);

        // 인증 성공시 - 재설정페이지
        // window.location.href = '/password-reset';
        alert('인증 성공! 재설정 페이지로 이동');
    } catch (error) {
        // 인증 실패 시 - 인증 실패 메세지
        // alert(err.response.data.message);
        alert('인증 실패! 에러메세지 출력');
    }
}

// 인증번호 인풋 생성 기능
function createAuthInput() {
    const authCodeWrap = document.createElement('div');
    authCodeWrap.id = 'password-find-auth-code-wrap';
    authCodeWrap.className = 'password-find-data';

    const authCodeLabel = document.createElement('div');
    authCodeLabel.className = 'password-find-label';
    authCodeLabel.textContent = '인증번호';

    const authCodeInput = document.createElement('input');
    authCodeInput.type = 'text';
    authCodeInput.id = 'auth-code';
    authCodeInput.placeholder = '인증번호';

    authCodeWrap.appendChild(authCodeLabel);
    authCodeWrap.appendChild(authCodeInput);

    const emailWrap = document.getElementById('password-find-email-wrap');
    emailWrap.insertAdjacentElement('afterend', authCodeWrap);
}
