import { Request, Response } from 'express';
import { responseError } from '../../utils/helpers';
import { IOffers, QueryParams, RequestById } from '../../types';
import { LIMIT } from '../../constants/general';
import { Offers } from '../models'

const getAll = async (req: Request<{}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const { limit = LIMIT, page = 1, filters } = req?.query || {};
    const skip = (page - 1) * limit;
    const data = await Offers.find().skip(skip).limit(limit);
    const count = await Offers.countDocuments();
    res.status(200).json({
      data,
      count
    });
  } catch (error) {
    responseError(res, error);
  }
};

const create = async (req: Request<{}, {}, IOffers>, res: Response): Promise<void> => {
  try {
    const result = await new Offers(req.body).save();
    res.status(200).json(result);
  } catch (error) {
    responseError(res, error);
  }
};

const update = async (req: Request<RequestById, {}, IOffers>, res: Response): Promise<void> => {
  try {
    const result = await Offers.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
const remove = async (req: Request<RequestById>, res: Response): Promise<void> => {
  try {
    const result = await Offers.findByIdAndDelete(req.params.id);
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

export { getAll, create, update, remove };