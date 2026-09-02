import { Router } from "express";
import { authenticate } from "@/middleware/authenticate.js";
import { getMyProfile, updateMyProfile } from "@/controllers/profile.controller.js";

const router = Router();

router.use(authenticate);

router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);

export default router;
