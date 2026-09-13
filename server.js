import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

import connectDB from "./config/db.js";
import swaggerSpec from "./config/swagger.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "E-Commerce API is running"
  });
});

// Routes
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/users",
  userRoutes
);

// 404 route
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// Error handler
app.use(
  (err, req, res, next) => {
    console.error(err);

    res.status(
      err.status || 500
    ).json({
      message:
        err.message ||
        "Internal server error"
    });
  }
);

// Start server
const startServer = async () => {
  await connectDB();

  app.listen(
    PORT,
    () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    }
  );
};

startServer();