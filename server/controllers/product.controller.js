const Product = require("../Models/product.model.js");

const createProduct = async (req, res) => {
    try {
        const newProduct = new Product({
            name: req.body.name,
            materials: req.body.materials,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({
            message: "Product created successfully",
            data: savedProduct,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Product creation failed",
            error: err,
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found!",
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Product update failed",
            error: err,
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { deleted_at: new Date() },  
            { new: true }
        );

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json({
            message: "Product marked as deleted",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Product deletion failed!",
            error: error.message,
        });
    }
};


const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        res.status(200).json({
            message: "Product retrieved successfully",
            data: product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Product query failed",
            error: error,
        });
    }
};

const getAllProducts = async (req, res) => {
    const query = req.query.latest;
    try {
        const products = query
            ? await Product.find().sort({ _id: -1 }).limit(3)
            : await Product.find();

        res.status(200).json({
            message: "Products retrieved successfully",
            data: products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Products query failed",
            error: error,
        });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getAllProducts,
};
