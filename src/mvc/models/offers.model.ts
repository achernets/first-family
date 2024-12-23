import { Schema, model } from "mongoose";
import { REQUIRE_TEXT } from "../../utils/text";
import { IOffers } from "../../types";

const OffersSchema = new Schema<IOffers>(
  {
    name: {
      type: String,
      required: [true, REQUIRE_TEXT],
    },
    subName: {
      type: String,
      required: [true, REQUIRE_TEXT],
    },
    description: {
      type: String,
      required: [true, REQUIRE_TEXT],
    },
    hot: {
      type: Boolean,
      default: false
    }
  },
  { versionKey: false }
);
const Offers = model<IOffers>("Offers", OffersSchema);

export default Offers;
