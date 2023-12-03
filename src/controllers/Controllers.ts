import * as userController from "./UserController";
import * as userPrivacyController from "./UserPrivacyController";
import * as userListController from "./UserListController";
import * as tweetController from "./TweetController";
import * as otherTweetController from "./OtherTweetController";
import * as notificationController from "./NotificationController";
import * as ConversationController from "./ConversationController";
import * as GroupController from "./GroupConversationController";

export default {
  ...userController,
  ...userPrivacyController,
  ...userListController,
  ...tweetController,
  ...otherTweetController,
  ...notificationController,
  ...ConversationController,
  ...GroupController,
};
