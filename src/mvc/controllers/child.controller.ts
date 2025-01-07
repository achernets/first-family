import { Request, Response } from 'express';
import { Development, ChildActivity } from '../models';
import { responseError } from '../../utils/helpers';
import { IChildActivity, QueryParams } from '../../types';

const getChildDevelopment = async (req: Request<{
  childId: string
}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const data = await Development.find();
    res.status(200).json(data.map((dev, index) => ({
      developmentId: dev.id,
      value: Math.floor(Math.random() * 101)
    })));
  } catch (error) {
    responseError(res, error);
  }
};

const createChildActivity = async (req: Request<{}, {}, IChildActivity>, res: Response): Promise<void> => {
  try {
    const result = await new ChildActivity(req.body).save();
    res.status(200).json(result);
  } catch (error) {
    responseError(res, error);
    console.log(error)
  }
};

export { getChildDevelopment, createChildActivity };
