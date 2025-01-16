import { Request, Response } from 'express';
import { Development, ChildActivity, Children } from '../models';
import { responseError } from '../../utils/helpers';
import { IChildActivity, QueryParams } from '../../types';
import moment from 'moment';
import { groupBy, keys, reduce, sumBy } from 'lodash';

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
    let allSumm = keys(groups).map(key=>{
      let group = groups[key];
      return reduce(group, (hash, itm) => {
        for(let i = 0; i<data.length; i++){
          if(hash[data[i].id] === undefined) hash[data[i].id] = 0;
          hash[data[i].id] += itm.activityId.developments[data[i].id];
          if(hash[data[i].id] > 100) {
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
    res.status(200).json(result);
  } catch (error) {
    responseError(res, error);
    console.log(error)
  }
};

export { getChildDevelopment, createChildActivity };
