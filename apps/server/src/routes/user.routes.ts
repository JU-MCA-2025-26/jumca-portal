import { Router } from "express";
import {
  activateUser,
  createUser,
  deactivateUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "@/controllers/user.controller.js";
import { Role } from "@/generated/enums.js";
import { validate } from "@/middleware/validate.js";
import { authenticate } from "@/middleware/authenticate.js";
import { createUserSchema, updateUserSchema } from "@jumca/shared";
import { authorize } from "@/middleware/authorize.js";

import { doubleCsrfProtection } from "@/app.js";

const router = Router();

router.post(
  "/",
  doubleCsrfProtection,
  authenticate,
  authorize(Role.ADMIN),
  validate(createUserSchema),
  createUser,
);
router.get("/", authenticate, authorize(Role.ADMIN), getUsers);
router.get("/:userId", getUserById);
router.patch("/:userId", doubleCsrfProtection, validate(updateUserSchema), updateUser);
router.delete(
  "/deactivate/:userId",
  doubleCsrfProtection,
  authenticate,
  authorize(Role.ADMIN),
  deactivateUser,
);
router.post(
  "/activate/:userId",
  doubleCsrfProtection,
  authenticate,
  authorize(Role.ADMIN),
  activateUser,
);
router.delete("/:userId", doubleCsrfProtection, authenticate, authorize(Role.ADMIN), deleteUser);

export default router;
