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

router.get('/', async (req, res)=>{
    const room = await Room.findAll({});
    res.json(room);
});

router.get('/:title', async (req, res)=>{
   const room = await Room.findOne({
       where: {title: req.params.title}
   });
   if(room) {
       res.send('duplicate');
   } else {
       res.send('OK');
       const io = req.app.get('io');
       res.render('indianPoker', {title: req.params.title});
       io.of('/game').emit('new', req.params.title);
   }
});

module.exports = router;