const userList = document.getElementById('user-list');
const userApplyList = document.getElementById('user-apply-list');
const idInput = document.getElementById('id');
const passwordInput = document.getElementById('password');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const nicknameInput = document.getElementById('nickname');
const phoneInput = document.getElementById('phone');
const profileImageView = document.getElementById('profile-image-view');
const profileImageInput = document.getElementById('profile-image');
const roleInput = document.getElementById('role');
const save = document.getElementById('save');

document.addEventListener('DOMContentLoaded', async () => {
    const usersInfo = await getUsersInfo();

    usersInfo.map((user) => {
        const { userId, id, name, email, nickname, phone, role } = user;

        const tr = document.createElement('tr');
        const idTd = document.createElement('td');
        const nameTd = document.createElement('td');
        const emailTd = document.createElement('td');
        const nicknameTd = document.createElement('td');
        const phoneTd = document.createElement('td');
        const roleTd = document.createElement('td');
        const adminTd = document.createElement('button');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.setAttribute('class', 'check');

        checkbox.value = userId;
        idTd.textContent = id;
        nameTd.textContent = name;
        emailTd.textContent = email;
        nicknameTd.textContent = nickname;
        phoneTd.textContent = phone;
        adminTd.textContent = '수정';

        if (role === 1) {
            roleTd.textContent = '관리자';
        }
        if (role === 2) {
            roleTd.textContent = '일반회원';
        }
        if (role === 3) {
            roleTd.textContent = '신청회원';
            adminTd.textContent = '승인';
        }
        adminTd.setAttribute('value', userId);

        tr.append(
            checkbox,
            idTd,
            nameTd,
            emailTd,
            nicknameTd,
            phoneTd,
            roleTd,
            adminTd,
        );
        if (role === 1 || role === 2) {
            userList.append(tr);
            adminTd.setAttribute('class', 'edit');
        } else {
            userApplyList.append(tr);
            adminTd.setAttribute('class', 'accept');
        }
    });

    // 하위 체크박스 체크 여부에 따른 전체 선택 체크박스 체크 변경
    $('.check').change(function () {
        if ($('.check:checked').length == $('.check').length) {
            $('#all-check').prop('checked', true);
        } else {
            $('#all-check').prop('checked', false);
        }
    });

    // 회원 정보 불러오기
    async function getUserInfo(userId) {
        try {
            const response = await axios.get(`/api/users/admin/${userId}`);

            const { id, name, email, nickname, phone, role, profileImg } =
                response.data;

            return {
                id,
                name,
                email,
                nickname,
                phone,
                profileImg,
                role,
            };
        } catch (error) {
            alert(error);
        }
    }

    // 회원 수정
    $('.edit').on('click', async function () {
        const userId = $(this).val();
        save.setAttribute('value', userId);
        const userInfo = await getUserInfo(userId);
        idInput.value = userInfo.id;
        nameInput.value = userInfo.name;
        emailInput.value = userInfo.email;
        nicknameInput.value = userInfo.nickname;
        phoneInput.value = userInfo.phone;
        profileImageView.src = userInfo.profileImg;
        roleInput.value = userInfo.role;
        $('.modal').fadeIn();
    });

    // 수정 모달 닫기
    $('.close').on('click', function () {
        $('.modal').fadeOut();
    });

    // 이미지 업로드
    profileImageInput.addEventListener('change', async (e) => {
        const userId = save.value;

        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.patch(
            `/api/uploads/admin/profile/${userId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        );

        document.getElementById('profile-image-view').src =
            response.data.profileImagePath;
    });

    // 수정 모달 저장
    $('.save').on('click', async function () {
        const userId = $(this).val();
        const id = idInput.value;
        const password = passwordInput.value;
        const name = nameInput.value;
        const email = emailInput.value;
        const phone = phoneInput.value;
        const nickname = nicknameInput.value;
        const role = Number(roleInput.value);

        let userInfo = { id, name, email, phone, nickname, role };

        if (password) {
            userInfo = {
                id,
                password,
                name,
                email,
                phone,
                nickname,
                role,
            };
        }

        axios
            .patch(`/api/users/admin/${userId}`, userInfo)
            .then((res) => {
                alert('수정하였습니다.');
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
                if (err.response.data.statusText === 'Validation Error') {
                    for (let errPosition of err.response.data.message) {
                        console.log(errPosition);
                        adminUserValidationErrorHandler(errPosition);
                    }
                }

                if (err.response.statusText === 'Conflict') {
                    console.log(err.response.data.message);
                    adminUserExistErrorHandler(err.response.data.message);
                }
            });
    });

    // 가입 승인
    $('.accept').on('click', function () {
        const userId = $(this).val();
        try {
            axios.patch(`/api/users/admin/accept/${userId}`);
            window.location.reload();
        } catch (error) {
            alert(error);
        }
    });

    // 회원 삭제
    $('.delete').on('click', function () {
        const userIdList = [];

        $('.check:checked').each(function () {
            const id = $(this).val();
            userIdList.push(id);
        });

        try {
            axios.delete(`/api/users/admin/${userIdList}`);
            window.location.reload();
        } catch (error) {
            alert(error);
        }
    });
});

async function getUsersInfo() {
    try {
        const response = await axios.get('/api/users/admin');
        return response.data;
    } catch (error) {
        alert(error);
    }
}

// 전체 선택 체크박스
$('#all-check').change(function () {
    if ($('#all-check').is(':checked')) {
        $('.check').prop('checked', true);
    } else {
        $('.check').prop('checked', false);
    }
});

function adminUserValidationErrorHandler(errorPosition) {
    const errorPositionElement = document.getElementById(
        `admin-user-${errorPosition}-wrap`,
    );
    const errorPositionInputElement = document.getElementById(
        `${errorPosition}`,
    );

    let errorMessage = `<div class="admin-user-error-message">형식이 일치하지 않습니다.</div>`;

    errorPositionElement.insertAdjacentHTML('beforeend', errorMessage);
    errorPositionInputElement.value = null;
}

function adminUserErrorRemove() {
    let targetElements = document.getElementsByClassName(
        'admin-user-error-message',
    );

    while (targetElements.length > 0) {
        targetElements[0].parentNode.removeChild(targetElements[0]);
    }
}

function adminUserExistErrorHandler(errorPosition) {
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
        `admin-user-${errorPosition}-wrap`,
    );
    const errorPositionInputElement = document.getElementById(
        `${errorPosition}`,
    );

    let errorMessage = `<div class="admin-user-error-message">이미 사용중인 ${errorText}입니다.</div>`;

    errorPositionElement.insertAdjacentHTML('beforeend', errorMessage);
    errorPositionInputElement.value = null;
}
