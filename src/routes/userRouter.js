import { Router } from "express";
import { userDBManager } from "../dao/userDBManager.js";

const router = Router();
const Users = new userDBManager();

router.get("/", async (req, res) => {
  try {
    const users = await Users.getAll();
    // Sanitiza password
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

export default router;
