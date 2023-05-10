import responseHelper from "../helpers/response.helper.js";
import hairdresserModel from "../models/hairdresser.model.js";

// CREATE
const create = async ({ formattedName, schedules }) => {
  const checkName = await hairdresserModel.findOne({ name: formattedName });

  if (checkName)
    return responseHelper.badrequest(
      res,
      "This hairdresser is already registered."
    );

  const hairdresser = new hairdresserModel();

  hairdresser.name = formattedName;
  hairdresser.schedules = schedules;

  await hairdresser.save();

  return hairdresser;
};

// READ ALL
const readAll = async () => {
  const hairdressers = await hairdresserModel.find();

  return hairdressers;
};

// UPDATE
const update = async ({ id, formattedName, schedules }) => {
  const hairdresser = await hairdresserModel.findById(id);

  if (!hairdresser) return responseHelper.notFound(res);

  hairdresser.name = formattedName;
  hairdresser.schedules = schedules;

  await hairdresser.save()

  return hairdresser
};

const deleteOne = async (id) => {
  const hairdresser = await hairdresserModel.findByIdAndDelete(id);

  return hairdresser;
};

export default {
  create,
  readAll,
  update,
  deleteOne
};
