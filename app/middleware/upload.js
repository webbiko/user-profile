const multer = require("multer");
const constantUtils = require("../utils/constants.utils");
const path = require("path");

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(constantUtils.DEFAULT_PROFILE_IMAGE_PATH));
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        req.tmpFileName = fileName;
        cb(null, fileName);
    },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;