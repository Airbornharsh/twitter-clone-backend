import { Router } from "express";
import Controllers from "../controllers/Controllers";

const GroupConversation = (conversation: Router) => {
  const group = Router();

  conversation.use("/group", group);

  group.post("/", Controllers.CreateGroupConversationController);
};

export default GroupConversation;
