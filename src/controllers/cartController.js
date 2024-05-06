const axios = require('axios');
//dotenv
require('dotenv').config();

var SERVER_URL = process.env.SERVER_URL;

const addToCart = async (req, res) => {
    const { id, quantity } = req.body;
    if (!id || !quantity) {
        return res.status(400).send('ID and quantity are required.');
    }

    try {
        const response = await axios.post(`${SERVER_URL}/addToCart`, { id, quantity });
        if (response.data.message === 'Added to cart') {
            res.status(200).json({
                message: 'Added to cart'
            });
        } else {
            res.status(400).send('Something went wrong');
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).send('Server error during add to cart');
    }
};

module.exports = { addToCart };
