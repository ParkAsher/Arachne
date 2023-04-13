function signin() {
    signinErrorRemove();

    const id = document.getElementById('user-id').value;
    const password = document.getElementById('user-password').value;

    if (!id || !password) {
        alert('빈칸을 모두 입력해주세요.');
        return;
    }

    const userInfo = { id, password };

    axios
        .post(`/api/users/signin`, userInfo)
        .then((res) => {
            window.location.href = '/';
        })
        .catch((err) => {
            signinErrorHandler(err.response.data.message);
        });
}

function signinErrorHandler(message) {
    let errorMessage = `<div class="signin-error-message">${message}</div>`;

    document
        .querySelector('.signin-form')
        .insertAdjacentHTML('beforeend', errorMessage);
}

function signinErrorRemove() {
    let targetElements = document.getElementsByClassName(
        'signin-error-message',
    );

    while (targetElements.length > 0) {
        targetElements[0].parentNode.removeChild(targetElements[0]);
    }
}
