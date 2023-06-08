async function passwordReset() {
    const email = sessionStorage.getItem('email');
    const newPassword = document.getElementById('new-password').value;
    const newPasswordCheck =
        document.getElementById('new-password-check').value;

    if (!newPassword || !newPasswordCheck) {
        alert('빈칸을 모두 입력해 주세요.');
        return;
    }

    if (newPassword !== newPasswordCheck) {
        const errorMessage = `<div class="password-reset-error-message-wrap">비밀번호가 일치하지 않습니다</div>`;
        document.querySelector('.password-reset-error-message-wrap').innerHTML =
            errorMessage;
        return;
    }

    const body = {
        email,
        newPassword,
    };

    try {
        await axios.patch('/api/users/password-reset', body);

        alert('비밀번호 재설정이 완료되었습니다.');
        window.location.href = '/';
    } catch (err) {
        const { error } = err.response.data;

        if (error === 'VALIDATION_FAILD') {
            const errorMessage = `<div class="password-reset-error-message">형식이 일치하지 않습니다.</div>`;
            document.querySelector(
                '.password-reset-error-message-wrap',
            ).innerHTML = errorMessage;
        }
    }
}

function passwordChangeErrorRemove() {
    document.querySelector('.password-change-error-message-wrap').innerHTML =
        '';
}
