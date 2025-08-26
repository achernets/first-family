import { Request, Response } from 'express';
import { Development, ChildActivity, Children, User, Category } from '../models';
import { calculateAge, getUserIdFromToken, responseError } from '../../utils/helpers';
import { IChildActivity, IChildren, QueryParams } from '../../types';
import moment from 'moment';
import { groupBy, keys, reduce, sumBy } from 'lodash';
import anthropic from '../../utils/ai';

const getChildDevelopment = async (req: Request<{
  id: string
}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const data = await Development.find();
    const child = await Children.findById(req.params.id);
    const activity = await ChildActivity.find({
      childId: child._id,
      createDate: { $gte: moment().startOf('day').subtract(6, 'day').valueOf() }
    }).populate('activityId', 'developments');
    const days = moment().startOf('d').diff(moment(child.createDate).startOf('day'), 'days');
    const groups = groupBy(activity, itm => moment(itm.createDate).startOf('day').valueOf());
    let allSumm = keys(groups).map(key => {
      let group = groups[key];
      return reduce(group, (hash, itm) => {
        for (let i = 0; i < data.length; i++) {
          if (hash[data[i].id] === undefined) hash[data[i].id] = 0;
          hash[data[i].id] += itm.activityId.developments[data[i].id];
          if (hash[data[i].id] > 100) {
            hash[data[i].id] = 100;
            continue;
          }
        }
        return hash;
      }, {});
    });
    res.status(200).json(data.map((dev, index) => ({
      developmentId: dev.id,
      value: Math.ceil(sumBy(allSumm, data[index].id) / (days < 7 ? days : 7))
    })));
  } catch (error) {
    responseError(res, error);
  }
};

const createChildActivity = async (req: Request<{}, {}, IChildActivity>, res: Response): Promise<void> => {
  try {
    const result = await new ChildActivity(req.body).save();
    const user = await User.findById(getUserIdFromToken(req.headers["token"]));
    const activity = await Category.findById(req.body.activityId);
    await User.findByIdAndUpdate(user.id, {
      $set: {
        reward: activity.reward + user.reward
      }
    });
    res.status(200).json(result);
  } catch (error) {
    responseError(res, error);
    console.log(error)
  }
};

const createUpdateChilds = async (req: Request<{
  id: string
}, {}, {
  members: {
    children: IChildren,
    selected: Boolean
  }[]
}>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { members } = req.body;
    let newChilds = [];
    for (let i = 0; i < members.length; i++) {
      let id = null;
      if (members[i].children._id) {
        const child = await Children.findByIdAndUpdate(members[i].children._id, {
          $set: members[i].children
        });
        id = child._id
      } else {
        const child = await new Children(members[i].children).save();
        id = child._id
      }
      newChilds.push({
        children: id,
        selected: members[i].selected
      });
    }
    await User.findByIdAndUpdate(id, {
      $set: {
        childrens: newChilds
      }
    });
    res.status(200).json(true);
  } catch (error) {
    responseError(res, error);
  }
};

const getRecommendationActivity = async (req: Request<{
  id: string
}, {}, {}, QueryParams>, res: Response): Promise<void> => {
  try {
    const child = await Children.findById(req.params.id);
    const lastChildActivitys = await ChildActivity.find({
      childId: child._id,
      createDate: { $gte: moment().startOf('day').subtract(7, 'day').valueOf() }
    }).populate('activityId');
    const allActivities = await Category.find();
    const lastChildActivitysPromt = lastChildActivitys.map(itm => ({
      //@ts-ignore
      "id": itm?.activityId?.id,
      //@ts-ignore
      "name": itm?.activityId?.name,
      //@ts-ignore
      "description": itm?.activityId?.descriptionShort,
      "duration": "45 minutes"
    }));

    const prompt = `
    Analyze the activities of a ${calculateAge(child.birthdate).formatted} old child for the week and provide recommendations.

    Weekly activities: ${JSON.stringify(lastChildActivitysPromt)}
    Available activities for recommendations: ${JSON.stringify(allActivities.map(itm => ({
      "id": itm?.id,
      "name": itm?.name,
      "description": itm?.descriptionShort,
      "duration": "45 minutes"
    })))}

    Please provide 3 recommendations with multiple activities for each recommendation when possible.

    Return the result ONLY in JSON format with this structure:

    {
      "analysis": {
        "summary": "text",
        "total_time": "text"
      },
      "recommendations": [
        {
          "text": "text_recommendation",
          "activities": [
            {
              "id": "activity_id",
              "name": "activity_name",
              "description": ""activity_description"
            }
          ]
        }
      ]
    }

    IMPORTANT: Return ONLY valid JSON without markdown formatting, without \`\`\`json blocks.
    `;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });
    //@ts-ignore
    const jsonResponse = JSON.parse(message.content[0].text);
    res.json(jsonResponse);
  } catch (error) {
    console.log(error)
    responseError(res, error);
  }

}

export { getChildDevelopment, createChildActivity, createUpdateChilds, getRecommendationActivity };
