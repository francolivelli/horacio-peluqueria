import mongoose from "mongoose";
import modelOptions from "./model.options.js";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 30,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  modelOptions
);

const serviceModel = mongoose.model("Service", serviceSchema);

export default serviceModel;
