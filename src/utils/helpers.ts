import { NextFunction, Response, Request } from "express";
import {
  FORM_DARA_ERROR_TEXT,
  NO_ACCESS,
  PARSE_FILTERS_STRING_TEXT_ERROR,
  SERVER_ERROR_TEXT,
  UNIQUE_FIELD_TEXT,
} from "./text";
import { keys, reduce, head } from "lodash";
import { RootFilterQuery } from "mongoose";
import { sign, verify } from "jsonwebtoken";
import {
  GOOGLE_APP_PASS,
  GOOGLE_USER,
  SECRET_KEY_JWT,
  TOKEN_EXPIRED,
} from "../constants/config";
import nodemailer from "nodemailer";

export const genereteToken = (data: string) => {
  try {
    return sign(
      {
        userId: data,
      },
      SECRET_KEY_JWT,
      { expiresIn: TOKEN_EXPIRED }
    );
  } catch (error) {
    throw error;
  }
};

export const isAuthUser = (token: string | string[]) => {
  try {
    verify(token, SECRET_KEY_JWT);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
};

export const responseError = (
  res: Response,
  error: any,
  recordIsExistText = "Такий запис вже існує"
) => {
  if (error?.name === "ValidationError") {
    res.status(500).send({
      message: FORM_DARA_ERROR_TEXT,
      key: "FORM_ERROR",
      error: reduce(
        keys(error.errors),
        (hash, itm) => {
          hash.push({
            fieldName: itm,
            message: error?.errors[itm]?.message,
          });
          return hash;
        },
        []
      ),
    });
  } else if (error?.name === "parseFilter") {
    res.status(500).json({
      message: PARSE_FILTERS_STRING_TEXT_ERROR,
      key: "PARSE_FILTERS",
      error: [],
    });
  } else if (error?.code === 11000) {
    res.status(500).json({
      message: recordIsExistText,
      key: "RECORD_IS_EXIST",
      error: [
        {
          fieldName: head(keys(error.keyValue)),
          message: UNIQUE_FIELD_TEXT,
        },
      ],
    });
  } else {
    res.status(500).send({
      message: SERVER_ERROR_TEXT,
      key: "SERVER_ERROR",
      error: error,
    });
  }
};

export const removeEmptyProperty = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, v]) => v != null && v !== undefined && v !== "")
      .map(([k, v]) => [k, v === Object(v) ? removeEmptyProperty(v) : v])
  );
};

export const parseFiltersQuery = (filters: string): RootFilterQuery<any> => {
  try {
    if (!filters) return {};
    return removeEmptyProperty(JSON.parse(filters));
  } catch (error) {
    throw {
      name: "parseFilter",
      error: error,
    };
  }
};

export const privateRoute = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers["token"];
    const isAuth = isAuthUser(token);
    if (isAuth) {
      next();
    } else {
      res.status(403).send({
        message: NO_ACCESS,
        key: "NO_ACCESS",
      });
    }
  } catch (error) {
    res.status(403).send({
      message: NO_ACCESS,
      key: "NO_ACCESS",
      error: error,
    });
  }
};

export const sendMail = async (
  to: string,
  subject: string,
  description: string
): Promise<boolean> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GOOGLE_USER,
        pass: GOOGLE_APP_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: `<${GOOGLE_USER}>`,
      to: to,
      subject: subject,
      html: description,
    });
    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
};
