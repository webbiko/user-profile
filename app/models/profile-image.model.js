'use strict';

const { DataTypes, Model } = require('sequelize');

module.exports = function (sequelize) {
    class UserProfileImage extends Model {
        static associate(models) {
            // define association here
        }
    }
    UserProfileImage.init({
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        type: DataTypes.STRING,
        name: DataTypes.STRING,
        data: DataTypes.BLOB("long")
    }, {
        sequelize,
        modelName: "user_profile_image",
        paranoid: true,
        freezeTableName: true
    });
    return UserProfileImage;
}