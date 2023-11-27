import * as userController from "./UserController";
import * as userPrivacyController from "./UserPrivacyController";
import * as userListController from "./UserListController";
import * as tweetController from "./TweetController";

export default {
  ...userController,
  ...userPrivacyController,
  ...userListController,
  ...tweetController,
};
