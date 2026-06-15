import { Router } from "express";

import PlayingXIController from "./playing-xi.controller.js";

import { validate } from "../../../shared/middlewares/validate.js";

import {
  authMiddleware,
  authorizationMiddleware,
} from "../../../middlewares/auth.middleware.js";

import { ROLES } from "../../../constant/roles.constant.js";

import {
  createPlayingXISchema,
  updatePlayingXISchema,
  playingXIIdSchema,
} from "./playing-xi.validation.js";

const router = Router();

const playingXIController =
  new PlayingXIController();

const ADMIN_ROLES = [
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
];

/**
 * Public
 */

router.get(
  "/",
  playingXIController.listPlayingXIs
);

router.get(
  "/:id",
  validate(playingXIIdSchema),
  playingXIController.getPlayingXI
);

/**
 * Protected
 */

router.post(
  "/",
  authMiddleware,
  authorizationMiddleware(ADMIN_ROLES),
  validate(createPlayingXISchema),
  playingXIController.createPlayingXI
);

router.patch(
  "/:id",
  authMiddleware,
  authorizationMiddleware(ADMIN_ROLES),
  validate({
    ...playingXIIdSchema,
    ...updatePlayingXISchema,
  }),
  playingXIController.updatePlayingXI
);

router.delete(
  "/:id",
  authMiddleware,
 authorizationMiddleware(ADMIN_ROLES),
  validate(playingXIIdSchema),
  playingXIController.deletePlayingXI
);

export default router;