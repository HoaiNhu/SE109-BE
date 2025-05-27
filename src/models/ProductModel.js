const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, unique: true },
    productPrice: { type: Number, required: true },
    productImage: { type: String, required: true },
    productCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    productSize: { type: Number, default: 0 },
    productQuantity: { type: Number, default: 0 },
    productDescription: { type: String, required: true },
    productMaterial: {
      type: String,
      required: true,
      enum: ["vàng", "bạc", "platinum", "thép không gỉ"],
    },
    productWeight: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
