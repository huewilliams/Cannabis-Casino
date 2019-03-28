let express = require('express');
const random = require('random');
let router = express.Router();

const jwt = require('jsonwebtoken');
const {jwtVerify} = require('./middlewares');
const Room = require('../models').Room;
const User = require('../models').User;

const redis = require('redis');
const client = redis.createClient('18078', 'redis-18078.c10.us-east-1-2.ec2.cloud.redislabs.com');

client.auth('Br34hJvfhfuBY32qWS9Z69mO02cKcRMS');
client.on('error', (err) => {
    console.log(err);
});

router.post('/', async (req, res) => {
    console.log('cookie: ', req.cookies.token);
    let token = jwt.verify(req.cookies.token, 'jwt_secret');
    const room = await Room.create({
        title: req.body.title,
        owner: token.nickname,
        bet: req.body.bet,
    });
    res.send(req.body.title);
});

router.get('/list', async (req, res) => {
    const room = await Room.findAll({});
    res.json(room);
});

router.get('/', (req, res) => {
    res.render('room.html');
});

router.get('/player', (req, res) => {
    if (req.cookies.token) {
        let token = jwt.verify(req.cookies.token, 'jwt_secret');
        res.send(token.nickname);
    } else {
        res.send('request_invalid');
    }
});

router.get('/:title', async (req, res) => {
    const room = await Room.findOne({
        where: {title: req.params.title}
    });
    if (room)
        res.render('indianPoker', {title: req.params.title});
    else
        res.send('존재하지 않는 방입니다');
});

router.get('/check/:title', async (req, res) => {
    const room = await Room.findOne({
        where: {title: req.params.title}
    });
    if (room)
        res.send('duplicate');
    else
        res.send('OK');
});

router.post('/enter', (req, res) => {
    if (req.headers['token'])
        res.send(req.body.title);
    else
        res.send('request_invalid');
    console.log('token received: ', req.headers['token']);
});

// 게임의 방장을 반환하는 API
router.get('/owner/:title', async (req, res) => {
    if (req.headers['token']) {
        const room = await Room.findOne({
            where: {title: req.params.title},
        });
        if (room)
            res.send(room.owner);
    } else
        res.send('request_invalid');
});

// 게임의 초기 베팅 칩 개수를 반환하는 API
router.get('/bet/:title', async (req, res) => {
    if (req.headers['token']) {
        const room = await Room.findOne({
            where: {title: req.params.title},
        });
        if (room)
            res.send(room.bet +'chip');
    } else
        res.send('request_invalid');
});

// 인디언포커 2p 준비상태 DB 반영 API
router.get('/ready/:title', async (req, res) => {
    const room = await Room.findOne({
        where: {title: req.params.title},
    });
    if (room) {
        await Room.update({state: 'ready'}, {where: {title: req.params.title}});
        res.send('OK');
    } else {
        res.send('fail')
    }
});

// 카드 20장 초기화 세팅 API
router.get('/set/:title', async (req, res) => {
    let length;
    let deck = Array(20)
        .fill()
        .map((element, index) => {
            return index + 1;
        });
    // 리스트 비우기
    client.del('poker' + req.params.title);
    await deck.forEach(x => {
        client.lpush('poker' + req.params.title, x);
        console.log(x);
    });

    function getData(callback) {
        return new Promise((resolve, reject) => {
            client.llen('poker' + req.params.title, (err, res) => {
                resolve(res);
            });
        })
    }

    await getData().then((reply) => {
        length = reply;
    });
    if (length === 20)
        res.send('OK');
});

//TODO 카드 중복 처리하기

// 카드 한 장 더 뽑기 API
router.get('/draw/:title', async (req, res) => {
    let length;

    function getLength(callback) {
        return new Promise((resolve, reject) => {
            client.llen('poker' + req.params.title, (err, res) => {
                resolve(res);
            });
        })
    }

    await getLength().then((reply) => {
        length = reply;
    });

    let rand = random.integer(0, length - 1);
    let data;
    let duplicate;

    function getData(callback) {
        return new Promise((resolve, reject) => {
            client.lindex('poker' + req.params.title, rand, (err, res) => {
                resolve(res);
            });
        })
    }

    await getData().then((reply) => {
        data = reply;
    });

    function popData(callback) {
        return new Promise((resolve, reject) => {
            client.lrem('poker' + req.params.title, 1, data, (err, res) => {
                resolve(res);
            });
        })
    }

    await popData().then((reply) => {
        console.log(reply);
    });

    res.json(data);
});

router.get('/chip/:nickname', async (req, res)=>{
    let user = await User.findOne({
        where: {nickname: req.params.nickname},
    });

    if(user) {
        res.json(user.chip);
    }
});

module.exports = router;