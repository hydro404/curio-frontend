const axios = require('axios');
//dotenv
require('dotenv').config();

var SERVER_URL = process.env.SERVER_URL;

const addProduct = async (req, res) => {
    const cookieData = req.cookies.token;
    const { name, price, category, description, image } = req.body;
    if (!name || !price || !category || !description || !image) {
        return res.status(400).json({
            message: 'Name, price, category, description, and image are required.',
            status: 'error',
        }
            
        );
    }

    try {
        const response = await axios.post(`${SERVER_URL}/admin/products`, { name, price, category, description, image }, 
        {
            headers: { Authorization: `${cookieData}` },
        }
        );
        if (response.data.status === "success") {
            res.status(200).json({
                message: 'Product added',
                status: 'success',
            });
        } else {
            res.status(400).send('Something went wrong');
        }
    } catch (error) {
        console.error('Add product error:', error);
        res.status(500).send('Server error during add product');
    }
}

module.exports = { addProduct };