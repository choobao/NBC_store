import express from "express";
import Products from "../schemas/products.schema.js";

const router = express.Router();

//1. 상품등록 api
router.post("/products", async (req, res, next) => {
  const { name } = req.body;
  const { category } = req.body;
  const { price } = req.body;
  const { content } = req.body;

  //value 데이터 전달하지 않으면, 클라이언트에게 에러 메시지 전달
  if (!name) {
    return res
      .status(400)
      .json({ errorMessage: "상품 이름을 작성해주십시오." });
  }

  //DB에서 상품ID 기준으로 정렬, 아무것도 없을시 id 1번으로 상품 등록
  const productsList = await Products.findOne().sort("-productsId").exec();
  const productsId = productsList ? productsList.productsId + 1 : 1;

  //실제 데이터베이스에 저장하는 과정
  const product = new Products({
    name: name,
    productsId: productsId,
    category: category,
    price: price,
    content: content,
  });
  await product.save();

  //클라이언트에게 등록한 상품을 반환
  return res.status(201).json({ message: "판매상품이 등록되었습니다." });
});

//2. 상품목록조회 api
router.get("/products", async (req, res, next) => {
  const products = await Products.find().sort("-productsId").exec();
  return res.status(200).json({ products });
});

//3. 상품상세조회 api
router.get("/products/:productsId", async (req, res, next) => {
  const { productsId } = req.params;

  const findproducts = await Products.findById(productsId).exec();
  return res.status(200).json({ product: findproducts });
});

//4. 상품 상세정보수정 api
router.patch("/products/:productsId", async (req, res, next) => {
  const { productsId } = req.params;
  const { name, category, content, price } = req.body;

  const findproducts = await Products.findById(productsId).exec();
  if (!findproducts) {
    return res.status(404).json({ errorMessage: "존재하지 않는 상품입니다." });
  }

  if (content) {
    findproducts.content = content;
  }

  await findproducts.save();
  return res.status(200).json({ message: "상품정보를 수정했습니다." });
});

//5. 상품삭제 api
router.delete("/products/:productsId", async (req, res, next) => {
  const { productsId } = req.params;

  const findproducts = await Products.findById(productsId).exec();
  if (!findproducts) {
    return res
      .status(404)
      .json({ errorMessage: "존재하지 않는 상품정보 입니다." });
  }

  await Products.deleteOne({ _id: findproducts });
  return res.status(200).json({ message: "상품을 삭제했습니다." });
});

export default router;
