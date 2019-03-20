const jwt = require('jsonwebtoken');

exports.jwtVerify = async (req, res, next) => {
    try {
        console.log(req);
        let token = req.headers['token'];
        await jwt.verify(token,'jwt_secret');
        next();
    } catch (e) {
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
            expiresIn: '15m',
        });
    return token;
};

exports.verify = () => {
    const token = req.headers['token'];
    const result = jwt.verify(token, 'jwt_secret');
    return result;
};