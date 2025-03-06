
import { Schema, model } from "mongoose";
import { IOnBoardPoll } from "../../types";
import { REQUIRE_TEXT } from "../../utils/text";

const OnBoardPollSchema = new Schema<IOnBoardPoll>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, REQUIRE_TEXT]
    },
    items: [
      {
        type: String
      }
    ],
  },
  { versionKey: false }
);

const OnBoardPoll = model<IOnBoardPoll>("OnBoardPoll", OnBoardPollSchema);

export default OnBoardPoll;
