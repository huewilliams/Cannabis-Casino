let express = require('express');

const { jwtVerify } = require('./middlewares');

let router = express.Router();

router.get('/', (req, res) => {
    res.render('./build/index.html');
});

router.get('/new', (req, res)=> {
   res.redirect('signup/signup.html');
});

router.get('/req', (req, res)=> {
    res.json({time: global.time});
});

router.get('/join', (req, res)=>{
    res.render('indianPoker', {title:'소켓 테스토'});
});
module.exports = router;