import { Router } from "express";
import Controllers from "../controllers/Controllers";

const GroupConversation = (conversation: Router) => {
  const group = Router();

  conversation.use("/group", group);

  //admin
  group.post("/", Controllers.AdminCreateGroupConversationController);
  group.get("/", Controllers.GetGroupConversationsController);
  group.get("/:id", Controllers.GetGroupConversationController);
  group.put("/update/:id", Controllers.AdminUpdateGroupConversationController);
  group.put("/add/:id", Controllers.AdminAddGroupConversationMemberController);
  group.put(
    "/remove/:id",
    Controllers.AdminRemoveGroupConversationMemberController
  );
  group.put("/admin/:id", Controllers.AdminAddGroupConversationAdminController);
  group.delete(
    "/admin/:id",
    Controllers.AdminRemoveGroupConversationAdminController
  );
  group.patch("/allow/:id", Controllers.AdminAllowGroupConversationController);
  group.patch("/deny/:id", Controllers.AdminDenyGroupConversationController);
  group.delete("/:id", Controllers.AdminDeleteGroupConversationController);
  group.put("/leave/:id", Controllers.LeaveGroupConversationController);
  group.put("/join/:id", Controllers.JoinGroupConversationController);
  group.post("/message/:id", Controllers.SendMessageToGroupConversationController);
  // group.patch("/read/:id", Controllers.ReadGroupMessageController);
};

export default GroupConversation;
