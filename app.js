import express from "express";
import productRouter from "./routes/product.js";
import connect from "./schemas/index.js";

connect();

const app = express();
const PORT = 3000;

const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", [router, productRouter]);
//api 주소에 들어오면 router 함수 조회

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
