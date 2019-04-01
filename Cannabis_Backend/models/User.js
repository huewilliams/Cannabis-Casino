module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.STRING(20),
            primaryKey: true,
        },
        password: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        nickname: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        realname : {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        yam: {
            type: DataTypes.INTEGER(11),
            defaultValue: 10000,
        },
        profile: {
            type: DataTypes.STRING(100),
            defaultValue: 'no_profile.png',
        },
        lotto: {
            type: DataTypes.INTEGER(),
            defaultValue: 0,
        },
        chip: {
            type: DataTypes.INTEGER(),
            defaultValue: 100,
        }
    }, {
        timestamps: false
    })
};