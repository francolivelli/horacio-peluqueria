import responseHelper from "../helpers/response.helper.js";
import {capitalizeName} from "../helpers/string.helper.js";
import hairdresserService from "../services/hairdresser.service.js";

// CREATE
const create = async (req, res) => {
  try {
    const { name, schedules } = req.body;

    const formattedName = capitalizeName(name);

    const newHairdresser = await hairdresserService.create({
      formattedName,
      schedules,
    });

    responseHelper.created(res, {
      ...newHairdresser._doc,
      id: newHairdresser.id,
    });
  } catch {
    responseHelper.error(res);
  }
};

// READ ALL
const readAll = async (req, res) => {
  try {
    const hairdressers = await hairdresserService.readAll();

    responseHelper.ok(res, hairdressers);
  } catch {
    responseHelper.error(res);
  }
};

// UPDATE
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, schedules } = req.body;

    const formattedName = capitalizeName(name);

    const editedHairdresser = await hairdresserService.update({
      id,
      formattedName,
      schedules,
    });

    responseHelper.ok(res, editedHairdresser);
  } catch {
    responseHelper.error(res);
  }
};

// DELETE ONE
const deleteOne = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedHairdresser = await hairdresserService.deleteOne(id);

    if (!deletedHairdresser) return responseHelper.notFound(res);

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
