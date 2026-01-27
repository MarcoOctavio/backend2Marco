import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", passport.authenticate("register", { session: false }), (req, res) => {
  // No regreses password
  const user = req.user?.toObject ? req.user.toObject() : req.user;
  const { password, ...safeUser } = user;

  res.send({ status: "success", payload: safeUser });
});

router.post("/login", passport.authenticate("login", { session: false }), (req, res) => {
  const user = req.user?.toObject ? req.user.toObject() : req.user;
  const { password, ...safeUser } = user;

  const token = jwt.sign(
    { user: safeUser },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const cookieName = process.env.JWT_COOKIE_NAME || "jwt";

  res
    .cookie(cookieName, token, {
      httpOnly: true,
      // secure: true, // en prod con https
      // sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    })
    .send({ status: "success", payload: { token, user: safeUser } });
});

// /api/sessions/current
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  // req.user viene del JWT strategy
  res.send({ status: "success", payload: req.user });
});

export default router;
