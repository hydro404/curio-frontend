const express = require("express");
const router = express.Router();
const products = require("./products");
const cartItems = require("./cart-items");
const orders = require("./order-details");
const wishlist = require("./wishlist-items");
const userController = require("./src/controllers/userController");
const axios = require("axios");
require("dotenv").config();

const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
const serverURL = process.env.SERVER_URL;

const getUserDetailsMiddleware = (req, res, next) => {
  const cookieData = req.cookies.token;
  console.log(cookieData);
  res.locals.loggedIn = false;
  const config = {
    headers: {
      'Authorization': `Bearer ${cookieData}`
    },
  };

  if (cookieData) {
    axios
      .get(`${serverURL}/profile`, config)
      .then((response) => {
        res.locals.userDetails = {
          "email": response.data.user.email,
          "first_name": response.data.user.first_name,
          "last_name": response.data.user.last_name,
          "contact_number": response.data.user.contact_number,
        };
        res.locals.loggedIn = true;
        next();
      })
      .catch((error) => {
        res.locals.userDetails = {
          user : {
            "email": "",
            "firstname": "",
            "lastname": "",
            "contact_number": "",
          }
        };
        res.locals.loggedIn = false;
        next();
      });
  }
  else{
      console.log('No token available in cookies');
      res.locals.userDetails = {
          user : {
              "email": "",
              "firstname": "",
              "lastname": "",
              "contact_number": "",
          }
      };
      res.locals.loggedIn = false;
      return next();
  }
};

router.post("/signin", userController.signIn);
// Calculate the total number of products in cart
const totalCartItems = cartItems.length;

// Calculate the total number of products
const totalProducts = products.length;

// Extract unique categories from all products
const categories = [...new Set(products.map((product) => product.category))];

// Group products by category
const groupedProducts = products.reduce((acc, product) => {
  acc[product.category] = (acc[product.category] || 0) + 1;
  return acc;
}, {});

router.get("/", getUserDetailsMiddleware, (req, res) => {
  const sortedProducts = products.sort(
    (a, b) => b.salesQuantity - a.salesQuantity
  );
  const topProducts = sortedProducts.slice(0, 8);

  res.render("index", {
    title: "Curio 4552",
    products: topProducts, // Pass top 8 products to the template
    categories: categories, // Pass extracted categories to the template
    totalProducts: totalProducts, // Pass total number of products to the template
    cartItems,
    totalCartItems,
  });
});

router.get("/products", (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page, default is 1
    const pageSize = 12; // Number of items per page

    // Calculate start and end indices for slicing the products array
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    // Slice the products array to get products for the current page
    const paginatedProducts = products.slice(startIndex, endIndex);

    // Calculate total number of pages
    const totalPages = Math.ceil(products.length / pageSize);

    res.render("products", {
      title: "Products | Curio 4552",
      paginatedProducts: paginatedProducts,
      page: page,
      totalPages: totalPages,
      categories: categories, // Pass extracted categories to the template
      totalProducts: totalProducts,
      groupedProducts: Object.entries(groupedProducts), // Pass grouped products to the template as an array of entries
      cartItems,
      totalCartItems,
    });
  } catch (error) {
    // If there's an error, return an error response
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/product", (req, res) => {
  const productId = parseInt(req.query.id);
  const product = products.find((product) => product.id === productId);

  if (product) {
    res.render("single-product", {
      title: product.name,
      product: product,
      categories: categories, // Pass extracted categories to the template
      totalProducts: totalProducts,
      cartItems,
      totalCartItems,
    });
  } else {
    res.status(404).send("Product not found");
  }
});

router.get("/cart", (req, res) => {
  res.render("cart", {
    title: "Cart | Curio 4552",
    categories: categories, // Pass extracted categories to the template
    totalProducts: totalProducts,
    cartItems,
    totalCartItems,
  });
});

router.get("/account-orders", (req, res) => {
  const ordersPerPage = 5;
  const currentPage = req.query.page || 1;
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const ordersOnPage = orders.slice(startIndex, endIndex);

  // Calculate total number of pages
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  res.render("orders", {
    title: "Orders | Curio 4552",
    categories: categories, // Pass extracted categories to the template
    totalProducts: totalProducts,
    cartItems,
    totalCartItems,
    ordersOnPage: ordersOnPage,
    currentPage: currentPage,
    totalPages: totalPages,
  });
});

router.get("/account-wishlist", (req, res) => {
  res.render("wishlist", {
    title: "Wishlist | Curio 4552",
    categories: categories, // Pass extracted categories to the template
    totalProducts: totalProducts,
    cartItems,
    totalCartItems,
    wishlist: wishlist,
  });
});

router.get("/account-profile-info", getUserDetailsMiddleware, (req, res) => {
  res.render("profile-info", {
    title: "Profile | Curio 4552",
    categories: categories, // Pass extracted categories to the template
    totalProducts: totalProducts,
    cartItems,
    totalCartItems,
  });
});

router.get("/checkout", (req, res) => {
  res.render("checkout", {
    title: "Checkout | Curio 4552",
    categories: categories, // Pass extracted categories to the template
    totalProducts: totalProducts,
    cartItems,
    totalCartItems,
  });
});

router.get("/checkout-complete", (req, res) => {
  res.render("checkout-complete", {
    title: "Checkout | Curio 4552",
    categories: categories, // Pass extracted categories to the template
    totalProducts: totalProducts,
    cartItems,
    totalCartItems,
  });
});

router.get("/account-login", (req, res) => {
  res.render("user-signin", {
    title: "Login | Curio 4552",
    categories: categories, // Pass extracted categories to the template
    totalProducts: totalProducts,
    cartItems,
    totalCartItems,
  });
});

router.get("/admin", (req, res) => {
  res.render("admin-index", {
    title: "Admin | Curio 4552",
  });
});

router.get("/admin-add-product", (req, res) => {
  res.render("admin-add-products", {
    title: "Admin | Curio 4552",
  });
});

router.get("/admin-update", (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page, default is 1
    const pageSize = 8; // Number of items per page

    // Calculate start and end indices for slicing the products array
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    // Slice the products array to get products for the current page
    const paginatedProducts = products.slice(startIndex, endIndex);

    const product_category = req.query.product_category; // Retrieve product-category value from request

    // Calculate total number of pages
    const totalPages = Math.ceil(products.length / pageSize);
    res.render("admin-update", {
      title: "Admin | Curio 4552",
      products: products,
      paginatedProducts: paginatedProducts,
      page: page,
      totalPages: totalPages,
      categories: categories,
      product_category: product_category,
    });
  } catch (error) {
    // If there's an error, return an error response
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
