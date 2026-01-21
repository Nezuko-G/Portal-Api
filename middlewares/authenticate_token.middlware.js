import { verifyToken } from "../services/jwt.service.js";
import User from "../models/User/user.model.js";
import { UnAuthorizedError } from "../utils/error.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies.jwt
      ? req.cookies.jwt
      : authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      throw new UnAuthorizedError(res._t("middleware.token_not_provided"));
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken || !decodedToken.id) {
      throw new UnAuthorizedError(
        res._t("middleware.invalid_or_expired_token")
      );
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      throw new UnAuthorizedError(
        res._t("middleware.invalid_or_expired_token")
      );
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
