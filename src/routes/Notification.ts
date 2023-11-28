import { Router } from "express";

const Notification = (user: Router) => {
  const notification = Router();

  user.use("/notification", notification);

  notification.get("/", (req, res) => {
    res.json({ message: "Hello from notification!" });
  });
};

export default Notification;
