import Match from "../model/match.model.js";

class MatchRepository {
  async findAll() {
    // What: fetch all active matches with populated team details.
    // Why: match management screens need team names, logos, etc. alongside match data.
    // How: filter soft-deleted records, populate team refs, sort by start time, and return plain objects.
    return Match.find({ isDeleted: false })
      .populate("team1", "name shortName logo primaryColor")
      .populate("team2", "name shortName logo primaryColor")
      .populate("seriesId", "name shortName")
      .sort({ startTime: 1 })
      .lean();
  }

  async findById(matchId) {
    // What: fetch one active match by id with populated team details.
    // Why: detail/update/delete flows need a precise match lookup with team info.
    // How: query by `_id` and `isDeleted:false`, populate team refs, then return a plain object.
    return Match.findOne({ _id: matchId, isDeleted: false })
      .populate("team1", "name shortName logo primaryColor")
      .populate("team2", "name shortName logo primaryColor")
      .populate("seriesId", "name shortName")
      .lean();
  }

  async create(payload) {
    // What: insert a new match document.
    // Why: repository owns database writes and keeps service code focused on business rules.
    // How: call Mongoose create, then convert the returned document to a plain object.
    const match = await Match.create(payload);

    return match.toObject();
  }

  async updateById(matchId, payload) {
    // What: update an active match document.
    // Why: initial match APIs need partial edits for schedule, venue, status, and result data.
    // How: find by `_id` and `isDeleted:false`, then return the updated document.
    return Match.findOneAndUpdate(
      { _id: matchId, isDeleted: false },
      payload,
      { new: true, runValidators: true },
    ).lean();
  }

  async softDeleteById(matchId) {
    // What: mark a match as deleted without removing it from MongoDB.
    // Why: match history can be important for audits and future score references.
    // How: update `isDeleted:true` and return the deleted match snapshot.
    return Match.findOneAndUpdate(
      { _id: matchId, isDeleted: false },
      { isDeleted: true },
      { new: true },
    ).lean();
  }
}

export default MatchRepository;
