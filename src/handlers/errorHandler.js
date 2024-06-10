import logger from "../utils/logger.js";
class ErrorHandler extends Error {
  constructor(
    statusCode,
    message,
    description = `Error "${statusCode}". "${message}"`,
    internalLog
  ) {
    super(message);
    this.statusCode = statusCode;
    logger.error(description);
    if (internalLog) {
      logger.error(internalLog);
    }
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
