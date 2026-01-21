import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const apiBaseUrl =
  process.env.SWAGGER_SERVER_URL ||
  `http://localhost:${process.env.PORT || 3000}`;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nezuko Portal API",
      version: "1.0.0",
      description: "API documentation for the Nezuko job portal backend.",
    },
    servers: [
      {
        url: apiBaseUrl,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./docs/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
