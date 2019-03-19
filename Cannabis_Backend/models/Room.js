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
            default: Date.now,
        }
    }, {
        timestamps: false
    })
};