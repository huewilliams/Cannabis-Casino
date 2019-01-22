let express = require('express');

const { jwtVerify } = require('./middlewares');

let router = express.Router();

router.get('/', jwtVerify, (req, res) => {
    res.render('index.html');
});

module.exports = router;