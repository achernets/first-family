import { Request, Response } from 'express';
import { Development } from '../models';
import { responseError } from '../../utils/helpers';
import { QueryParams } from '../../types';

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

export { getChildDevelopment };
