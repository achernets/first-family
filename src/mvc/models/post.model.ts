import { Schema, model } from "mongoose";
import { REQUIRE_TEXT } from "../../utils/text";
import { IPost } from "../../types";

const PostSchema = new Schema<IPost>(
  {
    images: [{
      type: String,
      default: [],
      required: [true, REQUIRE_TEXT]
    }],
    description: {
      type: String,
      default: null
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, REQUIRE_TEXT]
    },
    createDate: {
      type: Number, 
      default: new Date().getTime()
    }
  },
  { versionKey: false }
);

PostSchema.pre('save', function(done) {
  this.createDate = new Date().getTime();
  done();
});

const Post = model<IPost>("Post", PostSchema);

export default Post;
