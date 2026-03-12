const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { category, search, id } = req.query;
    let query = {};

    if (id) {
      const product = await Product.findById(id);
      return res.json(product ? [product] : []);
    }

    if (category && category !== 'All') {
      query.category = { $regex: category, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(4);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
