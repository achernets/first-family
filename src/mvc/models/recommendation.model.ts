import { Schema, model } from "mongoose";
import { REQUIRE_TEXT } from "../../utils/text";
import { IRecommendation } from "../../types";

const RecommendationSchema = new Schema<IRecommendation>(
  {
    name: {
      type: String,
      required: [true, REQUIRE_TEXT],
    },
    description: {
      type: String,
      required: [true, REQUIRE_TEXT],
    }
  },
  { versionKey: false }
);
const Recommendation = model<IRecommendation>("Recommendation", RecommendationSchema);

export default Recommendation;
