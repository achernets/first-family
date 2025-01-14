import { Request, Response } from 'express';
import { Post, Like, Comment } from '../models';
import { addImg, getUserIdFromToken, responseError } from '../../utils/helpers';
import { IComment, IPost, QueryParams, RequestById } from '../../types';
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
        $sort: {createDate: -1}
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
      images
    }).save();
    res.status(200).json(result);
  } catch (error) {
    responseError(res, error);
  }
};

const postLike = async (req: Request<RequestById>, res: Response): Promise<void> => {
  try {
    const isExist = await Like.findOne({
      postId: req.params.id,
      userId: getUserIdFromToken(req.headers["token"])
    });
    if (isExist === null) {
      const result = await new Like({
        postId: req.params.id,
        userId: getUserIdFromToken(req.headers["token"])
      }).save();
      res.status(200).json(result);
    } else {
      res.status(500).json({
        message: "Post is likes",
        key: "RECORD_IS_EXIST",
        error: [
          {
            message: "Post is likes"
          }
        ]
      });
    }
  } catch (error) {
    responseError(res, error);
  }
};

const postUnLike = async (req: Request<RequestById>, res: Response): Promise<void> => {
  try {
    const result = await Like.findOneAndDelete({
      postId: req.params.id,
      userId: getUserIdFromToken(req.headers["token"])
    });
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

const getAllCommentsByPost = async (req: Request<RequestById, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const { limit = LIMIT, page = 1, filters } = req?.query || {};
    const { id } = req?.params;
    const result = await Comment.aggregate(
      [
        { $match: { postId: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: "likes", // Колекція лайків
            localField: "_id", // Поле у Post, яке відповідає за пост
            foreignField: "commentId", // Поле у Likes, яке відповідає за пост
            as: "likes" // Массив лайків для кожного поста
          }
        },
        {
          $lookup: {
            from: "users", // Колекція користувачів (авторів)
            localField: "userId", // Поле у Post, яке містить авторId
            foreignField: "_id", // Поле у Users, яке відповідає за _id автора
            as: "user" // Повертаємо об'єкт автора в масив author
          }
        },
        {
          $addFields: {
            like: {
              $in: [new mongoose.Types.ObjectId(getUserIdFromToken(req.headers["token"])), "$likes.userId"] // Перевіряємо, чи є userId серед лайків
            },
            user: { $arrayElemAt: ["$user", 0] } // Забираємо перший елемент з масиву авторів
          }
        },
        {
          $project: {
            postId: 1,
            comment: 1,
            createDate: 1,
            user: {
              _id: 1,
              name: 1,
              surname: 1,
              avatarUrl: 1
            },
            like: 1
          }
        },
        {
          $sort: {createDate: -1}
        },
        {
          $skip: (page - 1) * Number(limit),
        },
        {
          $limit: Number(limit)
        }
      ]);
    res.status(200).json(result);
  } catch (error) {
    responseError(res, error);
  }
};


const commentLike = async (req: Request<RequestById>, res: Response): Promise<void> => {
  try {
    const isExist = await Like.findOne({
      commentId: req.params.id,
      userId: getUserIdFromToken(req.headers["token"])
    });
    if (isExist === null) {
      const result = await new Like({
        commentId: req.params.id,
        userId: getUserIdFromToken(req.headers["token"])
      }).save();
      res.status(200).json(result);
    } else {
      res.status(500).json({
        message: "Comment is likes",
        key: "RECORD_IS_EXIST",
        error: [
          {
            message: "Comment is likes"
          }
        ]
      });
    }
  } catch (error) {
    responseError(res, error);
  }
};

const commentUnLike = async (req: Request<RequestById>, res: Response): Promise<void> => {
  try {
    const result = await Like.findOneAndDelete({
      commentId: req.params.id,
      userId: getUserIdFromToken(req.headers["token"])
    });
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

const createComment = async (req: Request<RequestById, {}, IComment>, res: Response): Promise<void> => {
  try {
    const result = await new Comment({
      ...req.body,
      userId: getUserIdFromToken(req.headers["token"]),
    }).save();
    const comment = await Comment.aggregate(
      [
        { $match: { _id: result._id } },
        {
          $lookup: {
            from: "likes", // Колекція лайків
            localField: "_id", // Поле у Post, яке відповідає за пост
            foreignField: "commentId", // Поле у Likes, яке відповідає за пост
            as: "likes" // Массив лайків для кожного поста
          }
        },
        {
          $lookup: {
            from: "users", // Колекція користувачів (авторів)
            localField: "userId", // Поле у Post, яке містить авторId
            foreignField: "_id", // Поле у Users, яке відповідає за _id автора
            as: "user" // Повертаємо об'єкт автора в масив author
          }
        },
        {
          $addFields: {
            like: {
              $in: [new mongoose.Types.ObjectId(getUserIdFromToken(req.headers["token"])), "$likes.userId"] // Перевіряємо, чи є userId серед лайків
            },
            user: { $arrayElemAt: ["$user", 0] } // Забираємо перший елемент з масиву авторів
          }
        },
        {
          $project: {
            postId: 1,
            comment: 1,
            createDate: 1,
            user: {
              _id: 1,
              name: 1,
              surname: 1,
              avatarUrl: 1
            },
            like: 1
          }
        }
      ]);
    res.status(200).json(comment);
  } catch (error) {
    responseError(res, error);
  }
};


export {
  getAll, create, postLike, postUnLike,
  getAllCommentsByPost, createComment, commentLike, commentUnLike
};
