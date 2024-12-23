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

interface IChildren extends Document {
  name: string,
  birthdate: number,
  sex: Sex;
}

interface IDevelopment extends Document {
  name: string,
  description: string
  type: DevelopmentType,
  value: number
}

interface ICategory extends Document {
  name: string,
  image: string,
  description: string,
  descriptionShort: string,
  recommendations: {
    id: ObjectId
  }[],
  development: {
    [DevelopmentType.PHYSICAL]: number,
    [DevelopmentType.COGNITIVE]: number,
    [DevelopmentType.MENTAL]: number
  },
  during: number,
  trophy: number,
  developmentType: DevelopmentType
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
  backgroundColor: string
}

interface IOffers extends Document {
  name: string,
  subName: string,
  description: string,
  hot: boolean
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
  IOffers
};
