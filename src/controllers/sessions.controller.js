import jwt from "jsonwebtoken";
import UserDTO from "../dto/user.dto.js";

export default class SessionsController {

  register = async (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.send({ status: "success", payload: userDTO });
  };

  login = async (req, res) => {

    const user = req.user;

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const cookieName = process.env.JWT_COOKIE_NAME || "jwt";

    res
      .cookie(cookieName, token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      })
      .send({
        status: "success",
        payload: {
          token,
          user: new UserDTO(user)
        }
      });
  };

  current = async (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.send({ status: "success", payload: userDTO });
  };
}