import { UsersDto } from "../../users/users.dto";

import express from "express";

export interface RequestUser extends express.Request {
  user?: UsersDto;
  userExist?: boolean;
}
