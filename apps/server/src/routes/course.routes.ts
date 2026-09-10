import { Router } from "express";
import { getCourses, getElectives, saveElective } from "@/controllers/course.controller.js";
import { authenticate } from "@/middleware/authenticate.js";

const router = Router();

router.use(authenticate);

router.get("/", getCourses);
router.get("/electives", getElectives);
router.post("/electives", saveElective);

export default router;
