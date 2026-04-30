export class BadRequestError extends Error {
  public statusCode: number = 400;
  public conflicts?: Record<string, any>;

  constructor(
    message: string = "Bad Request",
    conflicts?: Record<string, any>,
  ) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
    if (conflicts) {
      this.conflicts = conflicts;
    }
  }
}

export class UnAuthorizedError extends Error {
  public statusCode: number = 401;

  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

export class ForbiddenError extends Error {
  public statusCode: number = 403;

  constructor(message: string = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

export class NotFoundError extends Error {
  public statusCode: number = 404;

  constructor(message: string = "Not Found") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

export class ConflictError extends Error {
  public statusCode: number = 409;

  constructor(message: string = "Conflict") {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}

export class InternalServerError extends Error {
  public statusCode: number = 500;

  constructor(message: string = "Internal Server Error") {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = 500;
  }
}
