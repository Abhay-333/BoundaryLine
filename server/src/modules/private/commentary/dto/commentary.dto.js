/**
 * Commentary DTO
 *
 * Database ka raw object
 * clean format me convert karega
 */
export default class CommentaryDTO {
  constructor(commentary) {
    // Mongo _id ko id bana diya
    this.id = commentary._id;

    // Required fields
    this.matchId = commentary.matchId;

    this.over = commentary.over;

    this.ball = commentary.ball;

    this.text = commentary.text;

    this.type = commentary.type;

    // Enriched ball-event fields
    this.innings = commentary.innings ?? null;

    this.runsScored = commentary.runsScored ?? 0;

    this.extraRuns = commentary.extraRuns ?? 0;

    this.isLegalDelivery = commentary.isLegalDelivery ?? true;

    this.batterId = commentary.batterId ?? null;

    this.bowlerId = commentary.bowlerId ?? null;

    this.nonStrikerId = commentary.nonStrikerId ?? null;

    this.dismissal = commentary.dismissal ?? null;

    // User info
    this.createdBy = commentary.createdBy;

    // Dates
    this.createdAt = commentary.createdAt;
  }
}
