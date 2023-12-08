import { Router } from "express";
import Controllers from "../controllers/Controllers";
import GroupConversation from "./GroupConversation";
import { AuthenticateUser } from "../middlewares/AuthMiddleware";

const Conservation = (user: Router) => {
  const conservation = Router();

  user.use("/conversation", conservation);

  GroupConversation(conservation);

  conservation.post(
    "/",
    AuthenticateUser,
    Controllers.CreateConversationController
  );
  conservation.get(
    "/",
    AuthenticateUser,
    Controllers.GetConservationsController
  );
  conservation.get(
    "/:id",
    AuthenticateUser,
    Controllers.GetConservationController
  );
  conservation.get(
    "/user/:id",
    AuthenticateUser,
    Controllers.GetUserConservationController
  );
  conservation.put(
    "/send/:id",
    AuthenticateUser,
    Controllers.SendMessageController
  );
  conservation.put(
    "/read/:id/:messageId",
    AuthenticateUser,
    Controllers.ReadMessageController
  );
  conservation.get(
    "/video/:id",
    AuthenticateUser,
    Controllers.GetConversationVideoTokenController
  );
  // conservation.delete("/:id", Controllers.DeleteConservationController);
};

export default Conservation;
