import swaggerJsdoc from "swagger-jsdoc";

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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id:      { type: "string" },
            name:     { type: "string" },
            email:    { type: "string" },
            role:     { type: "string", enum: ["user", "admin"] },
            createdAt:{ type: "string", format: "date-time" },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id:        { type: "string" },
            name:       { type: "string" },
            description:{ type: "string" },
            price:      { type: "number" },
            category:   { type: "string" },
            stock:      { type: "number" },
            published:  { type: "boolean" },
            createdAt:  { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

