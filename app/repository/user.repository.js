const db = require("../models");
const UserProfile = db.userProfile;
const UserProfileImage = db.userProfileImage;

exports.loadUserProfile = async (condition) => {
    return UserProfile.findOne({ where: condition, raw: true });
}

exports.createProfile = async (userProfile) => {
    return UserProfile.create(userProfile);
}

exports.updateProfile = async (userProfile, condition) => {
    return UserProfile.update(userProfile, { where: condition });
}

exports.loadUserProfileImage = async (condition) => {
    return UserProfileImage.findOne({ where: condition, raw: true });
}

exports.createProfileImage = async (userProfileImage) => {
    return UserProfileImage.create(userProfileImage);
}

exports.updateProfileImage = async (userProfileImage, condition) => {
    return UserProfileImage.update(userProfileImage, { where: condition });
}