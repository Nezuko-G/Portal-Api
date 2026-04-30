import jwt from "jsonwebtoken";

type TokenPayload = {
  name: string;
  email: string;
  phone: string;
  id: string;
  role: string;
};

export const generateToken = (
  name: string,
  email: string,
  phone: string,
  id: string,
  role: string,
): string => {
  const secret = process.env.JWT_SECRET as string;
  const options: jwt.SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ||
      "7d") as jwt.SignOptions["expiresIn"],
  };

  return jwt.sign({ name, email, phone, id, role }, secret, options);
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
  } catch (error) {
    return null;
  }
};
