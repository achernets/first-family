import { Schema, model } from "mongoose";
import { REQUIRE_TEXT } from "../../utils/text";
import { IComment } from "../../types";

const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, REQUIRE_TEXT]
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, REQUIRE_TEXT]
    },
    comment: {
      type: String,
      required: [true, REQUIRE_TEXT],
      default: null
    },
    createDate: {
      type: Number, 
      default: new Date().getTime()
    }
  },
  { versionKey: false }
);

CommentSchema.pre('save', function(done) {
  this.createDate = new Date().getTime();
  done();
});

const Comment = model<IComment>("Comment", CommentSchema);

export default Comment;
