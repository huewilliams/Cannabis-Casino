// 플레이어 이름 매칭
let p1 = document.getElementById('p1_name');
let p2 = document.getElementById('p2_name');
let state = document.getElementById('state');
let me = '';
let dealer = document.getElementById('dealer');

// 채팅 이벤트
socket.on('message', async (data) => {
    console.log('log', data);
    let chatList = document.getElementById('chat_list');
    let message = document.createElement('p');
    message.textContent = data.chat;
    message.classList.add(`${data.player}_chat`);
    chatList.append(message);
    let scroll = document.getElementById('chat_list');
    scroll.scrollTop = scroll.scrollHeight;
    console.log(scroll.scrollHeight);
});

socket.on('dealer', (data) => {
    dealer.textContent = data;
});

let others_card;

function not() {
    let bet = document.getElementById('game_bet');
    let die = document.getElementById('game_die');
    let call = document.getElementById('game_call');
    let open = document.getElementById('game_open');

    bet.removeEventListener('click', better);
    call.removeEventListener('click', caller);
    die.removeEventListener('click', dier);
    open.removeEventListener('click', opener);
}

function yes() {
    let bet = document.getElementById('game_bet');
    let die = document.getElementById('game_die');
    let call = document.getElementById('game_call');
    let open = document.getElementById('game_open');

    bet.addEventListener('click', better);
    call.addEventListener('click', caller);
    die.addEventListener('click', dier);
    open.addEventListener('click', opener);
}

socket.on('set_chip', (data) => {
    if (data.player === 'p1') {
        let chip = document.getElementById('p1_chip');
        chip.textContent = '보유 칩 : ' + data.chip;
    } else {
        let chip = document.getElementById('p2_chip');
        chip.textContent = '보유 칩 : ' + data.chip;
    }
});

socket.on('call_pop', () => {
    let call = document.getElementById('call');
    let total = document.getElementById('total');
    console.log('total :', total.textContent);
    console.log('call : ', call.textContent);
    console.log('total :', total.textContent.substring(12));
    console.log('call : ', call.textContent.substring(7));
    total.textContent = 'TOTAL BET : ' + (Number(total.textContent.substring(12)) + Number(call.textContent.substring(7)) * 2);
    call.textContent = 'CALL : 0';
});

socket.on('open_p1', (data) => {
    if (me === 'p2') {
        let p2_card = document.getElementById('p2_card');
        p2_card.src = `http://${host}:5000/img/${data}.png`;
    }
});

socket.on('open_p2', (data) => {
    if (me === 'p1') {
        let p1_card = document.getElementById('p1_card');
        p1_card.src = `http://${host}:5000/img/${data}.png`;
    }
});

function none() {
    let game_bet = document.getElementById('game_bet');
    let game_call = document.getElementById('game_call');
    let game_die = document.getElementById('game_die');
    let game_open = document.getElementById('game_open');
    game_bet.style.display = 'none';
    game_call.style.display = 'none';
    game_die.style.display = 'none';
    game_open.style.display = 'none';
    let button2 = document.getElementById('continue');
    let button3 = document.getElementById('out');
    button2.style.display = 'inline';
    button3.style.display = 'inline';
}

socket.on('all_pop', () => {
    let total = document.getElementById('total');
    total.textContent = 'TOTAL BET : 0';
});

function turnOn() {
    let turn_img = document.getElementById('turn_change');
    turn_img.style.display = 'inline';
}

function turnOff() {
    let turn_img = document.getElementById('turn_change');
    turn_img.style.display = 'none';
}

socket.on('call', (data) => {
    let call = document.getElementById('call');
    call.textContent = `CALL : ${data}`
});

// p1 턴 (p1 : 버튼 4개 이벤트 활성화 / p2 : 버튼 4개 이벤트 비활성화)
socket.on('p1_turn', () => {
    if (me === 'p1') {
        turnOn();
        setTimeout(turnOff, 1000);
        yes()
    } else {
        not();
    }
});

//p2 턴
socket.on('p2_turn', () => {
    if (me === 'p2') {
        turnOn();
        setTimeout(turnOff, 1000);
        yes()
    } else {
        not();
    }
});