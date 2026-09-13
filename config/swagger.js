import swaggerUi from "swagger-ui-express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Ecommerce API",
    version: "1.0.0",
    description: "API documentation for the Ecommerce project"
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local server"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id:    { type: "string" },
          name:  { type: "string" },
          email: { type: "string" },
          role:  { type: "string", enum: ["user", "admin"] }
        }
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name:     { type: "string", example: "John Doe" },
          email:    { type: "string", example: "john@example.com" },
          password: { type: "string", example: "password123" }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email:    { type: "string", example: "john@example.com" },
          password: { type: "string", example: "password123" }
        }
      },
      Product: {
        type: "object",
        properties: {
          _id:         { type: "string" },
          name:        { type: "string" },
          description: { type: "string" },
          price:       { type: "number" },
          category:    { type: "string" },
          stock:       { type: "number" },
          published:   { type: "boolean" },
          createdAt:   { type: "string", format: "date-time" },
          updatedAt:   { type: "string", format: "date-time" }
        }
      },
      CreateProductRequest: {
        type: "object",
        required: ["name", "description", "price", "category", "stock"],
        properties: {
          name:        { type: "string" },
          description: { type: "string" },
          price:       { type: "number" },
          category:    { type: "string" },
          stock:       { type: "number", minimum: 0 },
          published:   { type: "boolean" }
        }
      },
      UpdateUserRoleRequest: {
        type: "object",
        required: ["role"],
        properties: {
          role: { type: "string", enum: ["user", "admin"] }
        }
      }
    }
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" }
            }
          }
        },
        responses: {
          "201": { description: "User registered successfully" },
          "400": { description: "User already exists" },
          "500": { description: "Registration failed" }
        }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and get a JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" }
            }
          }
        },
        responses: {
          "200": { description: "Login successful, returns token" },
          "404": { description: "User not found" },
          "401": { description: "Invalid email or password" }
        }
      }
    },
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Get all products (published only for non-admins)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "category", in: "query", schema: { type: "string" }, description: "Filter by category" },
          { name: "minPrice", in: "query", schema: { type: "number" }, description: "Minimum price" },
          { name: "maxPrice", in: "query", schema: { type: "number" }, description: "Maximum price" },
          { name: "sort",     in: "query", schema: { type: "string", enum: ["price_asc", "price_desc", "newest"] }, description: "Sort option" },
          { name: "page",     in: "query", schema: { type: "integer", default: 1 }, description: "Page number" },
          { name: "limit",    in: "query", schema: { type: "integer", default: 10 }, description: "Items per page" }
        ],
        responses: {
          "200": { description: "List of products with pagination" }
        }
      },
      post: {
        tags: ["Products"],
        summary: "Create a product (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateProductRequest" }
            }
          }
        },
        responses: {
          "201": { description: "Product created successfully" },
          "401": { description: "Not authenticated" },
          "403": { description: "Admin only" }
        }
      }
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get a single product by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Product id" }
        ],
        responses: {
          "200": { description: "Product detail" },
          "400": { description: "Invalid product id" },
          "404": { description: "Product not found" }
        }
      },
      put: {
        tags: ["Products"],
        summary: "Update a product (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Product id" }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateProductRequest" }
            }
          }
        },
        responses: {
          "200": { description: "Product updated successfully" },
          "400": { description: "Invalid product id" },
          "404": { description: "Product not found" }
        }
      },
      delete: {
        tags: ["Products"],
        summary: "Delete a product (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Product id" }
        ],
        responses: {
          "200": { description: "Product deleted successfully" },
          "400": { description: "Invalid product id" },
          "404": { description: "Product not found" }
        }
      }
    },
    "/api/products/{id}/publish": {
      patch: {
        tags: ["Products"],
        summary: "Publish a product (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Product id" }
        ],
        responses: {
          "200": { description: "Product published successfully" },
          "400": { description: "Invalid product id" },
          "404": { description: "Product not found" }
        }
      }
    },
    "/api/products/{id}/unpublish": {
      patch: {
        tags: ["Products"],
        summary: "Unpublish a product (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Product id" }
        ],
        responses: {
          "200": { description: "Product unpublished successfully" },
          "400": { description: "Invalid product id" },
          "404": { description: "Product not found" }
        }
      }
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users (admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "List of users" }
        }
      }
    },
    "/api/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get a single user (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "User id" }
        ],
        responses: {
          "200": { description: "User detail" },
          "404": { description: "User not found" }
        }
      },
      delete: {
        tags: ["Users"],
        summary: "Delete a user (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "User id" }
        ],
        responses: {
          "200": { description: "User deleted successfully" },
          "404": { description: "User not found" }
        }
      }
    },
    "/api/users/{id}/role": {
      patch: {
        tags: ["Users"],
        summary: "Update a user's role (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "User id" }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUserRoleRequest" }
            }
          }
        },
        responses: {
          "200": { description: "User role updated successfully" },
          "400": { description: "Role must be either 'user' or 'admin'" },
          "404": { description: "User not found" }
        }
      }
    }
  }
};

export { swaggerUi, swaggerDocument };
