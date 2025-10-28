import { Request, Response } from 'express';
import { Questions } from '../models';
import { responseError } from '../../utils/helpers';
import { InterrgationEnum } from '../../utils/enums';

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

export { getQuestions };
