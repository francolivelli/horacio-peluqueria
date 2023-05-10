const responseWithData = (res, statusCode, data) => {
  return res.status(statusCode).json(data);
};

const error = (res, message = null) =>
  responseWithData(res, 500, {
    status: 500,
    message: message || "Oops! Something's wrong!",
  });

const badrequest = (res, message) =>
  responseWithData(res, 400, {
    status: 400,
    message,
  });

const ok = (res, data) => responseWithData(res, 200, data);

const created = (res, data) => responseWithData(res, 201, data);

const deleted = (res) => responseWithData(res, 204);

const unauthorized = (res) =>
  responseWithData(res, 401, {
    status: 401,
    message: "Unauthorized",
  });

const notFound = (res) =>
  responseWithData(res, 404, {
    status: 404,
    message: "Resource not found",
  });

export default {
  error,
  badrequest,
  ok,
  created,
  deleted,
  unauthorized,
  notFound,
};
