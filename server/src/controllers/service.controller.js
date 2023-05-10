import responseHelper from "../helpers/response.helper.js";
import capitalizeQuote from "../helpers/string.helper.js";
import serviceService from "../services/service.service.js";

// CREATE
const create = async (req, res) => {
  try {
    const { name, duration, price } = req.body;

    const formattedName = capitalizeQuote(name);

    const newService = await serviceService.create({
      formattedName,
      duration,
      price,
    });

    responseHelper.created(res, {
      ...newService._doc,
      id: newService.id,
    });
  } catch {
    responseHelper.error(res);
  }
};

// READ ALL
const readAll = async (req, res) => {
  try {
    const services = await serviceService.readAll();

    responseHelper.ok(res, services);
  } catch {
    responseHelper.error(res);
  }
};

// UPDATE
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration, price } = req.body;

    const formattedName = capitalizeQuote(name);

    const editedService = await serviceService.update({
      id,
      formattedName,
      duration,
      price,
    });

    responseHelper.ok(res, editedService);
  } catch {
    responseHelper.error(res);
  }
};

// DELETE ONE
const deleteOne = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await serviceService.deleteOne(id);

    if (!deletedService) return responseHelper.notFound(res);

    responseHelper.deleted(res);
  } catch {
    responseHelper.error(res);
  }
};

export default {
  create,
  readAll,
  update,
  deleteOne,
};
