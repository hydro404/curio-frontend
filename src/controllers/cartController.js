const axios = require('axios');
//dotenv
require('dotenv').config();

var SERVER_URL = process.env.SERVER_URL;

const addToCart = async (req, res) => {
    const cookieData = req.cookies.token;
    const { product_id, quantity, variation } = req.body;
    if (!variation || !product_id  || !quantity) {
        return res.status(400).send('ID and quantity are required.');
    }

    try {
        const response = await axios.post(`${SERVER_URL}/cart`, { product_id, quantity, variation },
        {
            headers: { Authorization: `${cookieData}` },
        }
        );
        if (response.data.status === "success") {
            res.status(200).json({
                message: 'Added to cart',
                status: 'success',
            });
        } else {
            res.status(400).send('Something went wrong');
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).send('Server error during add to cart');
    }
};

const removeFromCart = async (req, res) => {
    const cookieData = req.cookies.token;
    const { product_id } = req.body;
    console.log(product_id);
    if (!product_id) {
        return res.status(400).send('ID is required.');
    }

    try {
        const response = await axios.delete(`${SERVER_URL}/cart/${product_id}`,
        {
            headers: { Authorization: `${cookieData}` },
        }
        );
        if (response.data.status === "success") {
            res.status(200).json({
                message: 'Removed from cart',
                status: 'success',
            });
        } else {
            res.status(400).send('Something went wrong');
        }
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).send('Server error during remove from cart');
    }
}

module.exports = { addToCart, removeFromCart};
