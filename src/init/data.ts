import { ChildActivity, Development, User } from '../../src/mvc/models';
import { DevelopmentType, StatusChildActivityEnum } from '../../src/utils/enums';

const addInitalData = async () => {
  try {
    const DevelopmentData = [
      {
        "name": "Physical",
        "description": "According to the current development phase, choose activities that support your child’s holistic progress.",
        "type": DevelopmentType.PHYSICAL,
        "order": 0
      },
      {
        "name": "Cognitive",
        "description": "According to the current development phase, choose activities that support your child’s holistic progress.",
        "type": DevelopmentType.COGNITIVE,
        "order": 1
      },
      {
        "name": "Mental",
        "description": "According to the current development phase, choose activities that support your child’s holistic progress.",
        "type": DevelopmentType.MENTAL,
        "order": 2
      }
    ]
    for (let index = 0; index < DevelopmentData.length; index++) {
      const element = DevelopmentData[index];
      const s = await Development.findOneAndUpdate(
        {
          type: element.type
        },
        {
          $set: element
        },
        { upsert: true, new: true, runValidators: true }
      );
    }

    await ChildActivity.updateMany(
      { status: { $exists: false } }, // Тільки документи без поля status
      {
        $set: {
          status: StatusChildActivityEnum.COMPLETE
        }
      }
    );

    // Отримати активності без authorId
    const activities = await ChildActivity.find({
      $or: [
        { authorId: { $exists: false } },
        { authorId: null }
      ]
    });

    if (activities.length > 0) {
      // Створити мапу childId -> userId
      const users = await User.find({ childrens: { $exists: true } });

      const childToUserMap = new Map();

      users.forEach(user => {
        user.childrens.forEach(el => {
          childToUserMap.set(el.children.toString(), user._id);
        });
      });

      // Підготувати bulk операції
      const bulkOps = [];

      activities.forEach(activity => {
        const authorId = childToUserMap.get(activity.childId.toString());
        if (authorId) {
          bulkOps.push({
            updateOne: {
              filter: { _id: activity._id },
              update: { $set: { authorId: authorId } }
            }
          });
        }
      });

      // Виконати bulk update
      if (bulkOps.length > 0) {
        const result = await ChildActivity.bulkWrite(bulkOps);
        console.log(`Updated ${result.modifiedCount} records`);
      }
    }

  } catch (error) {

  }
}

export default addInitalData;
