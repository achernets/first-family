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
      default: null
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
    developments: {
      type: Object,
      of: Number,
      default: {}
    },
    duration: {
      type: Number,
      default: 0
    },
    reward: {
      type: Number,
      default: 0
    },
    development: {
      type: Schema.Types.ObjectId,
      ref: "Development",
    },
    default: {
      type: Boolean,
      default: false
    }
  },
  { versionKey: false }
);
const Category = model<ICategory>("Category", CategorySchema);

export default Category;
