import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";
import CommentaryService from "../../private/commentary/commentary.service.js";

class PublicCommentaryController {
  constructor(commentaryService = new CommentaryService()) {
    this.commentaryService = commentaryService;
  }

  getCommentaryByMatch = asyncHandler(async (req, res) => {
    const { matchId } = req.validated ? req.validated.params : req.params;
    const page = req.validated?.query?.page || req.query.page || 1;
    const limit = req.validated?.query?.limit || req.query.limit || 50;

    if (!matchId) {
      return res.status(400).json({ success: false, message: "matchId is required" });
    }

    const commentaries = await this.commentaryService.getCommentaryByMatch(
      matchId,
      Number(limit),
      Number(page),
    );

    return new ApiResponse(200, "Commentary fetched successfully", {
      commentaries,
      page: Number(page),
      limit: Number(limit),
    }).send(res);
  });
}

export default PublicCommentaryController;
