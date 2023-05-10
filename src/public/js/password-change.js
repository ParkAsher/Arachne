async function passwordChange() {
    passwordChangeErrorRemove();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const newPasswordCheck =
        document.getElementById('new-password-check').value;

    if (!currentPassword || !newPassword || !newPasswordCheck) {
        alert('빈칸을 모두 입력해주세요.');
        return;
    }

    // 새 비밀번호 확인
    if (newPassword !== newPasswordCheck) {
        const errorMessage = `<div class="password-change-error-message">비밀번호가 일치하지 않습니다.</div>`;
        document.querySelector(
            '.password-change-error-message-wrap',
        ).innerHTML = errorMessage;
        return;
    }

    const body = {
        currentPassword,
        newPassword,
    };

    try {
        await axios.patch('/api/users/password-change', body);

        alert('비밀번호를 성공적으로 변경하였습니다.');
        window.location.href = '/';
    } catch (err) {
        const { error, message } = err.response.data;

        // 비밀번호 형식 일치하지 않음
        if (error === 'VALIDATION_FAILD') {
            const errorMessage = `<div class="password-change-error-message">형식이 일치하지 않습니다.</div>`;
            document.querySelector(
                '.password-change-error-message-wrap',
            ).innerHTML = errorMessage;
        }

        // 현재 비밀번호 일치하지 않음
        if (error === 'Unauthorized') {
            const errorMessage = `<div class="password-change-error-message">${message}</div>`;
            document.querySelector(
                '.password-change-error-message-wrap',
            ).innerHTML = errorMessage;
        }
    }
}

function passwordChangeErrorRemove() {
    document.querySelector('.password-change-error-message-wrap').innerHTML =
        '';
}
