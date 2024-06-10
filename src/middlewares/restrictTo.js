import ErrorHandler from "../handlers/errorHandler.js";

const AdminOnly = (roles = ["FP:ADMIN"]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          "Unauthorized. Only admins can perform this action.",
          401
        )
      );
    }

    next();
  };
};

export default AdminOnly ;
