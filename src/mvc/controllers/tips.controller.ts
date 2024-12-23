import { Request, Response } from 'express';
import { addImg, responseError } from '../../utils/helpers';
import { ITips, QueryParams, RequestById } from '../../types';
import { LIMIT } from '../../constants/general';
import { Tips } from '../models'
import { uploadImage } from '../../utils/images';
import isBase64 from 'is-base64';

const getAll = async (req: Request<{}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const { limit = LIMIT, page = 1, filters } = req?.query || {};
    const skip = (page - 1) * limit;
    const data = await Tips.find().skip(skip).limit(limit);
    const count = await Tips.countDocuments();
    res.status(200).json({
      data,
      count
    });
  } catch (error) {
    responseError(res, error);
  }
};

const create = async (req: Request<{}, {}, ITips>, res: Response): Promise<void> => {
  try {
    const img = await addImg(req.body?.img);
    const result = await new Tips({
      ...req.body,
      img
    }).save();
    res.status(200).json(result);
  } catch (error) {
    responseError(res, error);
  }
};

const update = async (req: Request<RequestById, {}, ITips>, res: Response): Promise<void> => {
  try {
    const img = await addImg(req.body?.img);
    const result = await Tips.findByIdAndUpdate(req.params.id, {
      ...req.body,
      img: img
    }, { new: true });
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
    const result = await Tips.findByIdAndDelete(req.params.id);
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
