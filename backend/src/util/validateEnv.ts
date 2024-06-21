//envalid, serveri ayağa kaldırmadan önce hata var mı yok mu onu kontrol eden bir package.
import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
  MONGO_CONNECTION_STRING: str(),
  PORT: port(),
});
