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
        }
    }, {
        timestamps: false
    })
};