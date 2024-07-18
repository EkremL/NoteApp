//!d types are Type Definitions Files

import mongoose from "mongoose";

declare module "express-session" {
  interface SessionData {
    userId: mongoose.Types.ObjectId;
  }
}

//!bu işlemden sonra tsconfig dosyamızda da değişiklik yaptık  typeRoots a  "node_modules/@types",
//!                                                                          "@types" ekledik

//? daha sonra en alttakinin üstündeki } den sonra "ts-node":{
//?"files":true} ekledik

//! daha sonra app.ts içerisine config ayarları eklenmeye devam edildi.
