let express = require('express');
let router = express.Router();

const { jwtVerify } = require('./middlewares');
const Room = require('../models').Room;

router.post('/', jwtVerify, async (req, res)=>{
    const room = await Room.create({
        title: req.body.title,
        owner: req.body.owner,
        people: 1,
        bet: req.body.bet,
    });
    res.send('game room created');
});

router.get('/', jwtVerify, async (req, res)=>{
    const room = await Room.findAll({});
    res.json(room);
});

module.exports = router;