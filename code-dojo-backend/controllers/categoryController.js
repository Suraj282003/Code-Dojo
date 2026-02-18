const Category = require("../models/Category")

// GET all categories (for carousel)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().select("name description initialTime")
    res.status(200).json(categories)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// GET category with ordered problem IDs
exports.getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params

    const category = await Category.findById(categoryId)
      .populate("problems.problemId", "title difficulty")

    if (!category) {
      return res.status(404).json({ error: "Category not found" })
    }

    // sort by order
    category.problems.sort((a, b) => a.order - b.order)

    res.status(200).json(category)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// CREATE category (admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name, description, problems, initialTime } = req.body

    const category = await new Category({
      name,
      description,
      problems,
      initialTime,
    })

    await category.save()
    res.status(201).json(category)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

