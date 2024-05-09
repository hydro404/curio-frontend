const axios = require('axios');
//dotenv
require('dotenv').config();

var SERVER_URL = process.env.SERVER_URL;

const addToCart = async (req, res) => {
    const cookieData = req.cookies.token;
    const { product_id, quantity, variation } = req.body;
    console.log(cookieData)
    console.log(req.body)
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

module.exports = { addToCart };
