import { Schema, model } from "mongoose";
import { REQUIRE_TEXT } from "../../utils/text";
import { IUser } from "../../types";
import bcrypt from "bcryptjs";
import { Sex } from "../../utils/enums";

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, REQUIRE_TEXT],
    },
    surname: {
      type: String,
      required: [true, REQUIRE_TEXT],
    },
    birthdate: {
      type: Number,
      required: [true, REQUIRE_TEXT],
    },
    sex: {
      type: String,
      enum: Sex,
      required: [true, REQUIRE_TEXT],
    },
    childrens: [
      {
        children: {
          type: Schema.Types.ObjectId,
          ref: "Children",
        },
        selected: {
          type: Boolean,
          default: true
        }
      }
    ],
    email: {
      type: String,
      unique: true,
      required: [true, REQUIRE_TEXT],
    },
    password: { type: String, required: [true, REQUIRE_TEXT] },
    avatarUrl: { type: String, default: null }
  },
  { versionKey: false }
);

UserSchema.pre<IUser>(/save|findOneAndUpdate/, function (next) {
  // ts-ignore
  const user = this;
  user.set("password", bcrypt.hashSync(user.get("password"), 5));
  next();
});

const User = model<IUser>("User", UserSchema);

export default User;
