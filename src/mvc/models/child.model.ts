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
      default: null
    },
    sex: {
      type: String,
      enum: Sex,
      default: null
    },
    createDate: {
      type: Number,
      default: new Date().getTime()
    }
  },
  { versionKey: false }
);

ChildrenSchema.pre('save', function (done) {
  this.createDate = new Date().getTime();
  done();
});

const Children = model<IChildren>("Children", ChildrenSchema);

export default Children;
