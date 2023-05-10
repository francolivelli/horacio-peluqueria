import mongoose from "mongoose";
import modelOptions from "./model.options.js";

const passwordResetTokenSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      expires: "24h",
    },
  },
  modelOptions
);

const passwordResetTokenModel = mongoose.model(
  "PasswordResetToken",
  passwordResetTokenSchema
);

export default passwordResetTokenModel;
