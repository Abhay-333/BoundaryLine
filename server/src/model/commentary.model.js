import mongoose from "mongoose";

const dismissalSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [null, "BOWLED", "CAUGHT", "LBW", "RUN_OUT", "STUMPED", "HIT_WICKET", "RETIRED_HURT"],
      default: null,
    },
    playerOutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      default: null,
    },
    fielderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      default: null,
    },
    bowlerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      default: null,
    },
  },
  { _id: false }
);

const commentarySchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    over: {
      type: Number,
      required: true,
      min: 0,
    },
    ball: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["NORMAL", "FOUR", "SIX", "WICKET", "MILESTONE"],
      default: "NORMAL",
    },
    // --- Enriched ball-event fields (Phase 1) ---
    // These allow the backend to store structured ball-by-ball data
    // so the frontend Scoreboard can reconstruct scorecards from Commentary alone.
    innings: {
      type: Number,
      min: 1,
      max: 2,
      default: null,
    },
    runsScored: {
      type: Number,
      default: 0,
      min: 0,
    },
    extraRuns: {
      type: Number,
      default: 0,
      min: 0,
    },
    isLegalDelivery: {
      type: Boolean,
      default: true,
    },
    batterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      default: null,
    },
    bowlerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      default: null,
    },
    nonStrikerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      default: null,
    },
    dismissal: {
      type: dismissalSchema,
      default: null,
    },
    // ---
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

commentarySchema.index({ matchId: 1, createdAt: -1 });

export const Commentary =
  mongoose.models.Commentary || mongoose.model("Commentary", commentarySchema);
