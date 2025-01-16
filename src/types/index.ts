import { ObjectId, Document } from "mongoose";
import { DevelopmentType, Sex, TipsType } from "../utils/enums";

interface RequestById {
  id: string;
}

interface QueryParams {
  page?: number;
  limit?: number;
  filters?: string;
}

interface ISignUp {
  user: IUser,
  childrens: {
    children: IChildren,
    selected: boolean
  }[]
};

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
  avatarUrl: string,
  trophy: number
}

type IChildren = {
  name: string,
  birthdate: number,
  sex: Sex;
} & Document

interface IDevelopment extends Document {
  name: string,
  description: string
  type: DevelopmentType
}

interface ICategory extends Document {
  name: string,
  image: string | null,
  description: string,
  descriptionShort: string,
  recommendations: {
    id: ObjectId
  }[],
  developments: {
    [key: string]: number
  },
  duration: number,
  reward: number,
  development: ObjectId,
  default: boolean
}

interface IRecommendation extends Document {
  name: string,
  description: string
}

interface ITips extends Document {
  name: string,
  description: string,
  img: string,
  duration: number,
  reward: number,
  type: TipsType,
  urlVideo: string,
  backgroundColor: string,
  createDate: number
}

interface IOffers extends Document {
  name: string,
  subName: string,
  description: string,
  hot: boolean
}

type IChildDevelopment = {
  developmentId: ObjectId,
  value: number
}

interface IChildActivity extends Document {
  childId: ObjectId,
  activityId: ObjectId,
  duration: number
}

interface IPost extends Document {
  description: string,
  images: string[],
  authorId: ObjectId,
  createDate: number
}

interface IComment extends Document {
  postId: ObjectId,
  userId: ObjectId,
  comment: string,
  createDate: number
}

interface ILike extends Document {
  postId: ObjectId,
  userId: ObjectId
  commentId: ObjectId
}
 
export {
  RequestById,
  QueryParams,
  ISignUp,
  IUser,
  IChildren,
  IDevelopment,
  ICategory,
  IRecommendation,
  ITips,
  IOffers,
  IChildDevelopment,
  IChildActivity,
  IPost,
  IComment,
  ILike
};
