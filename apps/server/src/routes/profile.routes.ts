import { Router } from "express";
import { authenticate } from "@/middleware/authenticate.js";
import { getMyProfile, updateMyProfile } from "@/controllers/profile.controller.js";

import { doubleCsrfProtection } from "@/app.js";

const router = Router();

router.use(authenticate);

router.get("/me", getMyProfile);
router.put("/me", doubleCsrfProtection, updateMyProfile);

export default router;
