import { Router } from "express";
import passport from "passport";
import SessionsController from "../controllers/sessions.controller.js";

const router = Router();

const controller = new SessionsController();

router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  controller.register
);

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  controller.login
);

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  controller.current
);

export default router;