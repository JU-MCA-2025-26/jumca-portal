import { Router } from "express";
import {
  getAlumniList,
  getAlumniProfile,
  getGraduationYears,
  getIncomingConnectRequests,
  getOutgoingConnectRequests,
  respondToConnectRequest,
  sendConnectRequest,
} from "@/controllers/alumni.controller.js";
import { Role } from "@/generated/enums.js";
import { validate } from "@/middleware/validate.js";
import { authenticate } from "@/middleware/authenticate.js";
import { authorize } from "@/middleware/authorize.js";
import { respondConnectRequestSchema, sendConnectRequestSchema } from "@jumca/shared";

const router = Router();

// Every alumni route requires a logged-in user - students, alumni and admins can all browse the directory.
router.use(authenticate);

router.get("/", getAlumniList);
router.get("/years", getGraduationYears);

// Only the alumni themselves can see/act on their own inbox.
router.get("/connect-requests/incoming", authorize(Role.ALUMNI), getIncomingConnectRequests);
router.get("/connect-requests/outgoing", getOutgoingConnectRequests);
router.patch(
  "/connect-requests/:id",
  authorize(Role.ALUMNI),
  validate(respondConnectRequestSchema),
  respondToConnectRequest,
);

router.get("/:id", getAlumniProfile);
router.post("/:id/connect", validate(sendConnectRequestSchema), sendConnectRequest);

export default router;
