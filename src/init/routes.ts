import { Express } from "express";
import { API_PATH } from "../constants/config";
import {
  authRouter,
  developmentRouter,
  recommendationRouter,
  categoryRouter
} from "../mvc/routes";

export default (app: Express) => {
  app.use(API_PATH, authRouter);
  app.use(API_PATH, developmentRouter);
  app.use(API_PATH, recommendationRouter);
  app.use(API_PATH, categoryRouter);
};
