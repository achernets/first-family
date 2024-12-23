import { Schema, model } from "mongoose";
import { REQUIRE_TEXT } from "../../utils/text";
import { ITips } from "../../types";
import { TipsType } from "../../utils/enums";

const TipsSchema = new Schema<ITips>(
  {
    name: {
      type: String,
      required: [true, REQUIRE_TEXT],
    },
    description: {
      type: String,
      required: [true, REQUIRE_TEXT],
    },
    img: {
      type: String,
      default: null,
      //required: [true, REQUIRE_TEXT],
    },
    duration: {
      type: Number,
      default: 0
    },
    reward: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      enum: TipsType,
      default: TipsType.TEXT
    },
    urlVideo: {
      type: String,
      default: null
    },
    backgroundColor: {
      type: String,
      required: [true, REQUIRE_TEXT]
    }
  },
  { versionKey: false }
);
const Tips = model<ITips>("Tips", TipsSchema);

export default Tips;
