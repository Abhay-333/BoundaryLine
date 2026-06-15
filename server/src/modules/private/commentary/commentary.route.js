import CommentaryController from "./commentary.controller.js";
import express from "express";

import validateRequest from "../middleware/validateRequest.js";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

import {
  createCommentarySchema,
  commentaryParamSchema,
  getCommentaryByMatchSchema,
} from "../validators/commentary.validator.js";

const router = express.Router();

const commentaryController = new CommentaryController();

/**
 * POST /api/commentary
 * New commentary create karega
 * Only ADMIN, SUPER_ADMIN, SCORER
 */
router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "SCORER"),
  validateRequest(createCommentarySchema),
  commentaryController.addCommentary,
);

/**
 * DELETE /api/commentary/:id
 * Commentary delete karega
 * Only ADMIN & SUPER_ADMIN
 */
router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  validateRequest(commentaryParamSchema),
  commentaryController.deleteCommentary,
);

/**
 * GET /api/commentary/match/:matchId
 * Match ki commentary fetch karega Logged-in users only
 */
router.get(
  "/match/:matchId",
  authenticate,
  validateRequest(getCommentaryByMatchSchema),
  commentaryController.getCommentaryByMatch,
);

export default router;