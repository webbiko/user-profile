// users constants
module.exports.ERROR_MESSAGE_INVALID_USER_BODY = "Invalid user body";
module.exports.ERROR_MESSAGE_LOADING_USER = "Error retrieving user with (email|userName)";
module.exports.ERROR_MESSAGE_CREATING_USER = "Some error occurred while creating the a new user.";
module.exports.ERROR_MESSAGE_USER_ALREADY_EXISTS = "User already exists";
module.exports.ERROR_MESSAGE_PASSWORD_CANNOT_BE_EMPTY = "Password can not be empty!";
module.exports.ERROR_MESSAGE_EMAIL_CANNOT_BE_EMPTY = "Email can not be empty!";
module.exports.ERROR_MESSAGE_USER_NAME_CANNOT_BE_EMPTY = "User name can not be empty!";
module.exports.ERROR_MESSAGE_USER_STATUS_CANNOT_BE_EMPTY = "User status can not be empty!";
module.exports.ERROR_MESSAGE_USER_ROLES_CANNOT_BE_EMPTY = "User roles can not be empty!";
module.exports.ERROR_MESSAGE_USER_DOES_NOT_EXISTS_MESSAGE = "User does not exists";

// user profile
module.exports.ERROR_MESSAGE_INVALID_USER_PROFILE_BODY = "Invalid user profile body";
module.exports.ERROR_MESSAGE_MISSING_USER_ID_PARAMETER = "Missing required user id parameter";
module.exports.ERROR_MESSAGE_MISSING_USER_PROFILE_TITLE_PARAMETER = "Missing required user profile title parameter";
module.exports.ERROR_MESSAGE_USER_PROFILE_DOES_NOT_EXIST = "User profile does not exists";
module.exports.ERROR_MESSAGE_USER_PROFILE_ALREADY_EXIST = "User profile already exists";
module.exports.ERROR_MESSAGE_LOADING_USER_PROFILE = "Error retrieving user profile";
module.exports.ERROR_MESSAGE_CREATING_USER_PROFILE = "Error creating user profile";
module.exports.ERROR_MESSAGE_UPDATE_USER_PROFILE = "Error updaing user profile";

// user profile image
module.exports.DEFAULT_PROFILE_IMAGE_PATH = "resources/tmp/uploads/";
module.exports.ERROR_MESSAGE_INVALID_USER_PROFILE_IMAGE_BODY = "Invalid user profile body";
module.exports.ERROR_MESSAGE_MISSING_USER_PROFILE_IMAGE_NAME_PARAMETER = "Missing required user profile image name parameter";
module.exports.ERROR_MESSAGE_MISSING_USER_PROFILE_IMAGE_TYPE_PARAMETER = "Missing required user profile image type parameter";
module.exports.ERROR_MESSAGE_MISSING_USER_PROFILE_IMAGE_DATA_PARAMETER = "Missing required user profile image data parameter";
module.exports.ERROR_MESSAGE_USER_PROFILE_IMAGE_DOES_NOT_EXIST = "User profile image does not exists";
module.exports.ERROR_MESSAGE_USER_PROFILE_IMAGE_ALREADY_EXIST = "User profile image already exists";
module.exports.ERROR_MESSAGE_LOADING_USER_PROFILE_IMAGE = "Error retrieving user profile image";
module.exports.ERROR_MESSAGE_CREATING_USER_PROFILE_IMAGE = "Error creating user profile image";
module.exports.ERROR_MESSAGE_UPDATE_USER_PROFILE_IMAGE = "Error updaing user profile image";

// user status
module.exports.ACTIVE_USER_STATUS = 'active';
module.exports.INNACTIVE_USER_STATUS = 'innactive';
module.exports.BANNED_USER_STATUS = 'banned';
module.exports.DELETED_USER_STATUS = 'deleted';

// tokens constants
module.exports.ERROR_MESSAGE_RESET_PASSWORD_TOKEN_EXPIRED = "Token expired, generate a new one";
module.exports.ERROR_MESSAGE_NO_TOKEN_PROVIDED = "No token provided.";
module.exports.ERROR_MESSAGE_TOKEN_ERROR = "Token error.";
module.exports.ERROR_MESSAGE_TOKEN_MALFORMATTED = "Token malformatted.";
module.exports.ERROR_MESSAGE_INVALID_TOKEN = "Invalid token.";
module.exports.ERROR_MESSAGE_INVALID_TOKEN_RESET_PASSWORD = "Invalid token for reseting password.";

// authentication constants
module.exports.TMP_PASSWD_HASH_SIZE = 6;
module.exports.PASSWD_HASH_SIZE = 10;
module.exports.ERROR_MESSAGE_AUTHENTICATION_FAILED = "Authentication failed";
module.exports.ERROR_MESSAGE_AUTHENTICATION_TOKEN_FAILED = "Authentication token failed";
module.exports.ERROR_MESSAGE_USER_NOT_ENOUGH_RIGHTS = "User does not have enough permissions to access.";

module.exports.ERROR_MESSAGE_USER_EMAIL_NOT_VERIFIED = "User is not verified";
module.exports.ERROR_MESSAGE_GMAIL_GIVEN_NAME_CANNOT_BE_EMPTY = "[GMAIL] User name cannot be empty";
module.exports.ERROR_MESSAGE_GMAIL_USER_ID_CANNOT_BE_EMPTY = "[GMAIL] User id cannot be empty";
module.exports.ERROR_MESSAGE_GMAIL_USER_EMAIL_CANNOT_BE_EMPTY = "[GMAIL] User email cannot be empty";
module.exports.ERROR_MESSAGE_USER_CREATION_FAIL = "[GMAIL] An error has occurred while converting a gmail user into a system user";
module.exports.ERROR_MESSAGE_TOKEN_AUTHORIZATION = "[GMAIL] Token authorization failed.";

module.exports.ERROR_MESSAGE_FACEBOOK_GIVEN_NAME_CANNOT_BE_EMPTY = "[FACEBOOK] User name cannot be empty";
module.exports.ERROR_MESSAGE_FACEBOOK_USER_ID_CANNOT_BE_EMPTY = "[FACEBOOK] User id cannot be empty";
module.exports.ERROR_MESSAGE_FACEBOOK_USER_EMAIL_CANNOT_BE_EMPTY = "[FACEBOOK] User email cannot be empty";
module.exports.ERROR_MESSAGE_FACEBOOK_USER_CREATION_FAIL = "[FACEBOOK] An error has occurred while converting a facebook user into a system user";
module.exports.ERROR_MESSAGE_FACEBOOK_TOKEN_AUTHORIZATION = "[FACEBOOK] Token authorization failed.";

// Common ERROR codes constants
module.exports.STATUS_CODE_OK = 200;
module.exports.STATUS_CODE_BAD_REQUEST = 400;
module.exports.STATUS_CODE_ACCESS_UNAUTHORAZED = 401;
module.exports.STATUS_CODE_INTERNAL_SERVER_ERROR = 500;