import { Router } from "express";
import Controllers from "../controllers/Controllers";
import { AuthenticateUser } from "../middlewares/AuthMiddleware";

const GroupConversation = (conversation: Router) => {
  const group = Router();

  conversation.use("/group", group);

  //admin
  group.post(
    "/",
    AuthenticateUser,
    Controllers.AdminCreateGroupConversationController
  );
  group.get("/", AuthenticateUser, Controllers.GetGroupConversationsController);
  group.get(
    "/search/:name",
    AuthenticateUser,
    Controllers.SearchGroupConversationController
  );
  group.get(
    "/:id",
    AuthenticateUser,
    Controllers.GetGroupConversationController
  );
  group.put(
    "/update/:id",
    AuthenticateUser,
    Controllers.AdminUpdateGroupConversationController
  );
  group.put(
    "/add/:id",
    AuthenticateUser,
    Controllers.AdminAddGroupConversationMemberController
  );
  group.put(
    "/remove/:id",
    AuthenticateUser,
    Controllers.AdminRemoveGroupConversationMemberController
  );
  group.put(
    "/makeadmin/:id",
    AuthenticateUser,
    Controllers.AdminAddGroupConversationAdminController
  );
  group.put(
    "/removeadmin/:id",
    AuthenticateUser,
    Controllers.AdminRemoveGroupConversationAdminController
  );
  group.patch(
    "/allow/:id",
    AuthenticateUser,
    Controllers.AdminAllowGroupConversationController
  );
  group.patch(
    "/deny/:id",
    AuthenticateUser,
    Controllers.AdminDenyGroupConversationController
  );
  group.delete(
    "/:id",
    AuthenticateUser,
    Controllers.AdminDeleteGroupConversationController
  );
  group.put(
    "/leave/:id",
    AuthenticateUser,
    Controllers.LeaveGroupConversationController
  );
  group.put(
    "/join/:id",
    AuthenticateUser,
    Controllers.JoinGroupConversationController
  );
  group.post(
    "/message/:id",
    AuthenticateUser,
    Controllers.SendMessageToGroupConversationController
  );
  // group.patch("/read/:id", Controllers.ReadGroupMessageController);
};

export default GroupConversation;
