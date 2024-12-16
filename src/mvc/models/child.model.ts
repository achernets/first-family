import { Schema, model } from "mongoose";
import { REQUIRE_TEXT } from "../../utils/text";
import { IChildren } from "../../types";
import { Sex } from "../../utils/enums";

const ChildrenSchema = new Schema<IChildren>(
  {
    name: {
      type: String,
      required: [true, REQUIRE_TEXT],
    },
    birthdate: {
      type: Number,
      required: [true, REQUIRE_TEXT],
    },
    sex: {
      type: String,
      enum: Sex,
      required: [true, REQUIRE_TEXT],
    }
  },
  { versionKey: false }
);

const Children = model<IChildren>("Children", ChildrenSchema);

export default Children;
