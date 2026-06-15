import { Router } from "express";
import TournamentController from "./tournament.controller.js";

import { validate } from "../../../shared/middlewares/validate.js";

import {
    createTournamentSchema,
    updateTournamentSchema,
    tournamentIdSchema
} from "./tournament.validation.js";

const router = Router();

const tournamentController =
    new TournamentController();

router.get(
    "/",
    tournamentController.listTournaments
);

router.get(
    "/:id",
    validate(tournamentIdSchema),
    tournamentController.getTournament
);

router.post(
    "/",
    validate(createTournamentSchema),
    tournamentController.createTournament
);

router.patch(
    "/:id",
    validate({
        ...tournamentIdSchema,
        ...updateTournamentSchema
    }),
    tournamentController.updateTournament
);

router.delete(
    "/:id",
    validate(tournamentIdSchema),
    tournamentController.deleteTournament
);

export default router;