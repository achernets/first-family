
import { Schema, model } from "mongoose";
import { IOnBoardPoll } from "../../types";
import { REQUIRE_TEXT } from "../../utils/text";

const OnBoardPollItemSchema = new Schema({
  description: { type: String, required: true },
  answersQuestion: { type: [String], required: true },
  answer: { type: String, required: true },
  finishTitle: { type: String, default: null },
  finishSubtitle: { type: String, default: null },
});

const OnBoardPollSchema = new Schema<IOnBoardPoll>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, REQUIRE_TEXT]
    },
    items: { type: [OnBoardPollItemSchema], required: true }
  },
  { versionKey: false }
);

const OnBoardPoll = model<IOnBoardPoll>("OnBoardPoll", OnBoardPollSchema);

export default OnBoardPoll;
