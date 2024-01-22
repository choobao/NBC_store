import mongoose from "mongoose";

const NBC_product = new mongoose.Schema({
  productsId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
  },
  content: {
    type: String,
  },
  price: {
    type: Number,
  },
});

export default mongoose.model("Products", NBC_product);
