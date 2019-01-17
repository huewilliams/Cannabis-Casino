const Sequelize = require('sequelize');

const db = {};

const sequelize = new Sequelize(
    'cannabis', //db 이름
    'root', // 이름명
    '1234', // 비밀번호
    {
        'host': '13.59.174.126', // 사용할 호스트
        'dialect': 'mysql', // 사용할 DB 종류
        'operatorsAliases':false //deprecated 된 연산자 사용
    }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./User')(sequelize,Sequelize);

module.exports = db;