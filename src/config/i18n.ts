import i18n from "i18n";
import path from "path";
import { fileURLToPath } from "url";
import { Request, Response, NextFunction } from "express";

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

i18n.configure({
  locales: ["ar", "en"],
  defaultLocale: "en",
  directory: path.join(__dirname, "../locales"),
  queryParameter: "lang",
  cookie: "lang",
  autoReload: true,
  updateFiles: false,
  syncFiles: false,
  objectNotation: true,
  register: global,
});

export const i18nMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  (req as any)._t = (req as any).__;
  (req as any)._tn = (req as any).__n;
  (res as any)._t = (res as any).__;
  (res as any)._tn = (res as any).__n;
  next();
};

export default i18n;
