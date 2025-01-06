import { Schema, model } from "mongoose";
import { REQUIRE_TEXT } from "../../utils/text";
import { IChildActivity } from "../../types";

const ChildActivitySchema = new Schema<IChildActivity>(
  {
    childId: {
      type: Schema.Types.ObjectId,
      ref: "Children",
      required: [true, REQUIRE_TEXT],
    },
    activityId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, REQUIRE_TEXT],
    },
    duration: {
      type: Number,
      required: [true, REQUIRE_TEXT],
      default: 0
    }
  },
  { versionKey: false }
);

const ChildActivity = model<IChildActivity>("ChildActivity", ChildActivitySchema);

export default ChildActivity;
