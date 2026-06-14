import commentaryService from "./commentary.service.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import express from "express";
import { success } from "zod";
import data from "../../config/env.js";

export default class CommentaryController {
  constructor() {
    this.commentaryService = commentaryService();
  }
  /**
   * new commentary create karega
   * Endpotin : POST /commentary
   */
  addCommentary = asyncHandler(async (req, res) => {
    const commentaryData = req.validated ? req.validated.body : req.body;

    const userId = req.user ? req.user._id : null;

    const commentary = await this.commentaryService.addCommentary(
      commentaryData,
      userId,
    );

    return res.status(201).json({
      success: true,
      mesage: "Commmentary added successfully",
      data: commentary,
    });
  });
}
