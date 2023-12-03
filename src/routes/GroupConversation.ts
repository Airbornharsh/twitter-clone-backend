import { Router } from "express";
import Controllers from "../controllers/Controllers";

const GroupConversation = (conversation: Router) => {
  const group = Router();

  conversation.use("/group", group);

  //admin
  group.post("/", Controllers.CreateGroupConversationController);
  group.put("/add/:id", Controllers.AddGroupConversationMemberController);
  group.put("/remove/:id", Controllers.RemoveGroupConversationMemberController);
};

export default GroupConversation;