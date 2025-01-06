import { Schema, model } from "mongoose";
import { REQUIRE_TEXT } from "../../utils/text";
import { IDevelopment } from "../../types";
import { DevelopmentType } from "../../utils/enums";

const DevelopmentSchema = new Schema<IDevelopment>(
  {
    name: {
      type: String,
      required: [true, REQUIRE_TEXT],
    },
    description: {
      type: String,
      required: [true, REQUIRE_TEXT],
    },
    type: {
      type: String,
      enum: DevelopmentType,
      required: [true, REQUIRE_TEXT],
    }
  },
  { versionKey: false }
);
const Development = model<IDevelopment>("Development", DevelopmentSchema);

export default Development;
