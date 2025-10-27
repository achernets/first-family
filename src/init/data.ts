import { ChildActivity, Development, User, Questions, QuestionsGroup } from '../../src/mvc/models';
import { DevelopmentType, InterrgationEnum, StatusChildActivityEnum } from '../../src/utils/enums';

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
      await Development.findOneAndUpdate(
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

    const questionGroup = [
      {
        _id: "648f1f4f5f4c2a6b1c8e4a01",
        name: "Emotional Balance"
      },
      {
        _id: "648f1f4f5f4c2a6b1c8e4a02",
        name: "Attention & Focus"
      },
      {
        _id: "648f1f4f5f4c2a6b1c8e4a03",
        name: "Behavior & Self-Control"
      },
      {
        _id: "648f1f4f5f4c2a6b1c8e4a04",
        name: "Peer & Family Connection"
      },
      {
        _id: "648f1f4f5f4c2a6b1c8e4a05",
        name: "Prosocial Strengths"
      },
      {
        _id: "648f1f4f5f4c2a6b1c8e4a06",
        name: "Attention & Executive Control"
      },
      {
        _id: "648f1f4f5f4c2a6b1c8e4a07",
        name: "Behavior & Self-Regulation"
      }
    ];

    await Promise.all(questionGroup.map(group =>
      QuestionsGroup.updateOne({ _id: group._id }, { $set: group }, { upsert: true })
    ));

    const questionsWeek = [
      {
        description: "My child seems unhappy or sad",
        reverse: false,
        type: InterrgationEnum.WEEK,
        groupId: "648f1f4f5f4c2a6b1c8e4a01",
        answer: 0
      },
      {
        description: "Shows a mostly upbeat mood during the day",
        reverse: false,
        type: InterrgationEnum.WEEK,
        groupId: "648f1f4f5f4c2a6b1c8e4a01",
        answer: 0
      },
      {
        description: "Bounces back after disappointments or changes",
        reverse: false,
        type: InterrgationEnum.WEEK,
        groupId: "648f1f4f5f4c2a6b1c8e4a01",
        answer: 0
      },
      {
        description: "Can stay with an activity that matches their age for a reasonable time",
        reverse: false,
        type: InterrgationEnum.WEEK,
        groupId: "648f1f4f5f4c2a6b1c8e4a02",
        answer: 0
      },
      {
        description: "Follows simple steps or instructions without getting lost",
        reverse: false,
        type: InterrgationEnum.WEEK,
        groupId: "648f1f4f5f4c2a6b1c8e4a02",
        answer: 0
      },
      {
        description: "Shifts from one activity to another without major difficulty",
        reverse: false,
        type: InterrgationEnum.WEEK,
        groupId: "648f1f4f5f4c2a6b1c8e4a02",
        answer: 0
      },
      {
        description: "Handles frustration without strong outbursts",
        reverse: false,
        type: InterrgationEnum.WEEK,
        groupId: "648f1f4f5f4c2a6b1c8e4a03",
        answer: 0
      },
      {
        description: "Uses words or signals to solve small conflicts",
        reverse: false,
        type: InterrgationEnum.WEEK,
        groupId: "648f1f4f5f4c2a6b1c8e4a03",
        answer: 0
      },
      {
        description: "Accepts limits or “no” with brief support",
        reverse: false,
        type: InterrgationEnum.WEEK,
        groupId: "648f1f4f5f4c2a6b1c8e4a03",
        answer: 0
      },
      {
        description: "Gets along with siblings/peers most of the time",
        reverse: false,
        type: InterrgationEnum.WEEK,
        groupId: "648f1f4f5f4c2a6b1c8e4a04",
        answer: 0
      },
      {
        description: "Joins family or group activities willingly",
        reverse: false,
        type: InterrgationEnum.WEEK,
        groupId: "648f1f4f5f4c2a6b1c8e4a04",
        answer: 0
      },
      {
        description: "Feels included and keeps at least one good friend",
        reverse: false,
        type: InterrgationEnum.WEEK,
        groupId: "648f1f4f5f4c2a6b1c8e4a04",
        answer: 0
      },
      {
        description: "Offers help or kindness without being asked",
        reverse: false,
        type: InterrgationEnum.WEEK,
        groupId: "648f1f4f5f4c2a6b1c8e4a05",
        answer: 0
      },
      {
        description: "Tries new tasks with growing confidence",
        reverse: false,
        type: InterrgationEnum.WEEK,
        groupId: "648f1f4f5f4c2a6b1c8e4a05",
        answer: 0
      },
      {
        description: "Shares or takes turns during play",
        reverse: false,
        type: InterrgationEnum.WEEK,
        groupId: "648f1f4f5f4c2a6b1c8e4a05",
        answer: 0
      }
    ];
 for (let index = 0; index < questionsWeek.length; index++) {
      const element = questionsWeek[index];
      await Questions.findOneAndUpdate(
        {
          description: element.description,
          type: element.type
        },
        {
          $set: element
        },
        { upsert: true, new: true, runValidators: true }
      );
    }
    const questionsMonth = [
      {
        description: "Stays calm after something upsetting",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a01",
        answer: 0
      },
      {
        description: "Finds it easy to smile or laugh during the day",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a01",
        answer: 0
      },
      {
        description: "Recovers quickly after disappointments",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a01",
        answer: 0
      },
      {
        description: "Seems comfortable in new situations",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a01",
        answer: 0
      },
      {
        description: "Sleeps well for their age",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a01",
        answer: 0
      },
      {
        description: "Appears tense or worried for long periods",
        reverse: true,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a01",
        answer: 0
      },
      {
        description: "Stays with a task or game until it’s finished",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a06",
        answer: 0
      },
      {
        description: "Listens without interrupting",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a06",
        answer: 0
      },
      {
        description: "Moves between activities without big struggles",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a06",
        answer: 0
      },
      {
        description: "Completes simple instructions in order",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a06",
        answer: 0
      },
      {
        description: "Gets distracted easily during play or conversation",
        reverse: true,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a06",
        answer: 0
      },
      {
        description: "Remembers rules of a game from one day to the next",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a06",
        answer: 0
      },
      {
        description: "Accepts “no” or limits with little upset",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a07",
        answer: 0
      },
      {
        description: "Keeps voice and body calm when frustrated",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a07",
        answer: 0
      },
      {
        description: "Uses words or signals to solve disagreements",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a07",
        answer: 0
      },
      {
        description: "Has strong outbursts when routines change",
        reverse: true,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a07",
        answer: 0
      },
      {
        description: "Waits their turn during group play",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a07",
        answer: 0
      },
      {
        description: "Follows agreed family rules",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a07",
        answer: 0
      },
      {
        description: "Gets along with siblings/peers most of the time",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a04",
        answer: 0
      },
      {
        description: "Joins in family or group activities willingly",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a04",
        answer: 0
      },
      {
        description: "Often chooses to be alone instead of playing with others",
        reverse: true,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a04",
        answer: 0
      },
      {
        description: "Keeps at least one good friend or playmate",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a04",
        answer: 0
      },
      {
        description: "Feels included in group activities",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a04",
        answer: 0
      },
      {
        description: "Enjoys being part of family routines",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a04",
        answer: 0
      },
      {
        description: "Offers help without being asked",   ///
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a05",
        answer: 0
      },
      {
        description: "Shares toys or materials during play",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a05",
        answer: 0
      },
      {
        description: "Shows kindness toward younger children or peers",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a05",
        answer: 0
      },
      {
        description: "Tries new challenges with confidence",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a05",
        answer: 0
      },
      {
        description: "Congratulates others when they do well",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a05",
        answer: 0
      },
      {
        description: "Comforts someone who is upset",
        reverse: false,
        type: InterrgationEnum.MONTH,
        groupId: "648f1f4f5f4c2a6b1c8e4a05",
        answer: 0
      }
    ];
     for (let index = 0; index < questionsMonth.length; index++) {
      const element = questionsMonth[index];
      await Questions.findOneAndUpdate(
        {
          description: element.description,
          type: element.type
        },
        {
          $set: element
        },
        { upsert: true, new: true, runValidators: true }
      );
    }

  } catch (error) {

  }
}

export default addInitalData;
