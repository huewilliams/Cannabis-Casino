let express = require('express');
let router = express.Router();

const { jwtVerify } = require('./middlewares');
const Room = require('../models').Room;

router.post('/', jwtVerify, async (req, res)=>{
    const room = await Room.create({
        title: req.body.title,
        owner: req.body.owner,
    });
    res.send('game room created');
});

module.exports = router;