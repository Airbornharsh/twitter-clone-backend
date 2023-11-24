import * as userController from "./UserController";
import * as userPrivacyController from "./UserPrivacyController";
import * as userListController from "./UserListController";

export default {
  ...userController,
  ...userPrivacyController,
  ...userListController,
};
