import { Request, Response } from 'express';
import { Category } from '../models';
import { addImg, responseError } from '../../utils/helpers';
import { ICategory, QueryParams, RequestById } from '../../types';
import { LIMIT } from '../../constants/general';

const getAllCategories = async (req: Request<{}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const { limit = LIMIT, page = 1, filters } = req?.query || {};
    const skip = (page - 1) * limit;
    const data = await Category.find().skip(skip).limit(limit).populate('development');
    const count = await Category.countDocuments();
    res.status(200).json({
      data,
      count
    });
  } catch (error) {
    responseError(res, error);
  }
};

const createCategory = async (req: Request<{}, {}, ICategory>, res: Response): Promise<void> => {
  try {
    const image = await addImg(req.body.image);
    const result = await new Category({
      ...req.body,
      image: image
    }).save();
    res.status(200).json(result);
  } catch (error) {
    responseError(res, error);
  }
};

const updateCategory = async (req: Request<RequestById, {}, ICategory>, res: Response): Promise<void> => {
  try {
    const image = await addImg(req.body.image);
    const result = await Category.findByIdAndUpdate(req.params.id, {
      ...req.body,
      image: image
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
const deleteCategory = async (req: Request<RequestById>, res: Response): Promise<void> => {
  try {
    const result = await Category.findByIdAndDelete(req.params.id);
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

export { getAllCategories, createCategory, updateCategory, deleteCategory };
