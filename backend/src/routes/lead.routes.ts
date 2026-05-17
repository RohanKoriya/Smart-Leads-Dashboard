import express from "express";

import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from "../controllers/lead.controller";

import { protect } from "../middleware/auth.middleware";

import { authorizeRoles } from "../middleware/role.middleware";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "sales"), createLead);

router.get("/", protect, authorizeRoles("admin", "sales"), getLeads);

router.get("/:id", protect, authorizeRoles("admin", "sales"), getLeadById);

router.put("/:id", protect, authorizeRoles("admin", "sales"), updateLead);

router.delete("/:id", protect, authorizeRoles("admin"), deleteLead);

export default router;
