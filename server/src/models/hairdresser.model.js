import mongoose from "mongoose";
import modelOptions from "./model.options.js";

const hairdresserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    schedules: {
      type: String,
      required: true,
    },
  },
  modelOptions
);

const hairdresserModel = mongoose.model("Hairdresser", hairdresserSchema);

export default hairdresserModel;
