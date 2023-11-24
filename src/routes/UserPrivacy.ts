import { Router } from "express";
import Controllers from "../controllers/Controllers";

const Privacy = (user: Router) => {
  const privacy = Router();

  user.use("/privacy", privacy);

  privacy.put("/", Controllers.UpdatePrivacyHandler);
  privacy.put("/pending/:id", Controllers.UpdatePendingUserController);
  privacy.put("/allowing/:id", Controllers.UpdateAllowingUserController);
  privacy.put("/blocking/:id", Controllers.UpdateBlockingUserController);
  privacy.put("/unblocking/:id", Controllers.UpdateUnblockingUserController);
  privacy.put("/following/:id", Controllers.UpdateFollowingUserController);
  privacy.put("/unfollowing/:id", Controllers.UpdateUnfollowingUserController);
  privacy.put(
    "/follower/remove/:id",
    Controllers.UpdateRemoveFollowerController
  );
};

export default Privacy;
