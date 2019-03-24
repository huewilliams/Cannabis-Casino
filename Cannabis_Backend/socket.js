// Cannabis Casino back-end 로직
const SocketIO = require('socket.io');
const Room = require('./models').Room;

module.exports = (server, app) => {
    const io = SocketIO(server, {path: '/socket.io'});
    app.set('io', io);

    const game = io.of('/game');

    game.on('connection', (socket) => {
        let tmp;
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

        socket.on('disconnect', async () => {
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