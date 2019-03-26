let express = require('express');
let router = express.Router();

const jwt = require('jsonwebtoken');
const { jwtVerify } = require('./middlewares');
const Room = require('../models').Room;

router.post('/', async (req, res)=>{
    console.log('cookie: ',req.cookies.token);
    let token = jwt.verify(req.cookies.token,'jwt_secret');
    const room = await Room.create({
        title: req.body.title,
        owner: token.nickname,
        bet: req.body.bet,
    });
    res.send(req.body.title);
});

router.get('/list', async (req, res)=>{
    const room = await Room.findAll({});
    res.json(room);
});

router.get('/', (req, res)=>{
   res.render('room.html');
});

router.get('/player', (req, res)=> {
    if(req.cookies.token) {
        let token = jwt.verify(req.cookies.token, 'jwt_secret');
        res.send(token.nickname);
    } else {
        res.send('request_invalid');
    }
});

router.get('/:title', async (req, res)=>{
    const room = await Room.findOne({
        where: {title: req.params.title}
    });
    if(room)
        res.render('indianPoker', {title: req.params.title});
    else
        res.send('존재하지 않는 방입니다');
});

router.get('/check/:title', async (req, res)=>{
    const room = await Room.findOne({
        where: {title: req.params.title}
    });
    if (room)
        res.send('duplicate');
    else
        res.send('OK');
});

router.post('/enter', (req, res)=>{
    if(req.headers['token'])
        res.send(req.body.title);
    else
        res.send('request_invalid');
    console.log('token received: ',req.headers['token']);
});

router.get('/owner/:title', async (req, res)=>{
    if(req.headers['token']) {
        const room = await Room.findOne({
            where: {title: req.params.title},
        });
        if (room)
            res.send(room.owner);
    }
    else
        res.send('request_invalid');
});

router.get('/ready/:title', async (req, res)=>{
   const room = await Room.findOne({
       where: {title: req.params.title},
   });
   if (room) {
       await Room.update({state: 'ready'},{where: {title: req.params.title}});
       res.send('OK');
   }
   else {
       res.send('fail')
   }
});

module.exports = router;