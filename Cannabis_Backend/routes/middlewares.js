const jwt = require('jsonwebtoken');

exports.jwtVerify = (req, res, next) => {
    console.log(req);
    let token = req.cookies.token;
    if (token) {
        next();
    } else {
        res.redirect('/login/login.html');
    }
};

exports.newJwt = (user) => {
    const token = jwt.sign({
            nickname: user.nickname,
            id: user.id,
            yam: user.yam,
            realname: user.realname,
        },
        'jwt_secret',
        {
            expiresIn: '1h',
        });
    return token;
};