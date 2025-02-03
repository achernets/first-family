import { Request, Response } from 'express';
import { Development } from '../models';
import { responseError } from '../../utils/helpers';
import { IDevelopment, QueryParams, RequestById } from '../../types';
const getAllDevelopment = async (req: Request<{}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const data = await Development.find().sort({ order: 1 });
    res.status(200).json(data);
  } catch (error) {
    responseError(res, error);
  }
};

const createDevelopment = async (req: Request<{}, {}, IDevelopment>, res: Response): Promise<void> => {
  try {
    const result = await new Development(req.body).save();
    res.status(201).json(result);
  } catch (error) {
    responseError(res, error);
  }
};

const updateDevelopment = async (req: Request<RequestById, {}, IDevelopment>, res: Response): Promise<void> => {
  try {
    const result = await Development.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).send({
        message: "NOT_FOUND",
        error: {
          id: req.params.id
        }
      });
    }
  } catch (error) {
    responseError(res, error);
  }
};

export { getAllDevelopment, createDevelopment, updateDevelopment };
