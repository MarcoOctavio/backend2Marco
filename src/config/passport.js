import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import userModel from "../dao/models/userModel.js";
import { createHash, isValidPassword } from "../utils/passwordUtil.js";
import { cartModel } from "../dao/models/cartModel.js";

const LocalStrategy = local.Strategy;
const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  const name = process.env.JWT_COOKIE_NAME || "jwt";
  return req?.cookies?.[name] || null;
};

export const initializePassport = () => {
  // REGISTER
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;

          if (!first_name || !last_name || age === undefined) {
            return done(null, false, { message: "Faltan campos requeridos para registrar." });
          }

          const exists = await userModel.findOne({ email });
          if (exists) return done(null, false, { message: "Usuario ya existe." });

          const newCart = await cartModel.create({ products: [] });

          const user = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: newCart._id,
            role: "user",
          });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // LOGIN
  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });
        if (!user) return done(null, false, { message: "Usuario no encontrado." });

        if (!isValidPassword(user, password)) {
          return done(null, false, { message: "Password incorrecto." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // JWT (para /current y rutas protegidas)
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          cookieExtractor,
          ExtractJwt.fromAuthHeaderAsBearerToken(),
        ]),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          // jwt_payload.user contiene el user “sanitizado”
          return done(null, jwt_payload.user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
};
