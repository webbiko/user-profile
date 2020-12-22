/* eslint-disable no-undef */
const constantsUtils = require("../../../utils/constants.utils");

const request = require('supertest');
const app = require("../../../server/server");

const userUtils = require("../../../utils/user.utils");

// var currentUserProfile = null;

beforeEach(async function (done) {
    await userUtils.cleanUserProfileTable();
    done();
});

describe("POST /api/users/profile", () => {
    test("Test that user profile creation works properly", async () => {
        const response = await request(app)
            .post("/api/users/profile")
            .send(userUtils.DEFAULT_USER_PROFILE_TEST);

        const userProfile = response.body;
        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.title);
        expect(userProfile.description).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.description);
    });

    test("Test that user profile creation works properly when profile description is not sent", async () => {
        const response = await request(app)
            .post("/api/users/profile")
            .send({
                userId: userUtils.DEFAULT_USER_PROFILE_TEST.userId,
                title: userUtils.DEFAULT_USER_PROFILE_TEST.title
            });

        const userProfile = response.body;
        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.title);
        expect(userProfile.description).toBe(undefined);
    });

    test("Test that user profile creation fails when user profile already exists", async () => {
        var response = await request(app)
            .post("/api/users/profile")
            .send(userUtils.DEFAULT_USER_PROFILE_TEST);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        response = await request(app)
            .post("/api/users/profile")
            .send(userUtils.DEFAULT_USER_PROFILE_TEST);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_USER_PROFILE_ALREADY_EXIST);
    });

    test("Test that user profile creation fails when user id is not sent", async () => {
        const response = await request(app)
            .post("/api/users/profile")
            .send({
                title: "title",
                description: "description"
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_ID_PARAMETER)
    });

    test("Test that user profile creation fails when user id is null", async () => {
        const response = await request(app)
            .post("/api/users/profile")
            .send({
                userId: null,
                title: "title",
                description: "description"
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_ID_PARAMETER)
    });

    test("Test that user profile creation fails when user id is undefined", async () => {
        const response = await request(app)
            .post("/api/users/profile")
            .send({
                userId: undefined,
                title: "title",
                description: "description"
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_ID_PARAMETER)
    });

    test("Test that user profile creation fails when user id is a string", async () => {
        const response = await request(app)
            .post("/api/users/profile")
            .send({
                userId: "kkk",
                title: "title",
                description: "description"
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_INVALID_USER_PROFILE_BODY)
    });

    test("Test that user profile creation fails when profile title is not sent", async () => {
        const response = await request(app)
            .post("/api/users/profile")
            .send({
                userId: 1,
                description: "description"
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_PROFILE_TITLE_PARAMETER)
    });

    test("Test that user profile creation fails when profile title is null", async () => {
        const response = await request(app)
            .post("/api/users/profile")
            .send({
                userId: 1,
                title: null,
                description: "description"
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_PROFILE_TITLE_PARAMETER)
    });

    test("Test that user profile creation fails when profile title is undefined", async () => {
        const response = await request(app)
            .post("/api/users/profile")
            .send({
                userId: 1,
                title: undefined,
                description: "description"
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_PROFILE_TITLE_PARAMETER)
    });

    test("Test that user profile creation fails when profile title is empty", async () => {
        const response = await request(app)
            .post("/api/users/profile")
            .send({
                userId: 1,
                title: "",
                description: "description"
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_PROFILE_TITLE_PARAMETER)
    });
});

describe("PUT /api/users/profile/:userId", () => {
    test("Test that user profile is updated properly", async () => {
        var response = await request(app)
            .post("/api/users/profile")
            .send(userUtils.DEFAULT_USER_PROFILE_TEST);

        var userProfile = response.body;
        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.title);
        expect(userProfile.description).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.description);

        const newTitle = "new title";
        const newDescription = "new description";
        response = await request(app)
            .put(`/api/users/profile/${userUtils.DEFAULT_USER_PROFILE_TEST.userId}`)
            .send({
                userId: userUtils.DEFAULT_USER_PROFILE_TEST.userId,
                title: newTitle,
                description: newDescription
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        response = await request(app)
            .get(`/api/users/profile/${userUtils.DEFAULT_USER_PROFILE_TEST.userId}`);

        userProfile = response.body;

        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(newTitle);
        expect(userProfile.description).toBe(newDescription);
    });

    test("Test that user profile is updated properly when only title is changed", async () => {
        var response = await request(app)
            .post("/api/users/profile")
            .send(userUtils.DEFAULT_USER_PROFILE_TEST);

        var userProfile = response.body;
        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.title);
        expect(userProfile.description).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.description);

        const newTitle = "new title";
        response = await request(app)
            .put(`/api/users/profile/${userUtils.DEFAULT_USER_PROFILE_TEST.userId}`)
            .send({
                userId: userUtils.DEFAULT_USER_PROFILE_TEST.userId,
                title: newTitle,
                description: userUtils.DEFAULT_USER_PROFILE_TEST.description
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        response = await request(app)
            .get(`/api/users/profile/${userUtils.DEFAULT_USER_PROFILE_TEST.userId}`);

        userProfile = response.body;

        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(newTitle);
        expect(userProfile.description).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.description);
    });

    test("Test that user profile is updated properly when only description is changed", async () => {
        var response = await request(app)
            .post("/api/users/profile")
            .send(userUtils.DEFAULT_USER_PROFILE_TEST);

        var userProfile = response.body;
        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.title);
        expect(userProfile.description).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.description);

        const newDescription = "new description";
        response = await request(app)
            .put(`/api/users/profile/${userUtils.DEFAULT_USER_PROFILE_TEST.userId}`)
            .send({
                userId: userUtils.DEFAULT_USER_PROFILE_TEST.userId,
                title: userUtils.DEFAULT_USER_PROFILE_TEST.title,
                description: newDescription
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        response = await request(app)
            .get(`/api/users/profile/${userUtils.DEFAULT_USER_PROFILE_TEST.userId}`);

        userProfile = response.body;

        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.title);
        expect(userProfile.description).toBe(newDescription);
    });

    test("Test that user profile is updated fails when user id are different", async () => {
        var response = await request(app)
            .post("/api/users/profile")
            .send(userUtils.DEFAULT_USER_PROFILE_TEST);

        var userProfile = response.body;
        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.title);
        expect(userProfile.description).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.description);

        const newDescription = "new description";
        response = await request(app)
            .put(`/api/users/profile/${userUtils.DEFAULT_USER_PROFILE_TEST.userId}`)
            .send({
                userId: 99999,
                title: userUtils.DEFAULT_USER_PROFILE_TEST.title,
                description: newDescription
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_ACCESS_UNAUTHORAZED);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_USER_NOT_ENOUGH_RIGHTS);
    });

    test("Test that user profile is updated fails when user id does not exists", async () => {
        const invalidUserId = 99999;
        const newDescription = "new description";
        response = await request(app)
            .put(`/api/users/profile/${invalidUserId}`)
            .send({
                userId: invalidUserId,
                title: userUtils.DEFAULT_USER_PROFILE_TEST.title,
                description: newDescription
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_USER_PROFILE_DOES_NOT_EXIST);
    });

    test("Test that user profile is updated fails when user id is not sent", async () => {
        var response = await request(app)
            .post("/api/users/profile")
            .send(userUtils.DEFAULT_USER_PROFILE_TEST);

        var userProfile = response.body;
        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.title);
        expect(userProfile.description).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.description);

        const newDescription = "new description";
        response = await request(app)
            .put(`/api/users/profile/${userUtils.DEFAULT_USER_PROFILE_TEST.userId}`)
            .send({
                title: userUtils.DEFAULT_USER_PROFILE_TEST.title,
                description: newDescription
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_ID_PARAMETER);
    });

    test("Test that user profile is updated fails when user id is null", async () => {
        var response = await request(app)
            .post("/api/users/profile")
            .send(userUtils.DEFAULT_USER_PROFILE_TEST);

        var userProfile = response.body;
        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.title);
        expect(userProfile.description).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.description);

        const newDescription = "new description";
        response = await request(app)
            .put(`/api/users/profile/${userUtils.DEFAULT_USER_PROFILE_TEST.userId}`)
            .send({
                userId: null,
                title: userUtils.DEFAULT_USER_PROFILE_TEST.title,
                description: newDescription
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_ID_PARAMETER);
    });

    test("Test that user profile is updated fails when user id is undefined", async () => {
        var response = await request(app)
            .post("/api/users/profile")
            .send(userUtils.DEFAULT_USER_PROFILE_TEST);

        var userProfile = response.body;
        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.title);
        expect(userProfile.description).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.description);

        const newDescription = "new description";
        response = await request(app)
            .put(`/api/users/profile/${userUtils.DEFAULT_USER_PROFILE_TEST.userId}`)
            .send({
                userId: undefined,
                title: userUtils.DEFAULT_USER_PROFILE_TEST.title,
                description: newDescription
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_ID_PARAMETER);
    });

    test("Test that user profile is updated fails when user id is not a number", async () => {
        var response = await request(app)
            .post("/api/users/profile")
            .send(userUtils.DEFAULT_USER_PROFILE_TEST);

        var userProfile = response.body;
        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.title);
        expect(userProfile.description).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.description);

        const newDescription = "new description";
        response = await request(app)
            .put(`/api/users/profile/${userUtils.DEFAULT_USER_PROFILE_TEST.userId}`)
            .send({
                userId: "kkk",
                title: userUtils.DEFAULT_USER_PROFILE_TEST.title,
                description: newDescription
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_INVALID_USER_PROFILE_BODY);
    });

    test("Test that user profile is updated fails when user profile title is not sent", async () => {
        var response = await request(app)
            .post("/api/users/profile")
            .send(userUtils.DEFAULT_USER_PROFILE_TEST);

        var userProfile = response.body;
        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.title);
        expect(userProfile.description).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.description);

        const newDescription = "new description";
        response = await request(app)
            .put(`/api/users/profile/${userUtils.DEFAULT_USER_PROFILE_TEST.userId}`)
            .send({
                userId: userUtils.DEFAULT_USER_PROFILE_TEST.userId,
                description: newDescription
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_PROFILE_TITLE_PARAMETER);
    });

    test("Test that user profile is updated fails when user profile title is null", async () => {
        var response = await request(app)
            .post("/api/users/profile")
            .send(userUtils.DEFAULT_USER_PROFILE_TEST);

        var userProfile = response.body;
        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.title);
        expect(userProfile.description).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.description);

        const newDescription = "new description";
        response = await request(app)
            .put(`/api/users/profile/${userUtils.DEFAULT_USER_PROFILE_TEST.userId}`)
            .send({
                userId: userUtils.DEFAULT_USER_PROFILE_TEST.userId,
                title: null,
                description: newDescription
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_PROFILE_TITLE_PARAMETER);
    });

    test("Test that user profile is updated fails when user profile title is undefined", async () => {
        var response = await request(app)
            .post("/api/users/profile")
            .send(userUtils.DEFAULT_USER_PROFILE_TEST);

        var userProfile = response.body;
        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.title);
        expect(userProfile.description).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.description);

        const newDescription = "new description";
        response = await request(app)
            .put(`/api/users/profile/${userUtils.DEFAULT_USER_PROFILE_TEST.userId}`)
            .send({
                userId: userUtils.DEFAULT_USER_PROFILE_TEST.userId,
                title: undefined,
                description: newDescription
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_PROFILE_TITLE_PARAMETER);
    });

    test("Test that user profile is updated fails when user profile title is empty", async () => {
        var response = await request(app)
            .post("/api/users/profile")
            .send(userUtils.DEFAULT_USER_PROFILE_TEST);

        var userProfile = response.body;
        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.title);
        expect(userProfile.description).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.description);

        const newDescription = "new description";
        response = await request(app)
            .put(`/api/users/profile/${userUtils.DEFAULT_USER_PROFILE_TEST.userId}`)
            .send({
                userId: userUtils.DEFAULT_USER_PROFILE_TEST.userId,
                title: "",
                description: newDescription
            });

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_MISSING_USER_PROFILE_TITLE_PARAMETER);
    });
});

