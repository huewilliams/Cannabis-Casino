const Sequelize = require('sequelize');

const db = {};

const sequelize = new Sequelize(
    process.env.DB_NAME, //db 이름
    process.env.DB_USER, // db 사용자명
    process.env.DB_PASSWORD, // 비밀번호
    {
        'host': process.env.DB_HOST, // 사용할 호스트
        'dialect': process.env.DB_TYPE, // 사용할 DB 종류
        'operatorsAliases':false //deprecated 된 연산자 사용
    }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./User')(sequelize,Sequelize);
db.Room = require('./Room')(sequelize, Sequelize);

module.exports = db;