const fs = require("fs");
const path = require("path");
const userUtils = require("../utils/user.utils");

const baseController = require("./base.controler");
const userRepository = require("../repository/user.repository");

const constantsUtils = require("../utils/constants.utils");

const DATABASE_TASK_EXECUTION = 1;

exports.loadUserProfile = async (req, res) => {
    const userId = req.params.userId;
    try {
        const loadedUserProfile = await userRepository.loadUserProfile(baseController.buildAndConditionByUserId(userId));

        if (loadedUserProfile) {
            res.send({
                userId: loadedUserProfile.userId,
                title: loadedUserProfile.title,
                description: loadedUserProfile.description
            });
        } else {
            res.status(constantsUtils.STATUS_CODE_BAD_REQUEST)
                .send({ error: constantsUtils.ERROR_MESSAGE_USER_PROFILE_DOES_NOT_EXIST });
        }
    } catch (err) {
        res.status(constantsUtils.STATUS_CODE_INTERNAL_SERVER_ERROR)
            .send({ error: constantsUtils.ERROR_MESSAGE_LOADING_USER_PROFILE });
    }
};

exports.createProfile = async (req, res) => {
    const userProfile = req.body;
    try {

        const validation = getUserProfileValididation(userProfile);
        if (!validation.valid) {
            return res.status(validation.errorCode)
                .send({ error: validation.message });
        }

        const loadedUserProfile = await userRepository.loadUserProfile(baseController.buildAndConditionByUserId(userProfile.userId));

        if (loadedUserProfile) {
            return res.status(constantsUtils.STATUS_CODE_BAD_REQUEST)
                .send({ error: constantsUtils.ERROR_MESSAGE_USER_PROFILE_ALREADY_EXIST });
        }

        const newUserProfile = await userRepository.createProfile(userProfile);
        res.send({
            userId: newUserProfile.userId,
            title: newUserProfile.title,
            description: newUserProfile.description
        });
    } catch (err) {
        res.status(constantsUtils.STATUS_CODE_INTERNAL_SERVER_ERROR)
            .send({ error: constantsUtils.ERROR_MESSAGE_CREATING_USER_PROFILE });
    }
};

exports.updateProfile = async (req, res) => {
    const userId = req.params.userId;
    const userProfile = req.body;
    try {
        const validation = getUserProfileValididation(userProfile);
        if (!validation.valid) {
            return res.status(validation.errorCode)
                .send({ error: validation.message });
        }

        if (parseInt(userId) !== userProfile.userId) {
            return res.status(constantsUtils.STATUS_CODE_ACCESS_UNAUTHORAZED)
                .send({ error: constantsUtils.ERROR_MESSAGE_USER_NOT_ENOUGH_RIGHTS });
        }

        const loadedUserProfile = await userRepository.loadUserProfile(baseController.buildAndConditionByUserId(userId));

        if (!loadedUserProfile) {
            return res.status(constantsUtils.STATUS_CODE_BAD_REQUEST)
                .send({ error: constantsUtils.ERROR_MESSAGE_USER_PROFILE_DOES_NOT_EXIST });
        }

        const result = await userRepository.updateProfile(userProfile, baseController.buildAndConditionByUserId(userId));
        if (result == DATABASE_TASK_EXECUTION) {
            res.send();
        } else {
            res.status(constantsUtils.STATUS_CODE_BAD_REQUEST)
                .send({ error: constantsUtils.ERROR_MESSAGE_UPDATE_USER_PROFILE });
        }
    } catch (err) {
        res.status(constantsUtils.STATUS_CODE_INTERNAL_SERVER_ERROR)
            .send({ error: constantsUtils.ERROR_MESSAGE_UPDATE_USER_PROFILE });
    }
};

exports.loadUserProfileImage = async (req, res) => {
    const userId = req.params.userId;
    try {
        const loadedUserProfileImage = await userRepository.loadUserProfileImage(baseController.buildAndConditionByUserId(userId));

        if (loadedUserProfileImage) {
            res.send({ image: loadedUserProfileImage.data });
        } else {
            res.status(constantsUtils.STATUS_CODE_BAD_REQUEST)
                .send({ error: constantsUtils.ERROR_MESSAGE_USER_PROFILE_IMAGE_DOES_NOT_EXIST });
        }
    } catch (err) {
        res.status(constantsUtils.STATUS_CODE_INTERNAL_SERVER_ERROR)
            .send({ error: constantsUtils.ERROR_MESSAGE_LOADING_USER_PROFILE_IMAGE });
    }
};

