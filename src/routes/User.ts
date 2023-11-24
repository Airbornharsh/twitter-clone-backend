import { Router } from "express";
import Controllers from "../controllers/Controllers";
import Privacy from "./Privacy";
import UserList from "./UserList";

const User = (router: Router) => {
  const user = Router();

  router.use("/user", user);

  user.post("/", Controllers.AddUserController);
  user.get("/", Controllers.GetUserController);
  user.get("/other/:id", Controllers.GetOtherUserController);
  user.put("/", Controllers.UpdateUserHandler);

  Privacy(user);
  UserList(user);
};

export default User;
