const jwt = require('jsonwebtoken');

exports.jwtVerify = async (req, res, next) => {
    try {
        console.log(req);
        let token = req.headers['token'];
        await jwt.verify(token, 'jwt_secret');
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
            profile: user.profile,
        },
        'jwt_secret',
        {
            expiresIn: '10000m',
        });
    return token;
};

exports.verify = (req) => {
    const token = req.headers['token'];
    // let test = token.substring(6);
    if (token) {
        const result = jwt.verify(token, 'jwt_secret');
        return result;
    } else
        return 'invalid';
};