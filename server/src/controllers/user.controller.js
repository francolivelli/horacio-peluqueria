import responseHelper from "../helpers/response.helper.js";
import usersService from "../services/user.service.js";
import {
  generatePasswordResetToken,
  generateToken,
  createPasswordResetUrl,
} from "../helpers/token.helper.js";
import nodemailer from "nodemailer";
import passwordResetTokenModel from "../models/passwordResetToken.model.js";

// SIGNUP
const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersService.signup({
      email,
      password,
    });

    user.password = undefined;
    user.salt = undefined;

    responseHelper.created(res, {
      ...user._doc,
      id: user.id,
    });
  } catch {
    responseHelper.error(res);
  }
};

// SIGNIN
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersService.signin(email, password);

    const token = generateToken(user);

    user.password = undefined;
    user.salt = undefined;

    const cookieOptions = {
      expires: new Date(Date.now() + 6 * 60 * 60 * 1000), // Establece la fecha de caducidad a 6 horas a partir de la fecha actual
      httpOnly: true, // Establece la cookie como HTTP only para evitar ataques XSS
      sameSite: "strict", // Establece el atributo SameSite para prevenir ataques CSRF
    };

    res.cookie("token", token, cookieOptions);
    responseHelper.created(res, {
      user: { ...user._doc, id: user.id },
    });
  } catch {
    responseHelper.error(res);
  }
};

// SIGNOUT
const signout = (req, res) => {
  res.clearCookie("token");
  res.sendStatus(204);
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Buscar usuario por correo electrónico
    const user = await usersService.findUserByEmail(email);

    // Manejar el caso en que no se encuentra ningún usuario con ese correo electrónico
    if (!user) {
      return responseHelper.notFound(res);
    }

    // Generar token de restablecimiento de contraseña
    const token = generatePasswordResetToken(user.id);

    const passwordResetToken = new passwordResetTokenModel();

    passwordResetToken.user_id = user.id;
    passwordResetToken.token = token;

    await passwordResetToken.save();

    // Crear URL para restablecer la contraseña
    const url = createPasswordResetUrl(token);

    // Configurar nodemailer para enviar el correo electrónico
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Definir las opciones del correo electrónico
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperación de contraseña",
      text: `Hola,\n\nRecibimos una solicitud de cambio de contraseña para tu cuenta. Si no solicitaste este cambio, puedes ignorar este correo electrónico.\n\nSi deseas cambiar tu contraseña, haz clic en el siguiente enlace para restablecerla:\n\n${url}\n\nEste enlace es válido por 24 horas. Si no realizas ningún cambio dentro de este tiempo, deberás volver a solicitar la recuperación de contraseña.\n\n¡Gracias por utilizar nuestro servicio!\n\nAtentamente,\nMi Turno Web`,
    };

    // Enviar correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // Manejar error
        return responseHelper.error(res);
      } else {
        // Enviar respuesta exitosa
        responseHelper.created(
          res,
          "Correo electrónico de recuperación de contraseña enviado"
        );
      }
    });
  } catch (error) {
    // Manejar error
    return responseHelper.error(res);
  }
};

// FIND USER BY EMAIL
const findUserByEmail = async (req, res) => {
  try {
    const { email } = req.params || req.body;

    const user = await usersService.findUserByEmail(email);

    responseHelper.ok(res, user);
  } catch (error) {
    responseHelper.error(res);
  }
};

// VERIFY TOKEN
const verifyToken = async (req, res) => {
  const token = req.params.token;

  try {
    const tokenRecord = await usersService.verifyToken(token);

    if (tokenRecord && token === tokenRecord.token) {
      // el token es válido, mostrar la página para restablecer la contraseña
      responseHelper.ok(res);
    } else {
      // el token no es válido, mostrar un mensaje de error
      responseHelper.unauthorized(res);
    }
  } catch (err) {
    responseHelper.error(res);
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const resetToken = await usersService.verifyToken(token);

    await usersService.resetPassword(resetToken.user_id, password);

    await usersService.deleteToken(token);

    responseHelper.ok(res);
  } catch {
    responseHelper.error(res);
  }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, id } = req.body;

    await usersService.changePassword(currentPassword, newPassword, id);

    responseHelper.ok(res);
  } catch {
    responseHelper.error(res);
  }
};

export default {
  signup,
  signin,
  signout,
  forgotPassword,
  findUserByEmail,
  verifyToken,
  resetPassword,
  changePassword,
};
