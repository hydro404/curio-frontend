const axios = require("axios");
//dotenv
require("dotenv").config();

var SERVER_URL = process.env.SERVER_URL;

const addProduct = async (req, res) => {
  const cookieData = req.cookies.token;
  console.log(cookieData);
  const { name, description, price, category, stock } = req.body;
  const images = req.files.map((file) => file.filename);
  console.log(images);
  axios
    .post(
      `${SERVER_URL}/admin/products`,
      {
        name: name,
        description: description,
        price: price,
        category: category,
        stock: stock,
        images: images,
      },
      {
        headers: { authorization: `${cookieData}` },
      }
    )
    .then((response) => {
      res.redirect("/admin-update");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
};

module.exports = { addProduct };
