import { ObjectId, Document } from "mongoose";
import { Sex } from "../utils/enums";

interface IUser extends Document {
  name: string,
  surname: string,
  birthdate: number;
  sex: Sex;
  email: string;
  password: string;
  childrens: {
    children: ObjectId,
    selected: boolean
  }[],
  avatarUrl: string
}

interface IChildren extends Document {
  name: string,
  birthdate: number,
  sex: Sex;
}

export {
  IUser,
  IChildren
};
