const express = require('express');

const router = express.Router();
const { verify } = require('./middlewares');
const User = require('../models').User;

router.get('/img/:nickname', async (req, res, next)=> {
    try {
        let user = await User.findOne({
            where: {nickname: req.params.nickname}
        });
        res.send(`http://localhost:5000/${user.profile}`);
    } catch (e) {
        next(e);
    }
});

router.get('/nick', (req,res)=>{
    let token = req.cookies.token;
    let userInfo = verify(token);
    res.send(userInfo.nickname);
});

router.get('/real', (req, res)=>{
    let token = req.cookies.token;
    let userInfo = verify(token);
    res.send(userInfo.realname);
});

module.exports = router;