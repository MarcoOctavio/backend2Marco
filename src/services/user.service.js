import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { transporter } from "../utils/mailer.js";

export default class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }


  async sendRecoveryEmail(email) {
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `
        <h3>Recuperación de contraseña</h3>
        <p>Haz clic en el botón para restablecer tu contraseña:</p>
        <a href="${link}">
          <button style="padding:10px;background:#000;color:#fff;">
            Restablecer contraseña
          </button>
        </a>
        <p>Este enlace expira en 1 hora.</p>
      `,
    });

    return { message: "Correo enviado correctamente" };
  }

  async resetPassword(token, newPassword) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await this.userRepository.getById(decoded.id);

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const isSamePassword = bcrypt.compareSync(newPassword, user.password);

      if (isSamePassword) {
        throw new Error("No puedes usar la misma contraseña anterior");
      }

      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      await this.userRepository.update(user._id, {
        password: hashedPassword,
      });

      return { message: "Contraseña actualizada correctamente" };

    } catch (error) {
      throw new Error("Token inválido o expirado");
    }
  }
}