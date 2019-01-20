let express = require('express');
let qs = require('qs');
const axios = require('axios');

let router = express.Router();

router.get('/login', (req, res)=>{
    res.redirect('/login/login.html');
});

router.get('/signUp', (req, res)=>{
    res.redirect('/signup/signup.html');
});

// PHP 서버로 요청을 보내 token 을 발급받아 전달해주는 API
router.post('/token', (req, res)=>{
    let data = {
        id: req.body.id,
        password: req.body.password
    };
    axios.post('https://cannabis-casino.herokuapp.com/control/signin.php', qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
    ).then((response)=>{
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write(response.headers.authorization);
        res.end();
    })
});

module.exports = router;