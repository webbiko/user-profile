'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('user_profile_image', {
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                primaryKey: true
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false,
                notEmpty: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                notEmpty: true
            },
            data: {
                type: Sequelize.BLOB("long"),
                allowNull: false,
                notEmpty: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: true,
                type: Sequelize.DATE
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        }, {
            paranoid: true,
            createdAt: "createTimestamp",
            updatedAt: 'updateTimestamp',
            deletedAt: 'destroyTime',
            freezeTableName: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('user_profile_image');
    }
};