describe("GET /api/users/profile:userId", () => {
    test("Test that user profile is loaded properly", async () => {
        var response = await request(app)
            .post("/api/users/profile")
            .send(userUtils.DEFAULT_USER_PROFILE_TEST);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);

        response = await request(app)
            .get(`/api/users/profile/${userUtils.DEFAULT_USER_PROFILE_TEST.userId}`);

        var userProfile = response.body;
        expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
        expect(userProfile).not.toBeNull();
        expect(userProfile.userId).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.userId);
        expect(userProfile.title).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.title);
        expect(userProfile.description).toBe(userUtils.DEFAULT_USER_PROFILE_TEST.description);
    });

    test("Test that user profile fails to load when user id does not exists", async () => {
        var response = await request(app)
            .get(`/api/users/profile/${userUtils.DEFAULT_USER_PROFILE_TEST.userId}`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_USER_PROFILE_DOES_NOT_EXIST);
    });

    test("Test that user profile fails to load when user id is a string", async () => {
        var response = await request(app)
            .get(`/api/users/profile/invalidUserId`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_USER_PROFILE_DOES_NOT_EXIST);
    });

    test("Test that user profile fails to load when user id is null", async () => {
        var response = await request(app)
            .get(`/api/users/profile/${null}`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_USER_PROFILE_DOES_NOT_EXIST);
    });

    test("Test that user profile fails to load when user id is undefined", async () => {
        var response = await request(app)
            .get(`/api/users/profile/${undefined}`);

        expect(response.status).toBe(constantsUtils.STATUS_CODE_BAD_REQUEST);
        expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_USER_PROFILE_DOES_NOT_EXIST);
    });
});