import { Router } from "express";
import { userDBManager } from "../dao/mongo/userDBManager.js";
import UsersController from "../controllers/user.controller.js";
import UserRepository from "../repositories/user.repository.js";
import userModel from "../dao/models/userModel.js";
import UserService from "../services/user.service.js";

const router = Router();
const Users = new userDBManager();

const repository = new UserRepository(userModel);
const service = new UserService(repository);
const controller = new UsersController(service);

router.get("/", async (req, res) => {
  try {
    const users = await Users.getAll();
    const safe = users.map(({ password, ...u }) => u);
    res.send({ status: "success", payload: safe });
  } catch (err) {
    res.status(400).send({ status: "error", message: err.message });
  }
});

router.get("/:uid", async (req, res) => {
  try {
    const user = await Users.getById(req.params.uid);
    const { password, ...safe } = user;
    res.send({ status: "success", payload: safe });
  } catch (err) {
    res.status(400).send({ status: "error", message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await Users.create(req.body);
    const { password, ...safe } = created;
    res.send({ status: "success", payload: safe });
  } catch (err) {
    res.status(400).send({ status: "error", message: err.message });
  }
});

router.put("/:uid", async (req, res) => {
  try {
    const updated = await Users.update(req.params.uid, req.body);
    const { password, ...safe } = updated;
    res.send({ status: "success", payload: safe });
  } catch (err) {
    res.status(400).send({ status: "error", message: err.message });
  }
});

router.delete("/:uid", async (req, res) => {
  try {
    const deleted = await Users.delete(req.params.uid);
    const { password, ...safe } = deleted;
    res.send({ status: "success", payload: safe });
  } catch (err) {
    res.status(400).send({ status: "error", message: err.message });
  }
});

router.post("/password-recovery", controller.requestPasswordReset);

router.post("/reset-password", controller.resetPassword);


export default router;
