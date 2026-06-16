import { StatusCodes } from "http-status-codes";

import PrivateUserService from "./user.service.js";

import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

export default class PrivateUserController {
  constructor(
    userService = new PrivateUserService()
  ) {
    this.userService = userService;
  }

  getCurrentUser = asyncHandler(
    async (req, res) => {
      const user =
        await this.userService.getUserById(
          req.user._id
        );

      return new ApiResponse(
        StatusCodes.OK,
        "Current user fetched successfully",
        user
      ).send(res);
    }
  );

  listUsers = asyncHandler(async (_req, res) => {
    const users =
      await this.userService.getUsers();

    return new ApiResponse(
      StatusCodes.OK,
      "Users fetched successfully",
      users
    ).send(res);
  });

  updateCurrentUser = asyncHandler(
    async (req, res) => {
      const user =
        await this.userService.updateUser(
          req.user._id,
          req.validated?.body || req.body
        );

      return new ApiResponse(
        StatusCodes.OK,
        "User updated successfully",
        user
      ).send(res);
    }
  );

  deleteUser = asyncHandler(async (req, res) => {
    const user =
      await this.userService.deleteUser(
        req.params.id
      );

      return new ApiResponse(
        StatusCodes.OK,
        "User deleted successfully",
        user
      ).send(res);
  });
}