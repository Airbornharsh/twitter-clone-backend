import { Router } from "express";
import Controllers from "../controllers/Controllers";

const GroupConversation = (conversation: Router) => {
  const group = Router();

  conversation.use("/group", group);

  //admin
  group.post("/", Controllers.CreateGroupConversationController);
  group.put("/add/:id", Controllers.AddGroupConversationMemberController);
  group.put("/remove/:id", Controllers.RemoveGroupConversationMemberController);
  group.put("/admin/:id", Controllers.AddGroupConversationAdminController);

  //user
  group.put("/leave/:id", Controllers.LeaveGroupConversationController);
};

export default GroupConversation;
