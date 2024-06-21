import "dotenv/config";
import env from "./util/validateEnv";
import mongoose from "mongoose";
import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

// const port = process.env.PORT;
//!envalid kurduktan sonra ve ayarı yaptıktan sonra process i burada ve connectte kaldırdık
const port = env.PORT;

mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("Mongoose Connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(console.error);
