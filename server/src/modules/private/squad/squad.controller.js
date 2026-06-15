import { StatusCodes } from "http-status-codes";

import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

import SquadService from "./squad.service.js";

class SquadController {
  constructor(squadService = new SquadService()) {
    this.squadService = squadService;
  }

  listSquads = asyncHandler(async (req, res) => {
    const squads = await this.squadService.getSquads();

    return new ApiResponse(
      StatusCodes.OK,
      "Squads fetched successfully",
      squads
    ).send(res);
  });

  getSquad = asyncHandler(async (req, res) => {
    const squad = await this.squadService.getSquadById(
      req.validated.params.id
    );

    return new ApiResponse(
      StatusCodes.OK,
      "Squad fetched successfully",
      squad
    ).send(res);
  });

  createSquad = asyncHandler(async (req, res) => {
    const squad = await this.squadService.createSquad(
      req.validated.body
    );

    return new ApiResponse(
      StatusCodes.CREATED,
      "Squad created successfully",
      squad
    ).send(res);
  });

  updateSquad = asyncHandler(async (req, res) => {
    const squad = await this.squadService.updateSquad(
      req.validated.params.id,
      req.validated.body
    );

    return new ApiResponse(
      StatusCodes.OK,
      "Squad updated successfully",
      squad
    ).send(res);
  });

  deleteSquad = asyncHandler(async (req, res) => {
    const squad = await this.squadService.deleteSquad(
      req.validated.params.id
    );

    return new ApiResponse(
      StatusCodes.OK,
      "Squad deleted successfully",
      squad
    ).send(res);
  });
}

export default SquadController;