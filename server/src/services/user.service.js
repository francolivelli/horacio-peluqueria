import responseHelper from "../helpers/response.helper.js";
import passwordResetTokenModel from "../models/passwordResetToken.model.js";
import userModel from "../models/user.model.js";

// SIGNUP
const signup = async ({ email, password }) => {
  const checkEmail = await userModel.findOne({ email });

  if (checkEmail)
    return responseHelper.badrequest(res, "This email is already registered.");

  const user = new userModel();

  user.email = email;
  user.setPassword(password);

  await user.save();

  return user;
};

// SIGNIN
const signin = async (email, password) => {
  const user = await userModel
    .findOne({ email })
    .select("name dni email phone password role branch salt id");

  if (!user) return responseHelper.badrequest(res, "El usuario no existe.");

  if (!user.validPassword(password))
    return responseHelper.badrequest(res, "La contraseña es incorrecta.");

  return user;
};

// FIND USER BY EMAIL
const findUserByEmail = async (email) => {
  const user = await userModel.findOne({ email });

  if (!user) return responseHelper.badrequest(res, "User does not exist");

  return user;
};

// VERIFY TOKEN
const verifyToken = async (token) => {
  const resetToken = await passwordResetTokenModel
    .findOne({ token: token })
    .exec();

  if (!resetToken) return responseHelper.badrequest(res, "Invalid token");

  return resetToken;
};

// RESET PASSWORD
const resetPassword = async (id, newPassword) => {
  const user = await userModel.findOne({ _id: id });

  if (!user) return responseHelper.badrequest(res, "User does not exist");

  user.setPassword(newPassword);

  await user.save();

  return user;
};

// DELETE TOKEN
const deleteToken = async (token) => {
  const resetToken = await passwordResetTokenModel.findOne({ token: token });

  await resetToken.deleteOne();
};

// CHANGE PASSWORD
const changePassword = async (currentPassword, newPassword, id) => {
  const user = await userModel.findById(id).select("password salt");

  if (!user) return responseHelper.badrequest(res, "El usuario no existe.");

  if (!user.validPassword(currentPassword, user.salt))
    return responseHelper.badrequest(res, "La contraseña es incorrecta.");

  user.setPassword(newPassword);

  await user.save();

  return user;
};

export default {
  signin,
  signup,
  findUserByEmail,
  verifyToken,
  resetPassword,
  deleteToken,
  changePassword,
};
