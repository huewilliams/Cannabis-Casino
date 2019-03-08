let express = require('express');

const { jwtVerify } = require('./middlewares');

let router = express.Router();

router.get('/', jwtVerify, (req, res) => {
    res.render('index.html');
});

router.get('/new', (req, res)=> {
   res.redirect('signup/signup.html');
});

module.exports = router;