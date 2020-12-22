module.exports = (app, axios) => {
    const userController = require("../controllers/user.controller");

    const upload = require("../middleware/upload");
    const router = require("express").Router();

    router.get("/profile/:userId", userController.loadUserProfile);

    router.post("/profile/", userController.createProfile);

    router.put("/profile/:userId", userController.updateProfile);

    router.get("/profile/image/:userId", userController.loadUserProfileImage);

    router.post("/profile/image/", upload.single("profilePicture"), userController.createProfileImage);

    router.put("/profile/image/:userId", upload.single("profilePicture"), userController.updateProfileImage);

    app.use("/api/users", router);
};