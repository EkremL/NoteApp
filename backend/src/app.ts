import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
// import NoteModel from "./models/note";
import notesRoutes from "./routes/notes";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
//morganı import edince hata vericek cunku typescript projesi icin npm i --save-dev @types/morgan de kurmamız gerek

const app = express();

app.use(morgan("dev"));

app.use(express.json());

//!artık yeni middlewareyi ekliyoruz ve endpointi belirtiyoruz
app.use("/api/notes", notesRoutes);

// app.get("/", async (req, res, next) => {
//   try {
//     // throw Error("BOOM!");
//     const notes = await NoteModel.find().exec();
//     res.status(200).json(notes);
//   } catch (error) {
//     next(error);
//   }
// }
//bu kısmı controller ve route içine aldık dolayısıyla parametrelerin tipini orada tekrar belirtebiliriz
// ya da farklı bir yöntem olarak RequestHandler kullanabiliriz böylece parametrelerin type'i inferred edilir
// );

//!app.get in altına, error handlerin üstüne yazmak önemli!
// app.use((req, res, next) => {
//   //burada tekrar type belirtmedik, aşağıdan otomatik inferred(çıkarım) edildi.
//   //Eğer belirtirsek compiler hata vericek.
//   next(Error("Endpoint Not Found"));
// });

//?HTTP-ERRORS PACKAGE ile error handlingi daha gelişmiş hale getiriyoruz
app.use((req, res, next) => {
  //burada tekrar type belirtmedik, aşağıdan otomatik inferred(çıkarım) edildi.
  //Eğer belirtirsek compiler hata vericek.
  //!createHttpError, 2 adet parametre almaktadır, 1. si  belirttiğimiz statüs kodu, 2. si mesajımız
  next(createHttpError(404, "Endpoint Not Found"));
});

//! error handling in typescript
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
//   console.error(error);
//   let errorMessage = "An unknown error occurred";
//   if (error instanceof Error) errorMessage = error.message;
//   res.status(500).json({ error: errorMessage });
// });
//!HTTP ERRORS Code Upgrade
//eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    //! buradaki isHttpError http paketinden gelmektedir.
    //*buradaki error.status ve error.message, http paketinden gelmektedir.
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
