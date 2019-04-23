const User = require('../models').User;
const { verify } = require('./middlewares');

exports.updateYam = async (req, res, next, upYam) => {
    let userInfo = verify(req);
    let user = await User.findOne({
        where: {nickname: userInfo.nickname},
    });
    if(user) {
        let yam = Number(user.yam) + Number(upYam);
        let userYam = await User.update({yam: yam}, {where: {nickname: userInfo.nickname}});
        if(userYam)
            return userYam;
        else res.status(500).send('YAM 업데이트 실패');
    } else {
        res.status(401).send('인증되지 않은 사용자');
    }
};