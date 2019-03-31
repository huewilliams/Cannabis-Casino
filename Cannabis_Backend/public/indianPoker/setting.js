var host = '18.220.117.207';

// 덱에 커서 올릴시 현재 카드 수 보여줌
let deck = document.getElementById('deck');
deck.addEventListener('mouseenter', () => {
    let modal = document.getElementById('modal');
    modal.style.display = 'inline';
});
deck.addEventListener('mouseout', () => {
    let modal = document.getElementById('modal');
    modal.style.display = 'none';
});

// 게임 계속하기, 게임 나가기 버튼 이벤트
let game_continue = document.getElementById('continue');
game_continue.addEventListener('click', () => {
    window.location.reload();
});
let game_out = document.getElementById('out');
game_out.addEventListener('click', () => {
    window.location.href = `http://${host}:5000/poker`;
});

// 소켓 접속
var socket = io.connect(`http://${host}:5000/game`, {
    path: '/socket.io',
});

// 엔터키 이벤트
function onKeyDown() {
    if (event.keyCode === 13) {
        chatting();
    }
}

// 채팅 전송 버튼 이벤트
let submit = document.getElementById('chat_submit');
submit.addEventListener('click', () => {
    chatting();
});

// 채팅 전송 로직
function chatting() {
    let input = document.getElementById('chat_input');
    socket.emit('chat', {
        chat: input.value,
        room: room,
        player: me,
    });
    input.value = '';
}

// 게임 방 접속 이벤트
socket.on('join', async () => {
    await axios({
        method: 'post',
        url: `http://${host}:5000/poker/enter`,
        data: send,
        headers: {
            token: document.cookie,
        }
    })
        .then((res) => {
            if (res.data == 'request_invalid') {
                alert('로그인이 필요한 서비스입니다. 메인페이지로 이동합니다.');
                window.location.href = `http://${host}:5000/`;
            }
            getNick(res.data);
            socket.emit('enter', res.data);
            return;
        });
    console.log(room);
});

// 플레이어 닉네임, 1p-2p 판단 및 설정
function getNick(data) {
    axios({
        method: 'get',
        url: `http://${host}:5000/poker/owner/${data}`,
        headers: {
            token: document.cookie,
        }
    }).then((res) => {
        if (res.data === 'request_invalid') {
            alert('로그인이 필요한 서비스입니다. 메인페이지로 이동합니다.');
            window.location.href = `http://${host}:5000/`;
        } else {
            p1.textContent = res.data.nickname;
            let chipText = document.getElementById('p1_chip');
            chipText.textContent = '보유 칩 : ' + res.data.chip;
        }
        axios({
            method: 'get',
            url: `http://${host}:5000/poker/player`,
            headers: {
                token: document.cookie,
            }
        }).then((res) => {
            if (p1.textContent === res.data.nickname) {
                me = 'p1';
                getChip(me, res.data.chip);
                console.log('chip : ', res.data.chip);
                let list = document.getElementById('player_list');
                let start = document.createElement('button');
                start.textContent = 'start!';
                start.setAttribute('id', 'ready');
                start.addEventListener('click', () => {
                    let state = document.getElementById('state');
                    if (state.textContent === '준비 완료!') {
                        ready.style.backgroundColor = 'green';
                        ready.style.color = 'black';
                        axios({
                            method: 'get',
                            url: `http://${host}:5000/poker/set/${room}`,
                        }).then((res) => {
                            console.log(res.data);
                            socket.emit('game_start');
                            start.disabled = 'disabled';
                        });
                    } else {
                        alert("아직 플레이어가 준비되지 않았습니다!");
                    }
                });
                list.append(start);
            } else {
                me = 'p2';
                getChip(me, res.data.chip);
                let list = document.getElementById('player_list');
                let ready = document.createElement('button');
                ready.textContent = 'ready!';
                ready.setAttribute('id', 'ready');
                ready.addEventListener('click', () => {
                    ready.style.backgroundColor = 'green';
                    ready.style.color = 'black';
                    axios({
                        method: 'get',
                        url: `http://${host}:5000/poker/ready/${room}`,
                    }).then((res) => {
                        if (res.data === 'OK') {
                            socket.emit('ready');
                        }
                    }).catch((err) => {
                        console.error(err);
                    });
                    ready.disabled = 'disabled';
                });
                list.append(ready);

                p2.textContent = res.data.nickname;
                socket.emit('new', {
                    player: res.data.nickname,
                    room: room,
                });
                console.log('data', res.data);
            }
        })
    });
}