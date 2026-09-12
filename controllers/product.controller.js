import Product from "../models/Product.js";

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      published
    } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      stock === undefined
    ) {
      return res.status(400).json({
        message:
          "name, description, price, category and stock are required"
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      published: published === true
    });

    return res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create product",
      error: error.message
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const pageLimit = Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

    const filter = {};

    // Normal users can see only published products
    // Admins can see all products
    if (req.user?.role !== "admin") {
      filter.published = true;
    }

    // Category filter
    if (category) {
      filter.category = {
        $regex: `^${escapeRegex(category)}$`,
        $options: "i"
      };
    }

    // Price filter
    if (
      minPrice !== undefined ||
      maxPrice !== undefined
    ) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Default sorting = newest
    let sortOption = {
      createdAt: -1
    };

    if (sort === "price_asc") {
      sortOption = {
        price: 1
      };
    }

    if (sort === "price_desc") {
      sortOption = {
        price: -1
      };
    }

    if (sort === "newest") {
      sortOption = {
        createdAt: -1
      };
    }

    const skip =
      (currentPage - 1) * pageLimit;

    const [
      products,
      totalProducts
    ] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(pageLimit),

      Product.countDocuments(filter)
    ]);

    return res.json({
      products,
      page: currentPage,
      limit: pageLimit,
      totalProducts,
      totalPages: Math.ceil(
        totalProducts / pageLimit
      )
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch products",
      error: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // Normal users cannot see unpublished products
    if (
      req.user?.role !== "admin" &&
      !product.published
    ) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.json({
      product
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid product ID"
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "description",
      "price",
      "category",
      "stock",
      "published"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        updates,
        {
          new: true,
          runValidators: true
        }
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.json({
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to update product",
      error: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to delete product",
      error: error.message
    });
  }
};

export const publishProduct = async (req, res) => {
  try {
    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        {
          published: true
        },
        {
          new: true
        }
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.json({
      message: "Product published successfully",
      product
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to publish product",
      error: error.message
    });
  }
};

export const unpublishProduct = async (req, res) => {
  try {
    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        {
          published: false
        },
        {
          new: true
        }
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.json({
      message: "Product unpublished successfully",
      product
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to unpublish product",
      error: error.message
    });
  }
};