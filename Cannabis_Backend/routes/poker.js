let express = require('express');
let router = express.Router();

const { jwtVerify } = require('./middlewares');
const Room = require('../models').Room;

router.post('/', async (req, res)=>{
    const room = await Room.create({
        title: req.body.title,
        owner: req.body.owner,
        people: 1,
        bet: req.body.bet,
    });
    res.send('game room created');
});

router.get('/list', async (req, res)=>{
    const room = await Room.findAll({});
    res.json(room);
});

router.get('/', (req, res)=>{
   res.render('room.html');
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
    res.send(req.body.title);
});

module.exports = router;