exports.createProfileImage = async (req, res) => {
    const userId = req.body.userId;
    const image = req.file;

    const fileName = image ? image.filename : "";
    const tmpImagePath = path.resolve(constantsUtils.DEFAULT_PROFILE_IMAGE_PATH + fileName);
    try {
        const validation = getUserProfileImageValididation(userId, image);
        if (!validation.valid) {
            return res.status(validation.errorCode)
                .send({ error: validation.message });
        }

        const loadedUserProfileImage = await userRepository.loadUserProfileImage(baseController.buildAndConditionByUserId(userId));

        if (loadedUserProfileImage) {
            return res.status(constantsUtils.STATUS_CODE_BAD_REQUEST)
                .send({ error: constantsUtils.ERROR_MESSAGE_USER_PROFILE_IMAGE_ALREADY_EXIST });
        }


        const imageData = fs.readFileSync(tmpImagePath);
        await userRepository.createProfileImage({
            userId: userId,
            type: image.mimetype,
            name: image.originalname,
            data: imageData
        });
        res.send();
    } catch (err) {
        res.status(constantsUtils.STATUS_CODE_INTERNAL_SERVER_ERROR)
            .send({ error: constantsUtils.ERROR_MESSAGE_CREATING_USER_PROFILE_IMAGE });
    } finally {
        userUtils.deleteTmpUserProfileImage(tmpImagePath);
    }
};

exports.updateProfileImage = async (req, res) => {
    const userId = req.params.userId;
    const userProfileImage = req.body;
    const image = req.file;

    const fileName = image ? image.filename : "";
    const tmpImagePath = path.resolve(constantsUtils.DEFAULT_PROFILE_IMAGE_PATH + fileName);
    try {
        const validation = getUserProfileImageValididation(userProfileImage.userId, image);
        if (!validation.valid) {
            return res.status(validation.errorCode)
                .send({ error: validation.message });
        }

        if (userId !== userProfileImage.userId) {
            return res.status(constantsUtils.STATUS_CODE_ACCESS_UNAUTHORAZED)
                .send({ error: constantsUtils.ERROR_MESSAGE_USER_NOT_ENOUGH_RIGHTS });
        }

        const loadedUserProfileImage = await userRepository.loadUserProfileImage(baseController.buildAndConditionByUserId(userProfileImage.userId));

        if (!loadedUserProfileImage) {
            return res.status(constantsUtils.STATUS_CODE_BAD_REQUEST)
                .send({ error: constantsUtils.ERROR_MESSAGE_USER_PROFILE_IMAGE_DOES_NOT_EXIST });
        }

        loadedUserProfileImage.name = userProfileImage.name;
        loadedUserProfileImage.type = userProfileImage.type;
        loadedUserProfileImage.data = fs.readFileSync(tmpImagePath);
        const result = await userRepository.updateProfileImage(loadedUserProfileImage, baseController.buildAndConditionByUserId(userProfileImage.userId));

        if (result == DATABASE_TASK_EXECUTION) {
            res.send();
        } else {
            res.status(constantsUtils.STATUS_CODE_BAD_REQUEST)
                .send({ error: constantsUtils.ERROR_MESSAGE_UPDATE_USER_PROFILE_IMAGE });
        }
    } catch (err) {
        res.status(constantsUtils.STATUS_CODE_INTERNAL_SERVER_ERROR)
            .send({ error: constantsUtils.ERROR_MESSAGE_UPDATE_USER_PROFILE_IMAGE });
    } finally {
        userUtils.deleteTmpUserProfileImage(tmpImagePath);
    }
};

function getUserProfileValididation(userProfile) {
    if (!userProfile)
        return {
            errorCode: constantsUtils.STATUS_CODE_BAD_REQUEST,
            message: constantsUtils.ERROR_MESSAGE_INVALID_USER_PROFILE_BODY,
            valid: false
        }

    if (!userProfile.userId)
        return {
            errorCode: constantsUtils.STATUS_CODE_BAD_REQUEST,
            message: constantsUtils.ERROR_MESSAGE_MISSING_USER_ID_PARAMETER,
            valid: false
        }

    if (isNaN(userProfile.userId))
        return {
            errorCode: constantsUtils.STATUS_CODE_BAD_REQUEST,
            message: constantsUtils.ERROR_MESSAGE_INVALID_USER_PROFILE_BODY,
            valid: false
        }

    if (!userProfile.title || userProfile.title.length === 0)
        return {
            errorCode: constantsUtils.STATUS_CODE_BAD_REQUEST,
            message: constantsUtils.ERROR_MESSAGE_MISSING_USER_PROFILE_TITLE_PARAMETER,
            valid: false
        }

    return { valid: true };
}

function getUserProfileImageValididation(userId, image) {
    if (!userId)
        return {
            errorCode: constantsUtils.STATUS_CODE_BAD_REQUEST,
            message: constantsUtils.ERROR_MESSAGE_MISSING_USER_ID_PARAMETER,
            valid: false
        }

    if (!image)
        return {
            errorCode: constantsUtils.STATUS_CODE_BAD_REQUEST,
            message: constantsUtils.ERROR_MESSAGE_MISSING_USER_PROFILE_IMAGE_DATA_PARAMETER,
            valid: false
        }

    return { valid: true };
}