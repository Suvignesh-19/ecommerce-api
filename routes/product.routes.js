import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  publishProduct,
  unpublishProduct
} from "../controllers/product.controller.js";

import {
  authenticate,
  authorizeAdmin,
  optionalAuthenticate
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Get products
router.get(
  "/",
  optionalAuthenticate,
  getProducts
);

// Get single product
router.get(
  "/:id",
  optionalAuthenticate,
  getProductById
);

// Admin only
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  createProduct
);

router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  deleteProduct
);

router.patch(
  "/:id/publish",
  authenticate,
  authorizeAdmin,
  publishProduct
);

router.patch(
  "/:id/unpublish",
  authenticate,
  authorizeAdmin,
  unpublishProduct
);

export default router;