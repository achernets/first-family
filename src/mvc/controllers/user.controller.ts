import { Request, Response } from 'express';
import { User, Children } from '../models';
import { ISignUp, IUser, QueryParams, RequestById } from '../../types';
import { addImg, genereteToken, responseError, sendMail } from '../../utils/helpers';
import bcrypt from 'bcryptjs';
import { USER_OR_PASSWORD_ERROR } from '../../utils/text';
import { verify } from "jsonwebtoken";
import { SECRET_KEY_JWT } from '../../constants/config';
import { LIMIT } from '../../constants/general';
import generator from 'generate-password';

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
    const password = generator.generate({
      length: 8,
      numbers: true
    });
    const newUser = await new User({
      ...user,
      childrens: [],
      password: password
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
    await sendMail(user.email, 'Створено користувача', `Пароль користувача <strong>${password}</strong>`);
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
    delete user.password;
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

const userUpdate = async (req: Request<RequestById, {}, IUser>, res: Response): Promise<void> => {
  try {
    let obj = req.body;
    if (req.body.avatarUrl && req.body.avatarUrl !== null) {
      obj.avatarUrl = await addImg(req.body.avatarUrl);
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: obj
    }, { upsert: true, new: true });
    delete user.password;
    res.status(200).json(user);
  } catch (error) {
    responseError(res, error);
  }
};

const changePassword = async (req: Request<RequestById, {}, {
  oldPassword: string,
  password: string
}>, res: Response): Promise<void> => {
  try {
    const { oldPassword, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!bcrypt.compareSync(oldPassword, user.password)) {
      res.status(400).json({ message: 'Old password wrong' });
    } else {
      await User.findByIdAndUpdate(req.params.id, {
        $set: {
          password: password
        }
      }, { upsert: true, new: true });
      res.status(200).json(true);
    }
  } catch (error) {
    responseError(res, error);
  }
};

const resetPassword = async (req: Request<{}, {}, {
  email: string,
}>, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      const password = generator.generate({
        length: 8,
        numbers: true
      });
      await User.findByIdAndUpdate(user.id, {
        $set: {
          password: password
        }
      }, { upsert: true, new: true });
      await sendMail(user.email, 'Password reset', `New password <strong>${password}</strong>`);
      res.status(200).json(true);
    } else {
      res.status(200).json(false);
    }
  } catch (error) {
    responseError(res, error);
  }
};

export { signIn, signUp, getMe, getAll, getById, isExistEmail, userUpdate, changePassword, resetPassword };
// $2a$05$uHyYnz9P0f17NO/Q8hkiNOkb/zL8KTyjy0b3Me84kYd0J9.4LF/Ca