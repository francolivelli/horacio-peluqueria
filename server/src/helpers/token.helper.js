import jwt from "jsonwebtoken";
const SECRET = process.env.TOKEN_SECRET;
import { v4 as uuidv4 } from "uuid";

function generateToken(payload) {
  return jwt.sign({ user: payload }, SECRET, { expiresIn: "1d" });
}

function validateToken(token) {
  return jwt.verify(token, SECRET);
}

// Generar un token JWT firmado con un uuid aleatorio como subject (sub)
const generatePasswordResetToken = (userId) => {
  const token = jwt.sign({}, SECRET, {
    subject: uuidv4(),
    expiresIn: "24h",
    issuer: "mi-turno-web-server",
    audience: userId.toString(),
  });

  return token;
};

// Crear un enlace de restablecimiento de contraseña con el token generado
const createPasswordResetUrl = (token) => {
  return `${process.env.RESETPASS_URL}/?token=${token}`;
};

export {
  generateToken,
  validateToken,
  generatePasswordResetToken,
  createPasswordResetUrl,
};
