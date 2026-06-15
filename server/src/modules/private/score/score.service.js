import ScoreRepository from "./score.repository.js";
import { Match } from "../shared/models/reference.model.js";
import { BadRequestError, NotFoundError } from "../../shared/errors/index.js";
import { emitToMatch } from "../../shared/socket/emitToMatch.js";
import { logger } from "../../config/logger.js";

class ScoreService {
  constructor(scoreRepository = new ScoreRepository()) {
    this.scoreRepository = scoreRepository;
  }

  async ensureLiveMatch(matchId) {
    const match = await Match.findOne({
      _id: matchId,
      isDeleted: false,
    });

    if (!match) {
      throw new NotFoundError("Match not found or deleted");
    }

    const allowedStatuses = ["LIVE", "INNINGS_BREAK"];

    if (!allowedStatuses.includes(match.status)) {
      throw new BadRequestError(
        `Match is not active (current status: ${match.status})`,
      );
    }

    return match;
  }

  async createScore(scoreData, userId) {
    logger.info({ matchId: scoreData.matchId }, "Creating score");

    await this.ensureLiveMatch(scoreData.matchId);

    const payload = {
      ...scoreData,
      createdBy: userId,
      updatedBy: userId,
    };

    const score = await this.scoreRepository.create(payload);

    emitToMatch(score.matchId.toString(), "score.updated", score);

    return score;
  }

  async updateScore(scoreId, updateData, userId) {
    const score = await this.scoreRepository.findById(scoreId);

    if (!score) {
      throw new NotFoundError("Score not found");
    }

    await this.ensureLiveMatch(score.matchId);

    const payload = {
      ...updateData,
      updatedBy: userId,
    };

    const updatedScore = await this.scoreRepository.updateById(
      scoreId,
      payload,
    );

    emitToMatch(updatedScore.matchId.toString(), "score.updated", updatedScore);

    return updatedScore;
  }

  async getScoresByMatch(matchId) {
    return this.scoreRepository.findByMatchId(matchId);
  }

  async deleteScore(scoreId) {
    const score = await this.scoreRepository.findById(scoreId);

    if (!score) {
      throw new NotFoundError("Score not found");
    }

    return this.scoreRepository.softDelete(scoreId);
  }
}

export default ScoreService;
