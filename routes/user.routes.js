import express from "express";

import {
  getUsers,
  updateUserRole,
  deleteUser
} from "../controllers/user.controller.js";

import {
  authenticate,
  authorizeAdmin
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorizeAdmin,
  getUsers
);

router.patch(
  "/:id/role",
  authenticate,
  authorizeAdmin,
  updateUserRole
);

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  deleteUser
);

export default router;