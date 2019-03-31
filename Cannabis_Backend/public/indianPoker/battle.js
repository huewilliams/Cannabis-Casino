function youLost(player) {
    socket.emit('all_pop', room);
    let lost = document.getElementById('youLost');
    lost.style.display = 'inline';
    none();
    socket.emit('open', {
        room: room,
        card: others_card,
        player: me,
    });
    socket.emit('win', {
        room: room,
        player: player,
    });
}

function youWin(player) {
    socket.emit('all_pop', room);
    let win = document.getElementById('youWin');
    win.style.display = 'inline';
    none();
    socket.emit('open', {
        room: room,
        card: others_card,
        player: me,
    });
    socket.emit('lost', {
        room: room,
        player: player,
    });
}

socket.on('battle', (data)=>{
    let player;
    if(me === data.player) {
        if(me === 'p1')
            player = 'p2';
        else
            player = 'p1';
        if(Number(others_card) > Number(data.card)) {
            youLost(player);
        } else {
            let nick = document.getElementById(`${me}_name`);
            let text = document.getElementById('total');
            let data = {
                nickname: nick.textContent,
                chip: text.textContent.substring(12),
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
            youWin(player);
        }
    }
});


socket.on('win_p1', () => {
    if (me === 'p1') {
        let win = document.getElementById('youWin');
        win.style.display = 'inline';

        let nick = document.getElementById('p1_name');
        let text = document.getElementById('total');
        let data = {
            nickname: nick.textContent,
            chip: text.textContent.substring(12),
        };
        axios({
            method: 'post',
            url: `http://${host}:5000/poker/chip`,
            data: data,
            headers: {
                token: document.cookie,
            }
        }).then((res) => {
            socket.emit('set_chip', {player: 'p1', room: room, chip: res.data.chip});
        });
        none();
        socket.emit('all_pop', room);
        socket.emit('open', {
            room: room,
            card: others_card,
            player: me,
        });
    }
});

socket.on('win_p2', () => {
    if(me === 'p2') {
        let win = document.getElementById('youWin');
        win.style.display = 'inline';

        let nick = document.getElementById('p2_name');
        let text = document.getElementById('total');
        let data = {
            nickname: nick.textContent,
            chip: text.textContent.substring(12),
        };
        axios({
            method: 'post',
            url: `http://${host}:5000/poker/chip`,
            data: data,
            headers: {
                token: document.cookie,
            }
        }).then((res) => {
            socket.emit('set_chip', {player: 'p2', room: room, chip: res.data.chip});
        });
        none();
        socket.emit('all_pop', room);
        socket.emit('open', {
            room: room,
            card: others_card,
            player: me,
        });
    }
});

socket.on('lost', (data) => {
    if(me === data) {
        let lost = document.getElementById('youLost');
        lost.style.display = 'inline';
        none();
        socket.emit('all_pop', room);
        socket.emit('open', {
            room: room,
            card: others_card,
            player: me,
        });
    }
});