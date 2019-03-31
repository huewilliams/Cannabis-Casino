// [인게임 로직] 칩 베팅 이벤트
function better() {
    let text, chip;
    while (isNaN(text))
        text = parseInt(prompt("베팅금액을 입력하세요"));
    console.log(text);
    if (me === 'p1')
        chip = document.getElementById('p1_chip');
    else
        chip = document.getElementById('p2_chip');
    let str = chip.textContent.substring(7);
    if (text > Number(str)) {
        alert("보유 칩보다 베팅 금이 높아 베팅할 수 없습니다!");
    } else {
        if (text) {
            let call = document.getElementById('call');
            let calltext = call.textContent.substring(7);
            if (text <= Number(calltext)) {
                alert("베팅은 상대방의 콜보다 높아야 합니다");
            } else {
                socket.emit('bet', {
                    room: room,
                    call: text
                });
                if (me === 'p1') {
                    let nick = document.getElementById('p1_name');
                    let data = {
                        nickname: nick.textContent,
                        chip: -text,
                    };
                    axios({
                        method: 'post',
                        url: `http://${host}:5000/poker/chip`,
                        data: data,
                        headers: {
                            token: document.cookie,
                        }
                    }).then((res) => {
                        socket.emit('set_chip', {player: me, room: room, chip: res.data.chip});
                    });
                    socket.emit('p2_turn', room);
                } else {
                    let nick = document.getElementById('p2_name');
                    let data = {
                        nickname: nick.textContent,
                        chip: -text,
                    };
                    axios({
                        method: 'post',
                        url: `http://${host}:5000/poker/chip`,
                        data: data,
                        headers: {
                            token: document.cookie,
                        }
                    }).then((res) => {
                        socket.emit('set_chip', {player: me, room: room, chip: res.data.chip});
                    });
                    socket.emit('p1_turn', room);
                }
            }
        }
    }
}

// [인게임 로직] 베팅 콜 이벤트
function caller() {
    if (me === 'p1') {
        let call = document.getElementById('call');
        let text = call.textContent.substring(7);
        let nick = document.getElementById('p1_name');
        let data = {
            nickname: nick.textContent,
            chip: -text,
        };
        axios({
            method: 'post',
            url: `http://${host}:5000/poker/chip`,
            data: data,
            headers: {
                token: document.cookie,
            }
        }).then((res) => {
            socket.emit('set_chip', {player: me, room: room, chip: res.data.chip});
        });
        socket.emit('call_pop', room);
        socket.emit('p2_turn', room);
    } else {
        let call = document.getElementById('call');
        let text = call.textContent.substring(7);
        let nick = document.getElementById('p2_name');
        let data = {
            nickname: nick.textContent,
            chip: -text,
        };
        axios({
            method: 'post',
            url: `http://${host}:5000/poker/chip`,
            data: data,
            headers: {
                token: document.cookie,
            }
        }).then((res) => {
            socket.emit('set_chip', {player: me, room: room, chip: res.data.chip});
        });
        socket.emit('call_pop', room);
        socket.emit('p1_turn', room);
    }
}

// [인게임 로직] die 이벤트
function dier() {
    if (me === 'p1') {
        youLost('p2');
    } else {
        youLost('p1');
    }
}

// [인게임 로직] open 이벤트
function opener() {
    let call = document.getElementById('call');
    let text = call.textContent.substring(7);
    if(Number(text) > 0) {
        alert('오픈은 call betting 칩 수가 0일 때만 가능합니다!');
    } else {
        if(me === 'p1') {
            socket.emit('send_card', {
                player: 'p2',
                room: room,
                card: others_card,
            })
        } else {
            socket.emit('send_card', {
                player: 'p1',
                room : room,
                card: others_card,
            })
        }
    }
}