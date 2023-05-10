import responseHelper from "../helpers/response.helper.js";
import serviceModel from "../models/service.model.js";

// CREATE
const create = async ({ formattedName, duration, price }) => {
  const checkName = await serviceModel.findOne({ name: formattedName });

  if (checkName)
    return responseHelper.badrequest(
      res,
      "This service is already registered."
    );

  const service = new serviceModel();

  service.name = formattedName;
  service.duration = duration;
  service.price = price;

  await service.save();

  return service;
};

// READ ALL
const readAll = async () => {
  const services = await serviceModel.find();

  return services;
};

// UPDATE
const update = async ({ id, formattedName, duration, price }) => {
  const service = await serviceModel.findById(id);

  if (!service) return responseHelper.notFound(res);

  service.name = formattedName;
  service.duration = duration;
  service.price = price;

  await service.save();

  return service;
};

const deleteOne = async (id) => {
  const service = await serviceModel.findByIdAndDelete(id);

  return service;
};

export default {
  create,
  readAll,
  update,
  deleteOne,
};
