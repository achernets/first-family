import { Schema, model } from "mongoose";
import { IQuestionsGroup, IQuestions } from "../../types";
import { REQUIRE_TEXT } from "../../utils/text";
import { InterrgationEnum } from "../../utils/enums";

const QuestionsGroupSchema = new Schema<IQuestionsGroup>(
  {
    name: {
      type: String,
      required: [true, REQUIRE_TEXT]
    },
  },
  { versionKey: false }
);
const QuestionsGroup = model<IQuestionsGroup>("QuestionsGroup", QuestionsGroupSchema);

const QuestionsSchema = new Schema<IQuestions>(
  {
    description: {
      type: String,
      required: [true, REQUIRE_TEXT]
    },
    reverse: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: InterrgationEnum,
      default: InterrgationEnum.WEEK
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "QuestionsGroup",
      required: [true, REQUIRE_TEXT]
    },
    answer: {
      type: Number,
      default: 0
    }
  },
  { versionKey: false }
);
const Questions = model<IQuestions>("Questions", QuestionsSchema);

export {
  QuestionsGroup,
  Questions
};
