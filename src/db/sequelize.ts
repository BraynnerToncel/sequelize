import { Sequelize } from "sequelize-typescript";
import { Post, User } from "./schema";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  models: [User, Post],
});