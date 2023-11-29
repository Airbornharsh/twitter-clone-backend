import { Router } from "express";
import Controllers from "../controllers/Controllers";

const Notification = (user: Router) => {
  const notification = Router();

  user.use("/notification", notification);

  notification.get("/", Controllers.GetNotificationsController);
};

export default Notification;
