function checkUserForFindId() {
    const name = document.getElementById('user-name');
    const email = document.getElementById('user-email');

    const body = {
        name: name.value.trim(),
        email: email.value.trim(),
    };
    
    axios
        .post('/api/users/find-user-id', body)
        .then((res) => {
            userID = res.data.id;
            alert(`회원님의 아이디는 ${userID} 입니다.`);
        })
        .catch((err) => {
            alert('해당 이름과 이메일에 일치하는 아이디가 없습니다.');
        });
}
