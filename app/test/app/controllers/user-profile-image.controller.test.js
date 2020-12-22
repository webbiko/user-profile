/* eslint-disable no-undef */
const fs = require('fs')
const path = require("path");
const constantsUtils = require("../../../utils/constants.utils");

const request = require('supertest');
const app = require("../../../server/server");

const userUtils = require("../../../utils/user.utils");
const defaultTmpImageDirector = path.resolve(`resources/tmp/uploads/`);

beforeEach(async function (done) {
    await userUtils.cleanUserProfileImageTable();
    await userUtils.deleteAllTestImageFiles(defaultTmpImageDirector);
    done();
});

describe("POST /api/users/profile/image", () => {
    test("Test that user profile image creation works properly", async () => {
        const response = await request(app).post('/api/users/profile/image')
            .attach("profilePicture", path.resolve(`app/test/resources/goku.jpg`))
            .field('userId', userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
    });

    test("Test that user tmp profile image creation is deleted successfully", async () => {
        const response = await request(app).post('/api/users/profile/image')
            .attach("profilePicture", path.resolve(`app/test/resources/goku.jpg`))
            .field('userId', userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
        expect(fs.readdirSync(path.resolve(`resources/tmp/uploads/`)).length === 0).toBeTruthy();
    });

    test("Test that user profile image creation fails when user id is not sent", async () => {
        const response = await request(app).post('/api/users/profile/image')
            .attach("profilePicture", path.resolve(`app/test/resources/goku.jpg`));

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_ID_PARAMETER);
    });

    test("Test that user profile image creation fails when user image data is not sent", async () => {
        const response = await request(app).post('/api/users/profile/image')
            .send(userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_PROFILE_IMAGE_DATA_PARAMETER);
    });

    test("Test that user profile image creation fails when profile image already exists", async () => {
        var response = await request(app).post('/api/users/profile/image')
            .attach("profilePicture", path.resolve(`app/test/resources/goku.jpg`))
            .field('userId', userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        response = await request(app).post('/api/users/profile/image')
            .attach("profilePicture", path.resolve(`app/test/resources/goku.jpg`))
            .field('userId', userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_USER_PROFILE_IMAGE_ALREADY_EXIST);
    });

    test("Test that user profile image are equal after creation", async () => {
        var response = await request(app).post('/api/users/profile/image')
            .attach("profilePicture", path.resolve(`app/test/resources/goku.jpg`))
            .field('userId', userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        response = await request(app)
            .get(`/api/users/profile/image/${userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId}`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        const profileImage = response.body.image;
        const buffer = new Buffer(profileImage.data, 'base64');

        const defaultImageTest = fs.readFileSync(path.resolve("app/test/resources/goku.jpg"));
        const defaultImageBuffer = new Buffer(defaultImageTest, 'base64');

        const equalBufferImage = 0;
        const comparisonResult = Buffer.compare(buffer, defaultImageBuffer);
        expect(comparisonResult).toBe(equalBufferImage)
    });

    test("Test that user profile image are different from goku", async () => {
        var response = await request(app).post('/api/users/profile/image')
            .attach("profilePicture", path.resolve(`app/test/resources/moon.jpeg`))
            .field('userId', userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        response = await request(app)
            .get(`/api/users/profile/image/${userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId}`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        const profileImage = response.body.image;
        const buffer = new Buffer(profileImage.data, 'base64');

        const defaultImageTest = fs.readFileSync(path.resolve("app/test/resources/goku.jpg"));
        const defaultImageBuffer = new Buffer(defaultImageTest, 'base64');

        const equalBufferImage = 0;
        const comparisonResult = Buffer.compare(buffer, defaultImageBuffer);
        expect(comparisonResult).not.toBe(equalBufferImage)
    });
});

describe("PUT /api/users/profile/:userId", () => {
    test("Test that user profile image updates properly", async () => {
        var response = await request(app).post('/api/users/profile/image')
            .attach("profilePicture", path.resolve(`app/test/resources/goku.jpg`))
            .field('userId', userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        response = await request(app).put(`/api/users/profile/image/${userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId}`)
            .attach("profilePicture", path.resolve(`app/test/resources/moon.jpeg`))
            .field('userId', userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
    });

    test("Test that user profile image updates properly and image data matches", async () => {
        var response = await request(app).post('/api/users/profile/image')
            .attach("profilePicture", path.resolve(`app/test/resources/goku.jpg`))
            .field('userId', userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        response = await request(app)
            .get(`/api/users/profile/image/${userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId}`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        var profileImage = response.body.image;
        var buffer = new Buffer(profileImage.data, 'base64');

        var defaultImageTest = fs.readFileSync(path.resolve("app/test/resources/goku.jpg"));
        var defaultImageBuffer = new Buffer(defaultImageTest, 'base64');

        var equalBufferImage = 0;
        var comparisonResult = Buffer.compare(buffer, defaultImageBuffer);
        expect(comparisonResult).toBe(equalBufferImage)

        response = await request(app).put(`/api/users/profile/image/${userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId}`)
            .attach("profilePicture", path.resolve(`app/test/resources/moon.jpeg`))
            .field('userId', userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        response = await request(app)
            .get(`/api/users/profile/image/${userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId}`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        profileImage = response.body.image;
        buffer = new Buffer(profileImage.data, 'base64');
        defaultImageTest = fs.readFileSync(path.resolve("app/test/resources/moon.jpeg"));
        defaultImageBuffer = new Buffer(defaultImageTest, 'base64');
        equalBufferImage = 0;
        comparisonResult = Buffer.compare(buffer, defaultImageBuffer);
        expect(comparisonResult).toBe(equalBufferImage);
    });

    test("Test that user profile image updates fails when no user id is sent", async () => {
        var response = await request(app).post('/api/users/profile/image')
            .attach("profilePicture", path.resolve(`app/test/resources/goku.jpg`))
            .field('userId', userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        response = await request(app)
            .get(`/api/users/profile/image/${userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId}`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        var profileImage = response.body.image;
        var buffer = new Buffer(profileImage.data, 'base64');

        var defaultImageTest = fs.readFileSync(path.resolve("app/test/resources/goku.jpg"));
        var defaultImageBuffer = new Buffer(defaultImageTest, 'base64');

        var equalBufferImage = 0;
        var comparisonResult = Buffer.compare(buffer, defaultImageBuffer);
        expect(comparisonResult).toBe(equalBufferImage)

        response = await request(app).put(`/api/users/profile/image/${userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId}`)
            .attach("profilePicture", path.resolve(`app/test/resources/moon.jpeg`));

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_ID_PARAMETER);
    });

    test("Test that user profile image updates fails when user id from request param is different from request body", async () => {
        var response = await request(app).post('/api/users/profile/image')
            .attach("profilePicture", path.resolve(`app/test/resources/goku.jpg`))
            .field('userId', userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        response = await request(app)
            .get(`/api/users/profile/image/${userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId}`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        var profileImage = response.body.image;
        var buffer = new Buffer(profileImage.data, 'base64');

        var defaultImageTest = fs.readFileSync(path.resolve("app/test/resources/goku.jpg"));
        var defaultImageBuffer = new Buffer(defaultImageTest, 'base64');

        var equalBufferImage = 0;
        var comparisonResult = Buffer.compare(buffer, defaultImageBuffer);
        expect(comparisonResult).toBe(equalBufferImage)

        response = await request(app).put(`/api/users/profile/image/${userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId}`)
            .attach("profilePicture", path.resolve(`app/test/resources/moon.jpeg`))
            .field('userId', 22);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_ACCESS_UNAUTHORAZED);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_USER_NOT_ENOUGH_RIGHTS);
    });

    test("Test that user profile image updates fails when image is not sent", async () => {
        var response = await request(app).post('/api/users/profile/image')
            .attach("profilePicture", path.resolve(`app/test/resources/goku.jpg`))
            .field('userId', userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        response = await request(app)
            .get(`/api/users/profile/image/${userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId}`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        var profileImage = response.body.image;
        var buffer = new Buffer(profileImage.data, 'base64');

        var defaultImageTest = fs.readFileSync(path.resolve("app/test/resources/goku.jpg"));
        var defaultImageBuffer = new Buffer(defaultImageTest, 'base64');

        var equalBufferImage = 0;
        var comparisonResult = Buffer.compare(buffer, defaultImageBuffer);
        expect(comparisonResult).toBe(equalBufferImage)

        response = await request(app).put(`/api/users/profile/image/${userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId}`)
            .field('userId', userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_PROFILE_IMAGE_DATA_PARAMETER);
    });

    test("Test that user profile image updates fails when profile image is not found", async () => {
        const invalidUserId = 999999;
        var response = await request(app).post('/api/users/profile/image')
            .attach("profilePicture", path.resolve(`app/test/resources/goku.jpg`))
            .field('userId', userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        response = await request(app)
            .get(`/api/users/profile/image/${userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId}`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        var profileImage = response.body.image;
        var buffer = new Buffer(profileImage.data, 'base64');

        var defaultImageTest = fs.readFileSync(path.resolve("app/test/resources/goku.jpg"));
        var defaultImageBuffer = new Buffer(defaultImageTest, 'base64');

        var equalBufferImage = 0;
        var comparisonResult = Buffer.compare(buffer, defaultImageBuffer);
        expect(comparisonResult).toBe(equalBufferImage)

        response = await request(app).put(`/api/users/profile/image/${invalidUserId}`)
            .attach("profilePicture", path.resolve(`app/test/resources/moon.jpeg`))
            .field('userId', invalidUserId);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_USER_PROFILE_IMAGE_DOES_NOT_EXIST);
    });
});

describe("GET /api/users/profile:userId", () => {
    test("Test that user profile image returns properly", async () => {
        var response = await request(app).post('/api/users/profile/image')
            .attach("profilePicture", path.resolve(`app/test/resources/goku.jpg`))
            .field('userId', userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        response = await request(app)
            .get(`/api/users/profile/image/${userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId}`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
    });

    test("Test that user profile image matches the one in database", async () => {
        var profileImage = {
            userId: userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId,
            type: "image/jpg",
            name: "goku.jpg",
            data: fs.readFileSync(path.resolve(`app/test/resources/goku.jpg`))
        };

        await userUtils.createUserProfileImageForTest(profileImage);

        const response = await request(app)
            .get(`/api/users/profile/image/${userUtils.DEFAULT_USER_PROFILE_IMAGE_TEST.userId}`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);


        profileImage = response.body.image;
        const buffer = new Buffer(profileImage.data, 'base64');

        const defaultImageTest = fs.readFileSync(path.resolve("app/test/resources/goku.jpg"));
        const defaultImageBuffer = new Buffer(defaultImageTest, 'base64');

        const equalBufferImage = 0;
        const comparisonResult = Buffer.compare(buffer, defaultImageBuffer);
        expect(comparisonResult).toBe(equalBufferImage)
    });

    test("Test that user profile image fails when user id is invalid", async () => {
        const response = await request(app)
            .get(`/api/users/profile/image/99999999`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_USER_PROFILE_IMAGE_DOES_NOT_EXIST);
    });

    test("Test that user profile image fails when user id is null", async () => {
        const response = await request(app)
            .get(`/api/users/profile/image/${null}`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_USER_PROFILE_IMAGE_DOES_NOT_EXIST);
    });

    test("Test that user profile image fails when user id is undefined", async () => {
        const response = await request(app)
            .get(`/api/users/profile/image/${undefined}`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_USER_PROFILE_IMAGE_DOES_NOT_EXIST);
    });

    test("Test that user profile image fails when user id is a string", async () => {
        const response = await request(app)
            .get(`/api/users/profile/image/invalidUserId`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_USER_PROFILE_IMAGE_DOES_NOT_EXIST);
    });
});