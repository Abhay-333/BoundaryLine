import { Commentary } from "./commentary.model.js";

export const create = async (data) => {
  return await Commentary.create(data);
};

export const findAll = async (limit = 50, page = 1) => {
  const skip = (page - 1) * limit;
  return await Commentary.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const findById = async (id) => {
  return await Commentary.findById(id).populate("createdBy");
};

export const findByMatchId = async (matchId, limit = 50, page = 1) => {
  const skip = (page - 1) * limit;
  return await Commentary.find({ matchId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("createdBy");
};

export const deleteById = async (id) => {
  return await Commentary.findByIdAndDelete(id);
};
