import { Schema, model } from "mongoose";
import { ILike } from "../../types";
import { REQUIRE_TEXT } from "../../utils/text";

const LikeSchema = new Schema<ILike>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: null
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, REQUIRE_TEXT]
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null
    },
  },
  { versionKey: false }
);
const Like = model<ILike>("Like", LikeSchema);

export default Like;
