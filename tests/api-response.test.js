import { jest, describe, expect, it } from "@jest/globals";
import { ApiResponse } from "../src/utils/response.js";

describe("ApiResponse utility class", () => {
  const createMockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  describe("Constructor & toJSON()", () => {
    it("creates standard success payload with default 200 statusCode", () => {
      const response = new ApiResponse({
        message: "Operation successful",
        data: { id: 1, name: "Test" },
      });

      expect(response.success).toBe(true);
      expect(response.statusCode).toBe(200);
      expect(response.status).toBe(200);
      expect(response.message).toBe("Operation successful");
      expect(response.data).toEqual({ id: 1, name: "Test" });
      expect(response.timestamp).toBeDefined();

      const json = response.toJSON();
      expect(json).toEqual({
        success: true,
        statusCode: 200,
        status: 200,
        message: "Operation successful",
        timestamp: response.timestamp,
        data: { id: 1, name: "Test" },
      });
    });

    it("creates standard error payload with statusCode >= 400", () => {
      const response = new ApiResponse({
        success: false,
        statusCode: 404,
        message: "Resource not found",
        errors: ["Item with ID does not exist"],
      });

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(404);
      expect(response.status).toBe(404);
      expect(response.message).toBe("Resource not found");
      expect(response.errors).toEqual(["Item with ID does not exist"]);

      const json = response.toJSON();
      expect(json.success).toBe(false);
      expect(json.statusCode).toBe(404);
      expect(json.status).toBe(404);
      expect(json.message).toBe("Resource not found");
      expect(json.errors).toEqual(["Item with ID does not exist"]);
      expect(json.data).toBeUndefined();
    });

    it("includes pagination meta and total if provided", () => {
      const items = [{ id: 1 }, { id: 2 }];
      const response = new ApiResponse({
        message: "Items fetched",
        data: items,
        total: 2,
        meta: { page: 1, limit: 10, totalPages: 1 },
      });

      const json = response.toJSON();
      expect(json.total).toBe(2);
      expect(json.meta).toEqual({ page: 1, limit: 10, totalPages: 1 });
      expect(json.data).toEqual(items);
    });

    it("includes conflicts map when passed", () => {
      const conflicts = { email: "Already taken" };
      const response = new ApiResponse({
        statusCode: 409,
        message: "Conflict occurred",
        conflicts,
      });

      const json = response.toJSON();
      expect(json.success).toBe(false);
      expect(json.conflicts).toEqual(conflicts);
    });
  });

  describe("Express send() integration", () => {
    it("calls res.status and res.json with correct payload", () => {
      const res = createMockResponse();
      const response = new ApiResponse({
        statusCode: 201,
        message: "Created successfully",
        data: { id: "123" },
      });

      response.send(res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          statusCode: 201,
          status: 201,
          message: "Created successfully",
          data: { id: "123" },
        }),
      );
    });
  });

  describe("Static Helper Methods", () => {
    it("ApiResponse.success() sends standard 200 response", () => {
      const res = createMockResponse();
      ApiResponse.success(res, "Success message", { result: "ok" });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          statusCode: 200,
          message: "Success message",
          data: { result: "ok" },
        }),
      );
    });

    it("ApiResponse.created() sends 201 created response", () => {
      const res = createMockResponse();
      ApiResponse.created(res, "Entity created", { id: "new-id" });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          statusCode: 201,
          message: "Entity created",
          data: { id: "new-id" },
        }),
      );
    });

    it("ApiResponse.paginated() sends paginated list with total and meta", () => {
      const res = createMockResponse();
      const list = ["item1", "item2"];
      ApiResponse.paginated(res, "Fetched list", list, 50, { page: 1, limit: 2 });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          statusCode: 200,
          message: "Fetched list",
          data: list,
          total: 50,
          meta: { page: 1, limit: 2 },
        }),
      );
    });

    it("ApiResponse.error() sends custom error status and payload", () => {
      const res = createMockResponse();
      ApiResponse.error(res, "Server error", 500, "Error details");

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          statusCode: 500,
          message: "Server error",
          errors: "Error details",
        }),
      );
    });

    it("ApiResponse.badRequest() sends 400 error", () => {
      const res = createMockResponse();
      ApiResponse.badRequest(res, "Invalid payload", [{ field: "email" }]);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          statusCode: 400,
          message: "Invalid payload",
          errors: [{ field: "email" }],
        }),
      );
    });

    it("ApiResponse.unauthorized() sends 401 error", () => {
      const res = createMockResponse();
      ApiResponse.unauthorized(res, "Please log in");

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          statusCode: 401,
          message: "Please log in",
        }),
      );
    });

    it("ApiResponse.notFound() sends 404 error", () => {
      const res = createMockResponse();
      ApiResponse.notFound(res, "User not found");

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          statusCode: 404,
          message: "User not found",
        }),
      );
    });

    it("ApiResponse.conflict() sends 409 with conflicts", () => {
      const res = createMockResponse();
      ApiResponse.conflict(res, "Already exists", { code: "Duplicate code" });

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          statusCode: 409,
          conflicts: { code: "Duplicate code" },
        }),
      );
    });
  });
});
