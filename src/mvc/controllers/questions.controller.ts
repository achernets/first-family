import { Request, Response } from 'express';
import { Interrgation, Questions, User } from '../models';
import { getUserIdFromToken, responseError } from '../../utils/helpers';
import { InterrgationEnum, InterrgationStatusEnum } from '../../utils/enums';
import { IQuestions } from '../../types';

const getQuestions = async (req: Request<{}, {}, {}, {
  type: string
  countQuestions?: number
}>, res: Response): Promise<void> => {
  const { type = InterrgationEnum.WEEK, countQuestions } = req.query;
  try {
    const data = await Questions.aggregate([
      { $match: { type } },
      {
        $group: {
          _id: "$groupId",
          questions: { $push: "$$ROOT" }
        }
      },
      { $sort: { _id: 1 } },
      {
        $lookup: {
          from: "questionsgroups",
          localField: "_id",
          foreignField: "_id",
          as: "groupInfo"
        }
      },
      {
        $unwind: "$groupInfo"
      },
      {
        $project: {
          groupId: "$_id",
          groupName: "$groupInfo.name",
          questions: 1
        }
      }
    ]);
    const newData = data.flatMap(group => {
      if (countQuestions === undefined) {
        return {
          _id: group.groupId,
          groupName: group.groupName,
          questions: group.questions.sort(() => 0.5 - Math.random())
        };
      }
      const shuffledQuestions = group.questions.sort(() => 0.5 - Math.random()).slice(0, countQuestions);
      return {
        _id: group.groupId,
        groupName: group.groupName,
        questions: shuffledQuestions
      };
    });
    res.status(200).json(newData);
  } catch (error) {
    responseError(res, error);
  }
};

const finishInterrgation = async (req: Request<{}, {}, {
  type: InterrgationEnum,
  status: InterrgationStatusEnum,
  questions?: IQuestions[]
}>, res: Response): Promise<void> => {
  try {
    const { type, status, questions = [] } = req.body;
    const userId = getUserIdFromToken(req.headers["token"]);

    await new Interrgation({
      userId,
      type,
      status,
      questions,
      createDate: Date.now()
    }).save();

    const update: any = { nextInterrogation: null };
    if (type === InterrgationEnum.WEEK) {
      update.lastWeeklyInterrogation = Date.now();
    } else if (type === InterrgationEnum.MONTH) {
      update.lastMonthlyInterrogation = Date.now();
    }

    await User.findByIdAndUpdate(userId, { $set: update });

    res.status(200).json(true);
  } catch (error) {
    responseError(res, error);
  }
};

export { getQuestions, finishInterrgation };
