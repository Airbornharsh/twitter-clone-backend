import { Router } from "express";
import Controllers from "../controllers/Controllers";

const User = (user: Router) => {
  user.post("/", Controllers.AddUserController);
  user.get("/", Controllers.GetUserController);
  user.get("/other/:id", Controllers.GetOtherUserController);
  user.put("/", Controllers.UpdateUserHandler);
  user.put("/privacy/", Controllers.UpdatePrivacyHandler);
  user.put("/privacy/allowed/:id", Controllers.UpdateAllowedUserController);
  user.put("/privacy/pending/:id", Controllers.UpdatePendingUserController);
  user.put("/privacy/blocked/:id", Controllers.UpdateBlockedUserController);
  user.put("/privacy/unblocked/:id", Controllers.UpdateUnblockedUserController);
  user.put("/privacy/unallowed/:id", Controllers.UpdateFollowedUserController);
  // user.get("/list/", GetUsersController);
  // user.get("/pending/", GetPendingUsersController);
  // user.get("/allowed/", GetAllowedUsersController);
  // user.get("/blocked/", GetBlockedUsersController);
};

export default User;
