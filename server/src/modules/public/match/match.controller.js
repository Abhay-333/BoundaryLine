import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";
import MatchService from "../../private/match/match.service.js";

class PublicMatchController {
  constructor(matchService = new MatchService()) {
    this.matchService = matchService;
  }

  listMatches = asyncHandler(async (_req, res) => {
    const matches = await this.matchService.listMatches();

    return new ApiResponse(
      200,
      "Matches fetched successfully",
      matches
    ).send(res);
  });

  getMatch = asyncHandler(async (req, res) => {
    const matchId =
      req.validated?.params?.id ||
      req.params.id;

    const match =
      await this.matchService.getMatchById(matchId);

    return new ApiResponse(
      200,
      "Match fetched successfully",
      match
    ).send(res);
  });
}

export default PublicMatchController;