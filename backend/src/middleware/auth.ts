import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const requiresAuth: RequestHandler = (req, res, next) => {
  console.log("Oturum kontrolü yapılıyor. Oturum kimliği:", req.session.userId);
  //daha once controllerde yazdığımız authenticateduser sayesinde kontrol sağlayabiliyoruz
  if (req.session.userId) {
    next();
  } else {
    next(createHttpError(401, "User not authenticated"));
  }
};
