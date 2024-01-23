import express from "express";
import Products from "../schemas/products.schema.js";

const router = express.Router();

//1. 상품등록 api
router.post("/products", async (req, res, next) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }

    const { name, price, content, author, password } = req.body;

    const newProduct = new Products({
      name,
      price,
      content,
      author,
      password,
    });
    await newProduct.save();

    //클라이언트에게 등록한 상품을 반환
    return res.status(201).json({ message: "판매상품이 등록되었습니다." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "예기치 못한 에러가 발생하였습니다" });
    //실제로는 에러를 로깅해야함
  }
});

//2. 상품목록조회 api
router.get("/products", async (req, res, next) => {
  try {
    const products = await Products.find()
      .select("_id name autor status createdAt")
      //이렇게 하면 몽고디비에서 이 항목만 출력해줌. 앞에 -를 붙이면 특정항목만 배제
      .sort({ createdAt: -1 })
      .exec();
    return res.status(200).json({ products });
  } catch (errror) {
    return res
      .status(500)
      .json({ message: "예기치 못한 에러가 발생하였습니다" });
  }
});

//3. 상품상세조회 api
router.get("/products/:productsId", async (req, res, next) => {
  try {
    const product = await Products.findById(req.params.productsId)
      .select("_id name content autor status createdAt")
      .sort({ createdAt: -1 })
      .exec();

    if (!product) {
      return res
        .status(404)
        .json({ errorMessage: "상품 데이터가 존재하지않습니다." });
    }

    return res.status(200).json({ product });
  } catch (errror) {
    return res
      .status(500)
      .json({ message: "예기치 못한 에러가 발생하였습니다" });
  }
});

//4. 상품 상세정보수정 api
router.patch("/products/:productsId", async (req, res, next) => {
  try {
    if (!req.body || !req.params) {
      return res
        .status(400)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }

    const { name, content, password, status } = req.body;

    const product = await Products.findById(req.params.productsId).exec();

    if (!product) {
      return res
        .status(404)
        .json({ errorMessage: "상품 데이터가 존재하지않습니다." });
    }

    if (password !== product.password) {
      return res
        .status(401)
        .json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    product.name = name;
    product.content = content;
    product.status = status;

    await product.save();
    return res.status(200).json({ message: "상품정보가 수정되었습니다." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "예기치 못한 에러가 발생하였습니다" });
  }

  // const { productsId } = req.params;
  // const { name, category, content, price } = req.body;

  // const findproducts = await Products.findById(productsId).exec();
  // if (!findproducts) {
  //   return res.status(404).json({ errorMessage: "존재하지 않는 상품입니다." });
  // }

  // if (content) {
  //   findproducts.content = content;
  // }

  // await findproducts.save();
  // return res.status(200).json({ message: "상품정보를 수정했습니다." });
});

//5. 상품삭제 api
router.delete("/products/:productsId", async (req, res, next) => {
  try {
    if (!req.body || !req.params) {
      return res
        .status(400)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }

    const { productsId } = req.params.productsId;
    const { password } = req.body;
    const product = await Products.findById(req.params.productsId).exec();

    if (!product) {
      return res
        .status(404)
        .json({ errorMessage: "상품 데이터가 존재하지않습니다." });
    }

    if (password !== product.password) {
      return res
        .status(401)
        .json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    await product.deleteOne({ id: productsId });

    return res.status(200).json({ message: "상품을 삭제하였습니다." });
  } catch (errror) {
    return res
      .status(500)
      .json({ message: "예기치 못한 에러가 발생하였습니다" });
  }

  // const { productsId } = req.params;

  // const findproducts = await Products.findById(productsId).exec();
  // if (!findproducts) {
  //   return res
  //     .status(404)
  //     .json({ errorMessage: "존재하지 않는 상품정보 입니다." });
  // }

  // await Products.deleteOne({ _id: findproducts });
  // return res.status(200).json({ message: "상품을 삭제했습니다." });
});

export default router;
