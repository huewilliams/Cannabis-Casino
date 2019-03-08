const express = require('express');

const router = express.Router();
const { verify } = require('./middlewares');

router.get('/img/:nickname', (req, res)=> {
    //let token = req.cookies.token;
    //let userInfo = verify(token);
    //res.send(`http://localhost:5000/${userInfo.nickname}.jpg`);
    res.send(`huewilliams`);
});

router.get('/', (req,res)=>{
    let token = req.cookies.token;
    let userInfo = verify(token);
    res.send(userInfo.nickname);
});

module.exports = router;