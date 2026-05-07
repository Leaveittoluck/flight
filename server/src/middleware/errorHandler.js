// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  const body = { ok: false, message };
  if (err.code) body.code = err.code;
  res.status(status).json(body);
}

module.exports = errorHandler;
