const Product = require("../models/ProductModel");
const ProductService = require("../services/ProductService");
const uploadCloudinary = require("../Helper/UploadCloudinary")

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
  const { body } = req;
  console.log("body", body); // In ra đối tượng body

  try {
    const {
      productName,
      productPrice,
      productCategory,
      productSize,
      productDescription,
      productMaterial,
      productWeight,
      productQuantity,
    } = req.body;

    if (
      !productName ||
      !productPrice ||
      !req.file ||
      !productCategory ||
      !productDescription ||
      !productMaterial ||
      !productWeight||
      !productQuantity
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "All fields are required",
      });
    }

    const allowedMaterials = ["vàng", "bạc", "platinum", "thép không gỉ"];
    if (!allowedMaterials.includes(productMaterial.toLowerCase())) {
      return res.status(400).json({
        status: "ERR",
        message: "Invalid material. Allowed: vàng, bạc, platinum, thép không gỉ",
      });
    }

    if (isNaN(productWeight) || Number(productWeight) <= 0) {
      return res.status(400).json({
        status: "ERR",
        message: "Product weight must be a number greater than 0",
      });
    }

    if (isNaN(productQuantity) || !Number.isInteger(Number(productQuantity)) || Number(productQuantity) <= 0) {
      return res.status(400).json({
         status: "ERR",
         message: "Product Quantity must be an integer greater than 0",
  });
}

    const productImage = req.file.path;

    const newProduct = {
      productName,
      productPrice,
      productImage,
      productCategory,
      productSize,
      productDescription,
      productMaterial: productMaterial.toLowerCase(),
      productWeight: Number(productWeight),
      productQuantity : Number(productQuantity),
    };

    const response = await ProductService.createProduct(newProduct);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};
// Cập nhật thông tin sản phẩm
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    const data = req.body;

    // Kiểm tra nếu có file mới để upload
    if (req.file) {
      data.productImage = req.file.path;
    }

    // Validate material nếu có
    if (data.productMaterial) {
      const allowedMaterials = ["vàng", "bạc", "platinum", "thép không gỉ"];
      if (!allowedMaterials.includes(data.productMaterial.toLowerCase())) {
        return res.status(400).json({
          status: "ERR",
          message: "Invalid material. Allowed: vàng, bạc, platinum, thép không gỉ",
        });
      }
      data.productMaterial = data.productMaterial.toLowerCase();
    }

    // Validate weight nếu có
    if (data.productWeight && (isNaN(data.productWeight) || Number(data.productWeight) <= 0)) {
      return res.status(400).json({
        status: "ERR",
        message: "Product weight must be a number greater than 0",
      });
    }

    if (isNaN(data.productQuantity) || !Number.isInteger(Number(data.productQuantity)) || Number(data.productQuantity) <= 0) {
      return res.status(400).json({
         status: "ERR",
         message: "Product Quantity must be an integer greater than 0",
  });}

    const response = await ProductService.updateProduct(productId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};


// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("ID", productId)
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });

    }
    // const imagePublicId = product.productImage.split("/").pop().split(".")[0]; // Assuming image URL follows Cloudinary format
    // await cloudinary.uploader.destroy(imagePublicId);
    // console.log("IMG", imagePublicId)
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Lấy thông tin chi tiết sản phẩm
const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    const response = await ProductService.getDetailsProduct(productId);
    if (!response) {
      return res.status(404).json({
        status: "ERR",
        message: "Product not found",
      });
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Lấy danh sách tất cả sản phẩm
const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;

    const response = await ProductService.getAllProduct(
      Number(limit),
      Number(page),
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Tìm kiếm sản phẩm
const searchProducts = async (req, res) => {
  try {
    const { search } = req.query; // Lấy từ khóa tìm kiếm từ query parameters
    if (!search) {
      return res.status(400).json({
        status: "ERR",
        message: "Search query is required",
      });
    }

    const response = await ProductService.searchProducts(search); // Gọi hàm searchProducts từ ProductService
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

// Lấy sản phẩm theo danh mục
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params; // Lấy categoryId từ URL params

    if (!categoryId) {
      return res.status(400).json({
        status: "ERR",
        message: "Category ID is required",
      });
    }

    const response = await ProductService.getProductsByCategory(categoryId); // Gọi hàm từ ProductService
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getDetailsProduct,
  getAllProduct,
  searchProducts,
  getProductsByCategory, // Thêm phương thức mới vào module.exports
};


