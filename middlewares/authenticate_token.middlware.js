import { verifyToken } from "../services/jwt.service.js";
import User from "../models/User/user.model.js";
import { UnAuthorizedError } from "../Errors/error.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
      ? req.cookies.jwt
      : authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      throw new UnAuthorizedError("Token Not provided");
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken || !decodedToken.id) {
      throw new UnAuthorizedError("Invalid or expired Token");
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      throw new UnAuthorizedError("Invalid or expired Token");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
