import { StatusCodes } from "http-status-codes";

import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

import PlayingXIService from "./playing-xi.service.js";

class PlayingXIController {
  constructor(
    playingXIService = new PlayingXIService()
  ) {
    this.playingXIService = playingXIService;
  }

  listPlayingXIs = asyncHandler(
    async (req, res) => {
      const playingXIs =
        await this.playingXIService.getPlayingXIs();

      return new ApiResponse(
        StatusCodes.OK,
        "Playing XIs fetched successfully",
        playingXIs
      ).send(res);
    }
  );

  getPlayingXI = asyncHandler(
    async (req, res) => {
      const playingXI =
        await this.playingXIService.getPlayingXIById(
          req.validated.params.id
        );

      return new ApiResponse(
        StatusCodes.OK,
        "Playing XI fetched successfully",
        playingXI
      ).send(res);
    }
  );

  createPlayingXI = asyncHandler(
    async (req, res) => {
      const playingXI =
        await this.playingXIService.createPlayingXI(
          req.validated.body
        );

      return new ApiResponse(
        StatusCodes.CREATED,
        "Playing XI created successfully",
        playingXI
      ).send(res);
    }
  );

  updatePlayingXI = asyncHandler(
    async (req, res) => {
      const playingXI =
        await this.playingXIService.updatePlayingXI(
          req.validated.params.id,
          req.validated.body
        );

      return new ApiResponse(
        StatusCodes.OK,
        "Playing XI updated successfully",
        playingXI
      ).send(res);
    }
  );

  deletePlayingXI = asyncHandler(
    async (req, res) => {
      const playingXI =
        await this.playingXIService.deletePlayingXI(
          req.validated.params.id
        );

      return new ApiResponse(
        StatusCodes.OK,
        "Playing XI deleted successfully",
        playingXI
      ).send(res);
    }
  );
}

export default PlayingXIController;