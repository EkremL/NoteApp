//?appı artık ayırdık ve buradan import ettik
import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

// const port = process.env.PORT;
//!envalid kurduktan sonra ve ayarı yaptıktan sonra process i burada ve connectte kaldırdık
const port = env.PORT;

// mongoose
//   .connect(env.MONGO_CONNECTION_STRING)
//   .then(() => {
//     console.log("Mongoose Connected");
//     app.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });
//   })
//   .catch(console.error);

const connect = async () => {
  try {
    await mongoose.connect(env.MONGO_CONNECTION_STRING);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

app.listen(port, () => {
  connect();
  console.log(`Server ${port} portunda çalışıyor.`);
});
