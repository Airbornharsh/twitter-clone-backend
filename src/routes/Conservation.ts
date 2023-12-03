import { Router } from "express";
import Controllers from "../controllers/Controllers";
import GroupConversation from "./GroupConversation";

const Conservation = (user: Router) => {
  const conservation = Router();

  user.use("/conversation", conservation);

  conservation.post("/", Controllers.CreateConversationController);
  conservation.get("/", Controllers.GetConservationsController);
  conservation.get("/:id", Controllers.GetConservationController);
  conservation.get("/user/:id", Controllers.GetUserConservationController);
  conservation.put("/send/:id", Controllers.SendMessageController);
  conservation.put("/read/:id/:messageId", Controllers.ReadMessageController);
  // conservation.delete("/:id", Controllers.DeleteConservationController);

  GroupConversation(conservation);
};

export default Conservation;
