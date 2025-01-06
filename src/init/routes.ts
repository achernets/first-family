import { Express } from "express";
import { API_PATH } from "../constants/config";
import {
  authRouter,
  developmentRouter,
  recommendationRouter,
  categoryRouter,
  tipsRouter,
  offersRouter,
  childRouter
} from "../mvc/routes";

export default (app: Express) => {
  app.use(API_PATH, authRouter);
  app.use(API_PATH, developmentRouter);
  app.use(API_PATH, recommendationRouter);
  app.use(API_PATH, categoryRouter);
  app.use(API_PATH, tipsRouter);
  app.use(API_PATH, offersRouter);
  app.use(API_PATH, childRouter);
};
