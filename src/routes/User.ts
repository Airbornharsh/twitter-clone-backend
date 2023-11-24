import { Router } from "express";
import Controllers from "../controllers/Controllers";

const User = (user: Router) => {
  user.post("/", Controllers.AddUserController);
  user.get("/", Controllers.GetUserController);
  user.get("/other/:id", Controllers.GetOtherUserController);
  user.put("/", Controllers.UpdateUserHandler);
  user.put("/privacy/", Controllers.UpdatePrivacyHandler);
  user.put("/privacy/pending/:id", Controllers.UpdatePendingUserController);
  user.put("/privacy/allowing/:id", Controllers.UpdateAllowingUserController);
  user.put("/privacy/blocking/:id", Controllers.UpdateBlockingUserController);
  user.put(
    "/privacy/unblocking/:id",
    Controllers.UpdateUnblockingUserController
  );
  user.put("/privacy/following/:id", Controllers.UpdateFollowingUserController);
  user.put(
    "/privacy/unfollowing/:id",
    Controllers.UpdateUnfollowingUserController
  );
  user.put(
    "/privacy/follower/remove/:id",
    Controllers.UpdateRemoveFollowerController
  );
  // user.get("/list/", GetUsersController);
  // user.get("/pending/", GetPendingUsersController);
  // user.get("/allowed/", GetAllowedUsersController);
  // user.get("/blocked/", GetBlockedUsersController);
};

export default User;
