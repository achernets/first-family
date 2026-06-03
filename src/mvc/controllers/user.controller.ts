import { Request, Response } from 'express';
import { User, Children, ChildActivity, Post, Comment, Like, Interrgation } from '../models';
import { IOnBoardPoll, ISignUp, IUser, QueryParams, RequestById } from '../../types';
import { addImg, genereteToken, getUserIdFromToken, responseError, sendMail } from '../../utils/helpers';
import bcrypt from 'bcryptjs';
import { USER_OR_PASSWORD_ERROR } from '../../utils/text';
import { verify } from "jsonwebtoken";
import { SECRET_KEY_JWT } from '../../constants/config';
import { LIMIT } from '../../constants/general';
import generator from 'generate-password';
import OnBoardPoll from '../../mvc/models/onboardPoll.model';
import { UserType } from '../../utils/enums';

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
      createDate: Date.now(),
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
      newUser.password = password;
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

const signInGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = new User({
      name: 'Guest',
      surname: 'Guest',
      sex: null,
      reward: 0,
      birthdate: null,
      email: '',
      type: UserType.GUEST,
      createDate: Date.now(),
      childrens: []
    });

    const child = await new Children({
      name: 'Child 1',
      surname: 'Guest',
      birthdate: null,
      sex: null,
      createDate: Date.now()
    }).save();
    user.childrens.push({
      children: child.id,
      selected: true
    });
    delete user.password;
    await user.save();

    res.status(200).send({
      token: genereteToken(user.id)
    });
  } catch (error) {
    responseError(res, error);
  }
}

const guestToUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const token = req.headers["token"];
    const d = await verify(token, SECRET_KEY_JWT);
    const user = await User.findById(d.userId);
    if (user.type !== UserType.GUEST) {
      res.status(400).json({ message: 'User is not a guest' });
      return;
    }
    const isExist = await User.findOne({ email });
    if (isExist) {
      res.status(400).json({ message: 'User is already exists' });
      return;
    }
    const newUser = await User.findByIdAndUpdate(user.id, {
      $set: {
        email: email,
        password: password,
        type: UserType.USER
      }
    }, { upsert: true, new: true }).populate("childrens.children");
    delete newUser.password;
    res.status(200).json(newUser);
  } catch (error) {
    responseError(res, error);
  }
}

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

const getMeActivityChilds = async (req: Request<{}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const token = req.headers["token"];
    const d = await verify(token, SECRET_KEY_JWT);
    const user = await User.findById(d.userId);
    const childIds = user.childrens?.reduce((acc, curr) => {
      acc.push(curr.children.toString());
      return acc;
    }, []);
    const { limit = LIMIT, page = 1, filters } = req?.query || {};
    const skip = (page - 1) * limit;
    const activities = await ChildActivity.find({
      childId: { $in: childIds }
    }).skip(skip).limit(limit).sort({ createDate: -1 }).populate('childId', 'id, name').populate('activityId', 'id, name').populate('authorId');
    const count = await ChildActivity.countDocuments({
      childId: { $in: childIds }
    });
    res.status(200).json({
      data: activities,
      count
    });
  } catch (error) {
    console.log(error);
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

const onBoardPollHandler = async (req: Request<{}, {}, IOnBoardPoll>, res: Response): Promise<void> => {
  try {
    const result = await new OnBoardPoll({
      ...req.body,
      userId: getUserIdFromToken(req.headers["token"]),
    }).save();
    res.status(200).json(result);
  } catch (error) {
    responseError(res, error);
  }
};

const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers["token"];
    const d = await verify(token, SECRET_KEY_JWT);
    const userId = d.userId;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Collect child IDs belonging to this user
    const childIds = user.childrens?.map(c => c.children) || [];

    // Delete all related data in parallel
    await Promise.all([
      // Children & their activities
      Children.deleteMany({ _id: { $in: childIds } }),
      ChildActivity.deleteMany({ authorId: userId }),
      // Posts, comments, likes
      Post.deleteMany({ authorId: userId }),
      Comment.deleteMany({ userId: userId }),
      Like.deleteMany({ userId: userId }),
      // Polls & interrogations
      OnBoardPoll.deleteMany({ userId: userId }),
      Interrgation.deleteMany({ userId: userId }),
    ]);

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    responseError(res, error);
  }
};

export { signIn, signUp, signInGuest, guestToUser, getMe, getAll, getById, isExistEmail, userUpdate, changePassword, resetPassword, onBoardPollHandler, getMeActivityChilds, deleteAccount };