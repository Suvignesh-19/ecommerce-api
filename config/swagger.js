import swaggerJsdoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "API documentation for the E-Commerce backend",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    // Declare tags so they appear in order in Swagger UI
    tags: [
      {
        name: "Auth",
        description: "Register and login endpoints",
      },
      {
        name: "Products",
        description: "Product management endpoints",
      },
      {
        name: "Users",
        description: "User management endpoints (Admin only)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token from login response",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id:       { type: "string", example: "64abc123..." },
            name:      { type: "string", example: "John Doe" },
            email:     { type: "string", example: "john@example.com" },
            role:      { type: "string", enum: ["user", "admin"], example: "user" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id:         { type: "string", example: "64abc456..." },
            name:        { type: "string", example: "Laptop" },
            description: { type: "string", example: "A powerful laptop" },
            price:       { type: "number", example: 999.99 },
            category:    { type: "string", example: "Electronics" },
            stock:       { type: "number", example: 10 },
            published:   { type: "boolean", example: true },
            createdAt:   { type: "string", format: "date-time" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            user:  { $ref: "#/components/schemas/User" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "Something went wrong" },
          },
        },
      },
    },
  },
  // Use absolute path to ensure routes are found in ESM projects
  apis: [join(__dirname, "../routes/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
