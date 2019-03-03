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

router.get('/signUp', (req, res) => {
    res.redirect('/signup/signup.html');
});

// PHP 서버로 요청을 보내 token 을 발급받아 전달해주는 API
router.post('/token', (req, res) => {
    let data = {
        id: req.body.id,
        password: req.body.password
    };
    axios.post('https://cannabis-casino.herokuapp.com/control/signin.php', qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
    ).then((response) => {
        if (!response.headers.authorization)
            res.send('err');
        res.cookie('token',response.headers.authorization);
        res.redirect('/');
    })
});



module.exports = router;