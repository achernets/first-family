import { Request, Response } from 'express';
import { addImg, getUserIdFromToken, responseError } from '../../utils/helpers';
import { ITips, QueryParams, RequestById } from '../../types';
import { LIMIT } from '../../constants/general';
import { Tips, User, Viewer } from '../models'
import mongoose from 'mongoose';

const getAll = async (req: Request<{}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const { limit = LIMIT, page = 1, filters } = req?.query || {};
    const count = await Tips.countDocuments();
    const data = await Tips.aggregate([
      {
        $lookup: {
          from: "viewers", // Колекція лайків
          localField: "_id", // Поле у Post, яке відповідає за пост
          foreignField: "tipsId", // Поле у Likes, яке відповідає за пост
          as: "viewers" // Массив лайків для кожного поста
        }
      },
      {
        $addFields: {
          viewed: {
            $in: [new mongoose.Types.ObjectId(getUserIdFromToken(req.headers["token"])), "$viewers.userId"] // Перевіряємо, чи є userId серед лайків
          }
        }
      },
      {
        $project: {
          name: 1,
          description: 1,
          duration: 1,
          reward: 1,
          type: 1,
          urlVideo: 1,
          backgroundColor: 1,
          createDate: 1,
          viewed: 1,
          img: 1,
          
        }
      },
      {
        $sort: { createDate: -1 }
      },
      {
        $skip: (page - 1) * Number(limit),
      },
      {
        $limit: Number(limit)
      }
    ]);
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

const markAsView = async (req: Request<RequestById>, res: Response): Promise<void> => {
  try {
    const userId = getUserIdFromToken(req.headers["token"]);
    const isExist = await Viewer.findOne({
      tipsId: req.params.id,
      userId: userId
    });
    if (isExist === null) {
      const result = await new Viewer({
        tipsId: req.params.id,
        userId: userId
      }).save();
      const tips = await Tips.findById(req.params.id);
      const user = await User.findById(userId);
      await User.findByIdAndUpdate(userId, {
        $set: {
          reward: tips.reward + user.reward
        }
      });
      res.status(200).json(result);
    } else {
      res.status(500).json({
        message: "Tips is viewer",
        key: "RECORD_IS_EXIST",
        error: [
          {
            message: "Tips is viewer"
          }
        ]
      });
    }
  } catch (error) {
    responseError(res, error);
  }
};

export { getAll, create, update, remove, markAsView };
