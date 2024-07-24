import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
// import NoteModel from "./models/note";
import notesRoutes from "./routes/notes";
import userRoutes from "./routes/users";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import cors from "cors";
import session from "express-session";
//morganı import edince hata vericek cunku typescript projesi icin npm i --save-dev @types/morgan de kurmamız gerek
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";

const app = express();

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend'in çalıştığı URL
    credentials: true,
  })
);

app.use(express.json());
//!express-session'u express ile routeler arasına middleware olarak ekliyoruz
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: false, // Secure only in production
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
  })
);

//!artık yeni middlewareyi ekliyoruz ve endpointi belirtiyoruz
app.use("/api/users", userRoutes);
app.use("/api/notes", requiresAuth, notesRoutes); //burada da authenticaton kontrolu icin middleware ekledik artık bütün note endpointleri de korunmuş oldu

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
