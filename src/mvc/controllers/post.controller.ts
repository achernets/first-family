import { Request, Response } from 'express';
import { Post } from '../models';
import { addImg, getUserIdFromToken, responseError } from '../../utils/helpers';
import { IPost, QueryParams } from '../../types';
import { LIMIT } from '../../constants/general';
import mongoose from 'mongoose';

const getAll = async (req: Request<{}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const { limit = LIMIT, page = 1, filters } = req?.query || {};
    const totalPosts = await Post.countDocuments({});
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "likes", // Колекція лайків
          localField: "_id", // Поле у Post, яке відповідає за пост
          foreignField: "postId", // Поле у Likes, яке відповідає за пост
          as: "likes" // Массив лайків для кожного поста
        }
      },
      {
        $lookup: {
          from: "comments", // Колекція коментарів
          localField: "_id", // Поле у Post, яке відповідає за пост
          foreignField: "postId", // Поле у Comments, яке відповідає за пост
          as: "comments" // Массив коментарів для кожного поста
        }
      },
      {
        $lookup: {
          from: "users", // Колекція користувачів (авторів)
          localField: "authorId", // Поле у Post, яке містить авторId
          foreignField: "_id", // Поле у Users, яке відповідає за _id автора
          as: "author" // Повертаємо об'єкт автора в масив author
        }
      },
      {
        $addFields: {
          like: {
            $in: [new mongoose.Types.ObjectId(getUserIdFromToken(req.headers["token"])), "$likes.userId"] // Перевіряємо, чи є userId серед лайків
          },
          likeCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
          author: { $arrayElemAt: ["$author", 0] } // Забираємо перший елемент з масиву авторів
        }
      },
      {
        $project: {
          images: 1,
          description: 1,
          createDate: 1,
          author: {
            _id: 1,
            name: 1,
            surname: 1,
            avatarUrl: 1
          },
          like: 1,
          likeCount: 1,
          commentsCount: 1
        }
      },
      {
        $skip: (page - 1) * Number(limit),
      },
      {
        $limit: Number(limit)
      }
    ]);
    res.status(200).json({
      data: posts,
      count: totalPosts
    });
  } catch (error) {
    responseError(res, error);
  }
};

const create = async (req: Request<{}, {}, IPost>, res: Response): Promise<void> => {
  try {
    let images = [];
    for (let i = 0; i < req.body?.images?.length; i++) {
      let img = await addImg(req.body.images[i]);
      images.push(img);
    }
    const result = await new Post({
      ...req.body,
      authorId: getUserIdFromToken(req.headers["token"]),
      images: [
        //'https://ibb.co/wgsPZBd',
        'https://ibb.co/1GYbLRm',
        'https://ibb.co/Ch6y0BT'
      ],
      description: 'Weekend well spent! Enjoying some tennis time at Sunny Court!'
    }).save();
    res.status(200).json(result);
  } catch (error) {
    responseError(res, error);
  }
};

export { getAll, create };
