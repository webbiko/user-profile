const fs = require('fs');
const path = require("path");

const db = require("../models");
const UserProfile = db.userProfile;
const UserProfileImage = db.userProfileImage;

const baseController = require("../controllers/base.controler");

// methods used only for testing beginning

module.exports.DEFAULT_USER_PROFILE_TEST = {
    userId: 1,
    title: "Meu titulo",
    description: "Eu amo assistir filmes"
};

module.exports.DEFAULT_USER_PROFILE_IMAGE_TEST = {
    userId: 1
};

module.exports.updateUserProfile = async (userProfile) => {
    return UserProfile.update(userProfile,
        { where: baseController.buildAndConditionByUserId(userProfile.userId) }
    )
};

module.exports.createUserProfileForTest = async (userProfile) => {
    return UserProfile.create(userProfile);
}

module.exports.cleanUserProfileTable = async () => {
    await UserProfile.destroy({
        where: {},
        force: true
    });
}

module.exports.updateUserProfileImage = async (userProfileImage) => {
    return UserProfileImage.update(userProfileImage,
        { where: baseController.buildAndConditionByUserId(userProfileImage.userId) }
    )
};

module.exports.createUserProfileImageForTest = async (userProfileImage) => {
    return UserProfileImage.create(userProfileImage);
}

module.exports.cleanUserProfileImageTable = async () => {
    await UserProfileImage.destroy({
        where: {},
        force: true
    });
}

module.exports.deleteAllTestImageFiles = async (filesDirectory) => {
    fs.readdir(filesDirectory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlinkSync(path.join(filesDirectory, file), err => {
                if (err) throw err;
            });
        }
    });
}

// methods used only for testing end

module.exports.deleteTmpUserProfileImage = (path) => {
    try {
        fs.unlinkSync(path);
    } catch (err) {
        console.log(err)
    }
}