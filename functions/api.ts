import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { MONGODB_URL, PORT, JSON_LIMIT } from '../src/constants/config';
import routes from '../src/init/routes';
import serverless from 'serverless-http';

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: JSON_LIMIT }));
app.use(express.urlencoded({ limit: JSON_LIMIT, extended: true }));
routes(app);

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URL)
    app.listen(PORT, () => console.log(`Server started at port ${PORT}`))
  } catch (e) {
    console.log(e)
  }
};

start();

export default app;
export const handler = serverless(app);
