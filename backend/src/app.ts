import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import NoteModel from "./models/note";

const app = express();

app.get("/", async (req, res, next) => {
  try {
    // throw Error("BOOM!");
    const notes = await NoteModel.find().exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
});
//!app.get in altına, error handlerin üstüne yazmak önemli!
app.use((req, res, next) => {
  //burada tekrar type belirtmedik, aşağıdan otomatik inferred(çıkarım) edildi.
  //Eğer belirtirsek compiler hata vericek.
  next(Error("Endpoint Not Found"));
});

//! error handling in typescript
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occurred";
  if (error instanceof Error) errorMessage = error.message;
  res.status(500).json({ error: errorMessage });
});

export default app;
