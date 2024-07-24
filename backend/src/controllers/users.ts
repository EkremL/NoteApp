import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId)
      .select("+email")
      .exec();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;

  try {
    //!field validation
    if (!username || !email || !passwordRaw) {
      throw createHttpError(400, "All fields are required!");
    }

    //!username validation
    const existingUsername = await UserModel.findOne({
      username: username,
    }).exec();
    if (existingUsername) {
      throw createHttpError(409, "Username already exists!");
    }
    //!email validation
    const existingEmail = await UserModel.findOne({
      email: email,
    }).exec();
    if (existingEmail) {
      throw createHttpError(409, "Email already exists!");
    }
    //!hash password
    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    //!create user
    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: passwordHashed,
    });

    req.session.userId = newUser._id; //normal js kullansak burası yeterliydi fakat typescript projesi olduğu icin config eklememiz gerek o yüzden @types klasörü açtık

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  username?: string;
  password?: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    //!field chech
    if (!username || !password) {
      throw createHttpError(400, "All fields are required!");
    }

    //! sending username and password and email
    const user = await UserModel.findOne({ username: username })
      .select("+password +email")
      .exec();
    if (!user) {
      throw createHttpError(401, "Invalid credentials!");
    }

    //!password match
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credentials!");
    }

    req.session.userId = user._id;
    console.log("User logged in, session:", req.session);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};
