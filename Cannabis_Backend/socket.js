// Cannabis Casino back-end 로직
const SocketIO = require('socket.io');
const Room = require('./models').Room;

module.exports = (server, app) => {
    const io = SocketIO(server, {path: '/socket.io'});
    app.set('io', io);

    const game = io.of('/game');

    game.on('connection', (socket) => {
        let tmp;
        let p1money, p2money;
        console.log('게임에 플레이어 접속');
        socket.emit('join');
        socket.on('enter', async (data) => {
            let room = await Room.findOne({
                where: {title: data},
            });
            let people = room.people + 1;
            await Room.update({people: people}, {where: {title: data}});
            console.log(data, ' 게임방에 입장하였습니다');
            tmp = data;
            await socket.join(data);
            game.in(data).emit('message', {
                player: 'system',
                chat: '새로운 유저가 게임방에 입장하였습니다'
            });
            console.log(socket.adapter.rooms[data]);
        });

        socket.on('chat', (data) => {
            console.log(data);
            console.log(socket.adapter.rooms[data.room]);
            game.in(data.room).emit('message', data);
        });

        socket.on('new', (data) => {
            game.in(data.room).emit('2p', data.player);
        });

        socket.on('remain', async (data) => {
            console.log('remain event : ', data);
            if (data.player === 'p1')
                game.in(tmp).emit('2p_out');
            if (data.player === 'p2') {
                let room = await Room.update({owner: data.nick}, {where: {title: tmp}});
                game.in(tmp).emit('1p_out');
                game.in(tmp).emit('message', {
                    player: 'system',
                    chat: '방장이 바뀌었습니다'
                });
            }
        });

        socket.on('ready', () => {
            game.in(tmp).emit('ready');
            game.in(tmp).emit('message', {
                player: 'system',
                chat: '플레이어가 준비되었습니다'
            })
        });

        socket.on('game_start', () => {
            game.in(tmp).emit('game_start');
        });

        socket.on('set1p', (data) => {
            p1money = data; //p1의 상대편의 카드(p2의 카드)
            socket.emit('set1p', p1money);
        });

        socket.on('set2p', (data) => {
            p2money = data;
            socket.emit('set2p', p2money);
        });

        socket.on('set_chip', (data) => {
            game.in(data.room).emit('set_chip', data);
        });

        socket.on('p1_turn', () => {
            game.in(tmp).emit('p1_turn');
            game.in(tmp).emit('dealer', 'p1 님의 턴입니다. p1님은 행동을 결정해주세요.');
        });

        socket.on('p2_turn', (data) => {
            game.in(data).emit('p2_turn');
            game.in(data).emit('dealer', 'p2 님의 턴입니다. p2님은 행동을 결정해주세요.');
        });

        socket.on('bet', (data) => {
            game.in(data.room).emit('call', data.call);
        });

        socket.on('call_pop', (data) => {
            game.in(data).emit('call_pop');
        });

        socket.on('app_pop', (room) => {
            game.in(room).emit('all_pop');
        });

        socket.on('open', (data) => {
            if (data.player === 'p1')
                game.in(data.room).emit('open_p1', data.card);
            else
                game.in(data.room).emit('open_p2', data.card);
        });

        socket.on('win', (data) => {
            if (data.player === 'p1')
                game.in(data.room).emit('win_p1');
            else
                game.in(data.room).emit('win_p2');
        });

        socket.on('lost', (data) => {
           game.in(data.room).emit('lost', data.player);
        });

        socket.on('send_card', (data)=>{
            game.in(data.room).emit('battle', {
                player: data.player,
                card: data.card,
            })
        });

        socket.on('disconnect', async () => {
            game.in(tmp).emit('other_out');
            console.log('플레이어가 게임을 떠났습니다');
            socket.leave(tmp);
            let room = await Room.findOne({
                where: {title: tmp},
            });
            let people = room.people - 1;
            Room.update({people: people}, {where: {title: tmp}});
            // 소켓에 접속한 사람이 한 명도 없다면 방 제거
            if (!socket.adapter.rooms[tmp]) {
                await Room.destroy({
                    where: {title: tmp},
                });
            }
        });
    });
};