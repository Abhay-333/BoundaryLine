import AppError from "../errors/AppError.js";

export function notFoundHandler(req, _res, next) {
  // What: convert unmatched requests into a consistent application error.
  // Why: unknown routes should return JSON instead of Express's default HTML.
  // How: forward a 404 AppError into the shared error handler.
  next(AppError.notFound(`Route not found: ${req.originalUrl}`));
}

export function errorHandler(error, _req, res, _next) {
  // What: normalize any thrown error into a JSON response.
  // Why: clients need predictable `{ success, message }` responses for failures.
  // How: prefer AppError fields, otherwise fall back to 500 Internal Server Error.
  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : "Internal server error";

  // What: include details only when they exist.
  // Why: validation details help clients, but empty fields add noise.
  // How: conditionally spread details into the response body.
  res.status(statusCode).json({
    success: false,
    message,
    ...(error.details ? { details: error.details } : {}),
  });
}
