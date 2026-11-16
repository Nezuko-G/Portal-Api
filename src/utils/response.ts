import type { Response } from "express";

export interface ApiResponseOptions<T = any> {
  success?: boolean;
  statusCode?: number;
  message: string;
  data?: T;
  total?: number;
  meta?: Record<string, any>;
  errors?: any;
  conflicts?: Record<string, any>;
}

export interface IApiResponsePayload<T = any> {
  success: boolean;
  status: number;
  statusCode: number;
  message: string;
  timestamp: string;
  data?: T;
  total?: number;
  meta?: Record<string, any>;
  errors?: any;
  conflicts?: Record<string, any>;
}

export class ApiResponse<T = any> {
  public readonly success: boolean;
  public readonly status: number;
  public readonly statusCode: number;
  public readonly message: string;
  public readonly timestamp: string;
  public readonly data?: T;
  public readonly total?: number;
  public readonly meta?: Record<string, any>;
  public readonly errors?: any;
  public readonly conflicts?: Record<string, any>;

  constructor(options: ApiResponseOptions<T>) {
    this.statusCode =
      options.statusCode ?? (options.success === false ? 500 : 200);
    this.status = this.statusCode; // Backward compatibility with { status: 400, ... }
    this.success =
      options.success ?? (this.statusCode >= 200 && this.statusCode < 400);
    this.message = options.message;
    this.timestamp = new Date().toISOString();

    if (options.data !== undefined) {
      this.data = options.data;
    }
    if (options.total !== undefined) {
      this.total = options.total;
    }
    if (options.meta !== undefined) {
      this.meta = options.meta;
    }
    if (options.errors !== undefined) {
      this.errors = options.errors;
    }
    if (options.conflicts !== undefined) {
      this.conflicts = options.conflicts;
    }
  }

  /**
   * Serializes the response object to clean JSON without undefined fields.
   */
  public toJSON(): IApiResponsePayload<T> {
    const payload: IApiResponsePayload<T> = {
      success: this.success,
      status: this.status,
      statusCode: this.statusCode,
      message: this.message,
      timestamp: this.timestamp,
    };

    if (this.data !== undefined) payload.data = this.data;
    if (this.total !== undefined) payload.total = this.total;
    if (this.meta !== undefined) payload.meta = this.meta;
    if (this.errors !== undefined) payload.errors = this.errors;
    if (this.conflicts !== undefined) payload.conflicts = this.conflicts;

    return payload;
  }

  /**
   * Directly sends the HTTP response using the provided Express response object.
   */
  public send(res: Response): Response {
    return res.status(this.statusCode).json(this.toJSON());
  }

  // Success Helpers

  /**
   * Helper to build and send a generic success response (HTTP 200 by default).
   */
  public static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200,
    meta?: Record<string, any>,
  ): Response {
    return new ApiResponse<T>({
      success: true,
      statusCode,
      message,
      data,
      meta,
    }).send(res);
  }

  /**
   * Helper to build and send an HTTP 201 Created response.
   */
  public static created<T>(
    res: Response,
    message: string,
    data?: T,
    meta?: Record<string, any>,
  ): Response {
    return ApiResponse.success(res, message, data, 201, meta);
  }

  /**
   * Helper to build and send a paginated/list success response.
   */
  public static paginated<T>(
    res: Response,
    message: string,
    data: T,
    total: number,
    meta?: Record<string, any>,
    statusCode: number = 200,
  ): Response {
    return new ApiResponse<T>({
      success: true,
      statusCode,
      message,
      data,
      total,
      meta,
    }).send(res);
  }

  // Error Helpers

  /**
   * Helper to build and send an error response with custom statusCode.
   */
  public static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    errors?: any,
    conflicts?: Record<string, any>,
  ): Response {
    return new ApiResponse({
      success: false,
      statusCode,
      message,
      errors,
      conflicts,
    }).send(res);
  }

  /**
   * Helper to build and send an HTTP 400 Bad Request error.
   */
  public static badRequest(
    res: Response,
    message: string = "Bad Request",
    errors?: any,
    conflicts?: Record<string, any>,
  ): Response {
    return ApiResponse.error(res, message, 400, errors, conflicts);
  }

  /**
   * Helper to build and send an HTTP 401 Unauthorized error.
   */
  public static unauthorized(
    res: Response,
    message: string = "Unauthorized",
  ): Response {
    return ApiResponse.error(res, message, 401);
  }

  /**
   * Helper to build and send an HTTP 403 Forbidden error.
   */
  public static forbidden(
    res: Response,
    message: string = "Forbidden",
  ): Response {
    return ApiResponse.error(res, message, 403);
  }

  /**
   * Helper to build and send an HTTP 404 Not Found error.
   */
  public static notFound(
    res: Response,
    message: string = "Not Found",
  ): Response {
    return ApiResponse.error(res, message, 404);
  }

  /**
   * Helper to build and send an HTTP 409 Conflict error.
   */
  public static conflict(
    res: Response,
    message: string = "Conflict",
    conflicts?: Record<string, any>,
  ): Response {
    return ApiResponse.error(res, message, 409, undefined, conflicts);
  }

  /**
   * Helper to build and send an HTTP 500 Internal Server Error.
   */
  public static internal(
    res: Response,
    message: string = "Internal Server Error",
    errors?: any,
  ): Response {
    return ApiResponse.error(res, message, 500, errors);
  }
}
