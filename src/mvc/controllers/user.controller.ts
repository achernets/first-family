import { Request, Response } from 'express';
import { User, Children } from '../models';
import { ISignUp, QueryParams, RequestById } from '../../types';
import { genereteToken, responseError, sendMail } from '../../utils/helpers';
import bcrypt from 'bcryptjs';
import { USER_OR_PASSWORD_ERROR } from '../../utils/text';
import { verify } from "jsonwebtoken";
import { SECRET_KEY_JWT } from '../../constants/config';
import { LIMIT } from '../../constants/general';

const signIn = async (req: Request<{}, {}, {
  email: string,
  password: string
}>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: USER_OR_PASSWORD_ERROR });
    } else if (!bcrypt.compareSync(password, user.password)) {
      res.status(400).json({ message: USER_OR_PASSWORD_ERROR });
    } else {
      res.status(200).send({
        token: genereteToken(user.id)
      });
    }
  } catch (error) {
    responseError(res, error);
  }
};

const signUp = async (req: Request<{}, {}, ISignUp>, res: Response): Promise<void> => {
  try {
    const { user, childrens = [] } = req.body;
    const newUser = await new User({
      ...user,
      childrens: [],
    }).save();
    if (childrens.length > 0) {
      for (let i = 0; i < childrens.length; i++) {
        const child = await new Children(childrens[i].children).save();
        newUser.childrens.push({
          children: child.id,
          selected: childrens[i].selected
        })
      };
      newUser.save();
    }
    //await sendMail(req.body.email, 'Створено користувача', `Пароль користувача <strong>${req.body.password}</strong>`);
    res.status(200).send({
      token: genereteToken(newUser.id)
    });
  } catch (error) {
    responseError(res, error);
  }
};

const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers["token"];
    const d = await verify(token, SECRET_KEY_JWT);
    const user = await User.findById(d.userId).populate("childrens.children");
    //user.password = null;
    res.status(200).json(user);
  } catch (error) {
    responseError(res, error);
  }
};

const getAll = async (req: Request<{}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const { limit = LIMIT, page = 1, filters } = req?.query || {};
    const skip = (page - 1) * limit;
    const user = await User.find().skip(skip).limit(limit);
    const count = await User.countDocuments();
    res.status(200).json({
      data: user,
      count: count
    });
  } catch (error) {
    responseError(res, error);
  }
};

const getById = async (req: Request<RequestById>, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    responseError(res, error);
  }
};

const isExistEmail = async (req: Request<{
  email: string
}>, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({
      email: req.params.email
    });
    res.status(200).json(user !== null);
  } catch (error) {
    responseError(res, error);
  }
};

export { signIn, signUp, getMe, getAll, getById, isExistEmail };
