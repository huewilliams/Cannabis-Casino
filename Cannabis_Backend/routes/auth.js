let express = require('express');
let qs = require('qs');
let router = express.Router();

const User = require('../models').User;
const { newJwt } = require('./middlewares');

router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {id: req.body.id, password: req.body.password}
        });
        if(user) {
            const token = newJwt(user);
            res.cookie('token',token);
            res.redirect('/');
        } else {
            let error = new Error('아이디 혹은 비밀번호 틀림');
            throw error;
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/signUp', async (req, res, next) => {
    try {
        await User.create({
            id: req.body.id,
            realname: req.body.realName,
            password: req.body.password,
            email: req.body.email,
            nickname: req.body.nickname
        });
        res.redirect('/');
    } catch (e) {
        next(e);
    }
});

module.exports = router;