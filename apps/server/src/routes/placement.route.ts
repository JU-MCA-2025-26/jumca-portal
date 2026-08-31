import { Router } from "express";
import { authenticate } from "@/middleware/authenticate.js";
import { placementStats, listDrives, getDrive } from "@/controllers/placement.controller.js";

const router = Router();

router.use(authenticate);

router.get("/stats", placementStats);

router.get("/drives", listDrives);

router.get("/drives/:id", getDrive);

export default router;
