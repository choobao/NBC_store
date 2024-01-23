import express from "express";
import productRouter from "./routes/product.js";
import connect from "./schemas/index.js";

//실제 몽고디비에 접속
connect();

const app = express();
const PORT = 3000;

const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//api 주소에 들어오면 router 함수 조회
app.use("/api", [router, productRouter]);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
