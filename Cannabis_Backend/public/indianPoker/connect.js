// 2p 접속 이벤트
socket.on('2p', (data) => {
    axios({
        method: 'get',
        url: `http://${host}:5000/poker/chip/${data}`,
    }).then((res) => {
        let chipText = document.getElementById('p2_chip');
        chipText.textContent = '보유 칩 : ' + res.data;
    });
    p2.textContent = data;
    console.log('2p event!');
});

//2p 퇴장 이벤트
socket.on('2p_out', () => {
    console.log('2p out!');
    p2.textContent = 'none';
});

//1p 퇴장 이벤트
socket.on('1p_out', () => {
    p1.textContent = p2.textContent;
    p2.textContent = 'none';
});

// 2p 게임 준비 이벤트
socket.on('ready', () => {
    state.textContent = '준비 완료!'
});

// 2p 퇴장시 대기(상태초기화) 이벤트
socket.on('wait', () => {
    state.textContent = '준비안함'
});

// 다른 유저 되장 이벤트
socket.on('other_out', async () => {
    let my_nick;
    if (me === 'p1')
        my_nick = p1.textContent;
    else
        my_nick = p2.textContent;
    let state = document.getElementById('state');
    state.textContent = '준비안함';
    socket.emit('remain', {
        player: me,
        nick: my_nick,
    });
    console.log('me : ', me);
    socket.emit('chat', {
        chat: '다른 유저가 나갔습니다',
        room: room,
        player: 'system',
    })
});

// 게임 시작 이벤트
socket.on('game_start', () => {
    dealer.textContent = '게임이 시작되었습니다. 왼쪽이 p1, 오른쪽이 p2 입니다.';
    axios({
        method: 'get',
        url: `http://${host}:5000/poker/draw/${room}`,
    }).then((res) => {
        if (me === 'p1') {
            socket.emit('set2p', res.data);
            socket.emit('p1_turn');
        } else
            socket.emit('set1p', res.data);
        let deck = document.getElementById('deck_num');
        deck.textContent = Number(deck.textContent) - 2;
    });
});

// p1 카드 설정
socket.on('set1p', (data) => {
    others_card = data;
    let cardOfP1 = document.getElementById('p1_card');
    cardOfP1.src = `http://${host}:5000/img/${data}.png`;
});

// p2 카드 설정
socket.on('set2p', (data) => {
    others_card = data;
    let cardOfP2 = document.getElementById('p2_card');
    cardOfP2.src = `http://${host}:5000/img/${data}.png`;
});

function getChip(me, chip) {
    if (me === 'p1') {
        let chipText = document.getElementById('p1_chip');
        chipText.textContent = '보유 칩 : ' + chip;
    } else {
        let chipText = document.getElementById('p2_chip');
        chipText.textContent = '보유 칩 : ' + chip;
    }
}