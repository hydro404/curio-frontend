const axios = require('axios');
//dotenv
require('dotenv').config();

var SERVER_URL = process.env.SERVER_URL;


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

// admin add product


module.exports = { filterProducts };