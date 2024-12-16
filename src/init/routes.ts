import { Express } from "express";
import { API_PATH } from "../constants/config";
import {
  authRouter,
} from "../mvc/routes";

export default (app: Express) => {
  app.use(API_PATH, authRouter);
};
