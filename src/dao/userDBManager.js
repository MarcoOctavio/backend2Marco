import userModel from "./models/userModel.js";
import { cartModel } from "./models/cartModel.js";
import { createHash } from "../utils/passwordUtil.js";

class userDBManager {
  async getAll() {
    return userModel.find().lean();
  }

  async getById(uid) {
    const user = await userModel.findById(uid).lean();
    if (!user) throw new Error(`El usuario ${uid} no existe!`);
    return user;
  }

  async getByEmail(email) {
    return userModel.findOne({ email }).lean();
  }

  async create(payload) {
    const { first_name, last_name, email, age, password, role } = payload;

    if (!first_name || !last_name || !email || age === undefined || !password) {
      throw new Error("Faltan campos requeridos (first_name, last_name, email, age, password).");
    }

    const exists = await userModel.findOne({ email });
    if (exists) throw new Error("Ya existe un usuario con ese email.");

    // Crea carrito asociado (opcional pero útil para ecommerce)
    const newCart = await cartModel.create({ products: [] });

    const created = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      cart: newCart._id,
      role: role || "user",
    });

    return created.toObject();
  }

  async update(uid, payload) {
    // Si viene password, la re-hasheamos
    if (payload?.password) payload.password = createHash(payload.password);

    const updated = await userModel.findByIdAndUpdate(uid, payload, { new: true }).lean();
    if (!updated) throw new Error(`El usuario ${uid} no existe!`);
    return updated;
  }

  async delete(uid) {
    const deleted = await userModel.findByIdAndDelete(uid).lean();
    if (!deleted) throw new Error(`El usuario ${uid} no existe!`);
    return deleted;
  }
}

export { userDBManager };
