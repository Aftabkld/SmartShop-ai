import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { generateSearchFilters } from "../utils/aiHelpers.js";

export const aiSearchController = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }

    // Get filters using OpenAI
    const filters = await generateSearchFilters(query);

    // Build MongoDB query object
    const mongoQuery = {};

    if (filters.category) {
      // Try to resolve category name to ObjectId
      const categoryDoc = await Category.findOne({ name: new RegExp(filters.category, 'i') });
      if (categoryDoc) {
        mongoQuery.category = categoryDoc._id;
      }
    }

    if (filters.minPrice || filters.maxPrice) {
      mongoQuery.price = {};
      if (filters.minPrice) mongoQuery.price.$gte = filters.minPrice;
      if (filters.maxPrice) mongoQuery.price.$lte = filters.maxPrice;
    }

    // Support keyword search on product name
    if (filters.keyword) {
      mongoQuery.name = { $regex: new RegExp(filters.keyword, 'i') };
    }

    const products = await Product.find(mongoQuery);

    res.status(200).json({
      success: true,
      products,
      appliedFilters: filters,
    });
  } catch (error) {
    console.error("AI search failed:", error);
    res.status(500).json({ success: false, message: "AI Search failed" });
  }
};
