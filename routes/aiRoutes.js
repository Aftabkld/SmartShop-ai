import express from "express";
import { aiSearchController } from "../controllers/aiController.js";

const router = express.Router();

router.post("/search", aiSearchController);

export default router;
