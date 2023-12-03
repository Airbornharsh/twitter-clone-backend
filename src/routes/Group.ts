import { Router } from "express";
import Controllers from "../controllers/Controllers";

const Group = (conversation: Router) => {
  const group = Router();

  conversation.use("/group", group);

  // group.post("/", Controllers.CreateGroupController);
};

export default Group;
