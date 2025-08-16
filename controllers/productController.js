// controllers/productController.js
import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs/promises';

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    let images = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products',
        });
        images.push({ public_id: result.public_id, url: result.secure_url });
        try { await fs.unlink(file.path); } catch {}
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images,
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Products (with search & filter)
export const getAllProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    const category = req.query.category
      ? { category: req.query.category }
      : {};

    const products = await Product.find({ ...keyword, ...category }).populate('category');

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Optional: Delete existing images from Cloudinary
    if (req.files && product.images.length > 0) {
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    let images = product.images;
    if (req.files) {
      images = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products',
        });
        images.push({ public_id: result.public_id, url: result.secure_url });
        try { await fs.unlink(file.path); } catch {}
      }
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock ?? product.stock;
    product.images = images;

    await product.save();
    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete images from Cloudinary
    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};
