module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Room',{
        title: {
            type: DataTypes.STRING(20),
            required: true,
        },
        owner: {
            type: DataTypes.STRING(20),
            required: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: Date.now,
        },
        people: {
            type: DataTypes.INTEGER(),
            defaultValue: 0,
        },
        bet: {
            type: DataTypes.INTEGER(),
            required: true,
        },
        state: {
            type: DataTypes.STRING(10),
            defaultValue: 'wait',
        }
    }, {
        timestamps: false
    })
};