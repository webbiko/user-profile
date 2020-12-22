'use strict';

const { DataTypes, Model } = require('sequelize');

module.exports = function (sequelize) {
    class UserProfile extends Model {
        static associate(models) {
            // define association here
        }
    }
    UserProfile.init({
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        title: DataTypes.STRING,
        description: DataTypes.STRING
    }, {
        sequelize,
        modelName: "user_profile",
        paranoid: true,
        freezeTableName: true
    });
    return UserProfile;
}