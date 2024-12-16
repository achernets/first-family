import { Request, Response } from 'express';
import { User, Children } from '../models';
import { IUser } from '../../types';
import { genereteToken, responseError, sendMail } from '../../utils/helpers';
import bcrypt from 'bcryptjs';
import { USER_OR_PASSWORD_ERROR } from '../../utils/text';

const signIn = async (req: Request<{}, {}, IUser>, res: Response): Promise<void> => {
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

const signUp = async (req: Request<{}, {}, IUser>, res: Response): Promise<void> => {
  try {
    const { childrens = [] } = req.body;
    const user = await new User({
      ...req.body,
      childrens: []
    }).save();
    if (childrens.length > 0) {
      for (let i = 0; i < childrens.length; i++) {
        const child = await new Children(childrens[i].children).save();
        user.childrens.push({
          children: child.id,
          selected: childrens[i].selected
        })
      };
      user.save();
    }
    await sendMail(req.body.email, 'Створено користувача', `Пароль користувача <strong>${req.body.password}</strong>`);
    res.status(200).send({
      token: genereteToken(user.id)
    });
  } catch (error) {
    responseError(res, error);
  }
};

export { signIn, signUp };
