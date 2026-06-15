import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";
import SeriesService from "./series.service.js";
import { StatusCodes } from "http-status-codes";

class SeriesController {
  constructor(seriesService = new SeriesService()) {
    this.seriesService = seriesService;
  }

  listSeries = asyncHandler(async (req, res) => {
    const series = await this.seriesService.getSeries();

    return new ApiResponse(
      StatusCodes.OK,
      "Series fetched successfully",
      series
    ).send(res);
  });

  getSeries = asyncHandler(async (req, res) => {
    const series = await this.seriesService.getSeriesById(
      req.validated.params.id
    );

    return new ApiResponse(
      StatusCodes.OK,
      "Series fetched successfully",
      series
    ).send(res);
  });

  createSeries = asyncHandler(async (req, res) => {
    const series = await this.seriesService.createSeries(
      req.validated.body
    );

    return new ApiResponse(
      StatusCodes.CREATED,
      "Series created successfully",
      series
    ).send(res);
  });

  updateSeries = asyncHandler(async (req, res) => {
    const series = await this.seriesService.updateSeries(
      req.validated.params.id,
      req.validated.body
    );

    return new ApiResponse(
      StatusCodes.OK,
      "Series updated successfully",
      series
    ).send(res);
  });

  deleteSeries = asyncHandler(async (req, res) => {
    const series = await this.seriesService.deleteSeries(
      req.validated.params.id
    );

    return new ApiResponse(
      StatusCodes.OK,
      "Series deleted successfully",
      series
    ).send(res);
  });
}

export default SeriesController;