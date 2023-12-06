import { Router } from "express";
import Controllers from "../controllers/Controllers";
import { AuthenticateUser } from "../middlewares/AuthMiddleware";

const Privacy = (user: Router) => {
  const privacy = Router();

  user.use("/privacy", privacy);

  privacy.put("/", AuthenticateUser, Controllers.UpdatePrivacyHandler);
  privacy.put(
    "/pending/:id",
    AuthenticateUser,
    Controllers.UpdatePendingUserController
  );
  privacy.put(
    "/unpending/:id",
    AuthenticateUser,
    Controllers.UpdateUnpendingUserController
  );
  privacy.put(
    "/allowing/:id",
    AuthenticateUser,
    Controllers.UpdateAllowingUserController
  );
  privacy.put(
    "/denying/:id",
    AuthenticateUser,
    Controllers.UpdateDenyingUserController
  );
  privacy.put(
    "/blocking/:id",
    AuthenticateUser,
    Controllers.UpdateBlockingUserController
  );
  privacy.put(
    "/unblocking/:id",
    AuthenticateUser,
    Controllers.UpdateUnblockingUserController
  );
  privacy.put(
    "/following/:id",
    AuthenticateUser,
    Controllers.UpdateFollowingUserController
  );
  privacy.put(
    "/unfollowing/:id",
    AuthenticateUser,
    Controllers.UpdateUnfollowingUserController
  );
  privacy.put(
    "/follower/remove/:id",
    Controllers.UpdateRemoveFollowerController
  );
};

export default Privacy;
