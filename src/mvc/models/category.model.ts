import { Schema, model } from "mongoose";
import { REQUIRE_TEXT } from "../../utils/text";
import { ICategory } from "../../types";
import { DevelopmentType } from "../../utils/enums";

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, REQUIRE_TEXT],
    },
    image: {
      type: String,
      //required: [true, REQUIRE_TEXT],
    },
    description: {
      type: String,
      required: [true, REQUIRE_TEXT],
    },
    descriptionShort: {
      type: String,
      required: [true, REQUIRE_TEXT],
    },
    recommendations: [{
      type: Schema.Types.ObjectId,
      ref: "Recommendation",
    }],
    development: {
      type: Map,
      of: Number,
      default: {
        [DevelopmentType.PHYSICAL] : 0,
        [DevelopmentType.COGNITIVE] : 0,
        [DevelopmentType.MENTAL] : 0
      }
    },
    during: {
      type: Number,
      default: 0
    },
    trophy: {
      type: Number,
      default: 0
    },
    developmentType: {
      type: String,
      enum: DevelopmentType,
      default: DevelopmentType.PHYSICAL
    }
  },
  { versionKey: false }
);
const Category = model<ICategory>("Category", CategorySchema);

export default Category;
