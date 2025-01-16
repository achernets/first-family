import { Schema, model } from "mongoose";
import { REQUIRE_TEXT } from "../../utils/text";
import { IViewer } from "../../types";

const ViewerSchema = new Schema<IViewer>(
  {
    tipsId: {
      type: Schema.Types.ObjectId,
      ref: "Tips",
      default: null
    },
    userId: {
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

ViewerSchema.pre('save', function (done) {
  this.createDate = new Date().getTime();
  done();
});

const Viewer = model<IViewer>("Viewer", ViewerSchema);

export default Viewer;
