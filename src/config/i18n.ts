import i18n from "i18n";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Request, Response, NextFunction } from "express";

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

const localeDirectories = [
  path.resolve(process.cwd(), "src/locales"),
  path.resolve(process.cwd(), "dist/locales"),
  path.join(__dirname, "../locales"),
];

const localeDirectory =
  localeDirectories.find((directory) => existsSync(directory)) ??
  localeDirectories[0];

i18n.configure({
  locales: ["ar", "en"],
  defaultLocale: "en",
  directory: localeDirectory,
  queryParameter: "lang",
  cookie: "lang",
  autoReload: false,
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
