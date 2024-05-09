const axios = require('axios');
//dotenv
require('dotenv').config();

var SERVER_URL = process.env.SERVER_URL;

const addtoCart = (req, res) => {
    const token = req.cookies.token;
    const product_id = req.body.product_id;
    const quantity = req.body.quantity;
    const variation = req.body.variation;

    if (token) {
        axios.post(`${SERVER_URL}/api/renter/cart/add-to-cart/buy`, {
            token: token,
            product_id: product_id,
            quantity: quantity,
            variation: variation,
        })
        .then(axiosResponse => {
            const message = axiosResponse.data.message.message
            console.log(message)
            return axios.post(`${SERVER_URL}/api/renter/cart`, {
                token: token
            })
            .then(cartResponse => {
                req.session.cartArray = cartResponse.data.message.data.items;
                res.send({ message: message, cartArray: req.session.cartArray });
            })
        })
        .catch(error => {
            res.send({ errorMessage: error.response.data.message });
            console.log(error.response.data.message);
        });
    }
};

const filterProducts = (req, res) => {
    const category = req.body.category || All;

    axios.post(`${SERVER_URL}/product-filter`, {
        category: category
    })
    .then(axiosResponse => {
        const products = axiosResponse.data;
        res.send({ products: products });
    })
    .catch(error => {
        res.send({ errorMessage: error.response.data});
        console.log(error.response.data);
    });
};

module.exports = { addtoCart, filterProducts };