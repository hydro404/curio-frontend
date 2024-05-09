const express = require("express");
const router = express.Router();
const products = require("./products");
const cartItems = require("./cart-items");
const orders = require("./order-details");
const wishlist = require("./wishlist-items");
const userController = require("./src/controllers/userController");
const cartController = require("./src/controllers/cartController");
const productController = require("./src/controllers/productController");
const axios = require("axios");
require("dotenv").config();

const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json());
const serverURL = process.env.SERVER_URL;

const getUserDetailsMiddleware = (req, res, next) => {
  const cookieData = req.cookies.token;
  // console.log(cookieData);
  res.locals.loggedIn = false;
  const config = {
    headers: {
      Authorization: `${cookieData}`,
    },
  };

  if (cookieData) {
    // console.log(cookieData);
    axios
      .get(`${serverURL}/profile`, {
        headers: { Authorization: `${cookieData}` },
      })
      .then((response) => {
        res.locals.userDetails = {
          id: response.data.id,
          email: response.data.email,
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          phone: response.data.phone,
        };
        res.locals.loggedIn = true;
        return axios
          .get(`${serverURL}/cart`, {
            headers: {
              Authorization: `${cookieData}`,
            },
          })
          .then((cartResponse) => {
            res.locals.cartItems = cartResponse.data;
            // console.log(res.locals.cartItems);
            return axios
              .get(`${serverURL}/products`)
              .then((response) => {
                // console.log(response.data);
                res.locals.products = response.data;
                var products = response.data;
                res.locals.totalProducts = products.length;
                res.locals.topProducts = products.slice(0, 8);
                res.locals.totalCartItems = res.locals.cartItems.length;
                next();
              })
              .catch((error) => {
                // console.log(error);
                res.status(500).send("Internal Server Error");
              });
          })
          .catch((error) => {
            res.locals.cartItems = [];
            next();
          });
      })
      .catch((error) => {
        axios
          .get(`${serverURL}/products`)
          .then((response) => {
            res.locals.products = response.data;
            var products = response.data;
            res.locals.totalProducts = products.length;
            res.locals.topProducts = products.slice(0, 8);
            res.locals.totalCartItems = 0;
            console.log("No token available in cookies");
            res.locals.userDetails = {
              email: "",
              firstname: "",
              lastname: "",
              contact_number: "",
            };
            res.locals.cartItems = [];
            res.locals.loggedIn = false;
            next();
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send("Internal Server Error");
          });
      });
  } else {
    axios
      .get(`${serverURL}/products`)
      .then((response) => {
        res.locals.products = response.data;
        var products = response.data;
        res.locals.totalProducts = products.length;
        res.locals.topProducts = products.slice(0, 8);
        res.locals.totalCartItems = 0;
        console.log("No token available in cookies");
        res.locals.userDetails = {
          email: "",
          firstname: "",
          lastname: "",
          contact_number: "",
        };
        res.locals.cartItems = [];
        res.locals.loggedIn = false;
        next();
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Internal Server Error");
      });
  }
};

router.post("/signin", userController.signIn);
router.post("/signup", userController.signUp);
router.post("/addToCart", cartController.addToCart);
router.post("/filterProducts", productController.filterProducts);
router.put("/updateProfile", userController.updateProfile);
router.post("/updatePassword", userController.changePassword);
router.delete("/removeFromCart", cartController.removeFromCart);

// Calculate the total number of products in cart
const totalCartItems = cartItems.length;

// Extract unique categories from all products
const categories = [...new Set(products.map((product) => product.category))];

// Group products by category
const groupedProducts = products.reduce((acc, product) => {
  acc[product.category] = (acc[product.category] || 0) + 1;
  return acc;
}, {});

router.get("/", getUserDetailsMiddleware, (req, res) => {
  res.render("index", {
    title: "Home | Curio 4552",
    products: res.locals.topProducts,
    categories: categories, // Pass extracted categories to the template
    totalProducts: res.locals.totalProducts,
    cartItems: res.locals.cartItems,
    totalCartItems: res.locals.totalCartItems,
    loggedIn: res.locals.loggedIn,
  });
});

router.get("/products", getUserDetailsMiddleware, (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page, default is 1
  const pageSize = 100; // Number of items per page

  // Calculate start and end indices for slicing the products array
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  axios
    .get(`${serverURL}/categories`)
    .then((response) => {
      const categories = response.data;
      return axios
        .get(`${serverURL}/products`)
        .then((response) => {
          const products = response.data;
          console.log(categories, products);
          // Slice the products array to get products for the current page
          const paginatedProducts = products.slice(startIndex, endIndex);
          const totalPages = Math.ceil(products.length / pageSize);

          res.render("products", {
            title: "Products | Curio 4552",
            paginatedProducts: paginatedProducts,
            page: page,
            totalPages: totalPages,
            products: products,
            categories: categories,
            totalProducts: res.locals.totalProducts,
            cartItems: res.locals.cartItems,
            totalCartItems: res.locals.totalCartItems,
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send("Internal Server Error");
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
});

router.get("/product", getUserDetailsMiddleware, (req, res) => {
  const productId = parseInt(req.query.id); 
  axios.get(`${serverURL}/products/${productId}`)
  .then((response) => {
    const product = response.data;
    const totalCartItems = res.locals.cartItems.length;
    if (product) {
      res.render("single-product", {
        title: product.name,
        product: product,
        categories: categories, // Pass extracted categories to the template
        totalProducts: res.locals.totalProducts,
        cartItems: res.locals.cartItems,
        totalCartItems: res.locals.totalCartItems,
        totalCartItems: totalCartItems,
      });
    } else {
      res.status(404).send("Product not found");
    }
  });
  
});

router.get("/cart", getUserDetailsMiddleware, (req, res) => {
  const totalCartItems = res.locals.cartItems.length;
  res.render("cart", {
    title: "Cart | Curio 4552",
    categories: categories, // Pass extracted categories to the template
    totalProducts: res.locals.totalProducts,
    cartItems: res.locals.cartItems,
    totalCartItems: totalCartItems,
  });
});

router.get("/account-orders", getUserDetailsMiddleware, (req, res) => {
  const cookieData = req.cookies.token;
  const ordersPerPage = 100;
  const currentPage = req.query.page || 1;

  // Calculate total number of pages
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  if (res.locals.loggedIn) {
    axios.get(`${serverURL}/orders`, { headers: { Authorization: `${cookieData}` },})
    .then((response) => {
      const ordersOnPage = response.data;
      res.render("orders", {
        title: "Orders | Curio 4552",
        categories: categories, // Pass extracted categories to the template
        totalProducts: res.locals.totalProducts,
        cartItems: res.locals.cartItems,
        totalCartItems: res.locals.totalCartItems,
        ordersOnPage: ordersOnPage,
        currentPage: currentPage,
        totalPages: totalPages,
      });
    });

    
  } else {
    res.redirect("/");
  }
});

router.get("/change-password", getUserDetailsMiddleware, (req, res) => {
  res.render("change-password", {
    title: "Change Password | Curio 4552",
    categories: categories, // Pass extracted categories to the template
    totalProducts: res.locals.totalProducts,
    cartItems: res.locals.cartItems,
    totalCartItems: res.locals.totalCartItems,
  });
});

// router.get("/account-wishlist", getUserDetailsMiddleware, (req, res) => {
//   res.render("wishlist", {
//     title: "Wishlist | Curio 4552",
//     categories: categories, // Pass extracted categories to the template
//     totalProducts: totalProducts,
//     cartItems,
//     totalCartItems,
//     wishlist: wishlist,
//   });
// });

router.get("/account-profile-info", getUserDetailsMiddleware, (req, res) => {
  res.render("profile-info", {
    title: "Profile | Curio 4552",
    categories: categories,
    totalProducts: res.locals.totalProducts,
    cartItems: res.locals.cartItems,
    totalCartItems: res.locals.totalCartItems,
    userDetails: res.locals.userDetails,
  });
  
});

router.get("/checkout", getUserDetailsMiddleware, (req, res) => {
  res.render("checkout", {
    title: "Checkout | Curio 4552",
    categories: categories, // Pass extracted categories to the template
    totalProducts: totalProducts,
    cartItems,
    totalCartItems,
  });
});

router.get("/checkout-complete", getUserDetailsMiddleware, (req, res) => {
  res.render("checkout-complete", {
    title: "Checkout | Curio 4552",
    categories: categories, // Pass extracted categories to the template
    totalProducts: totalProducts,
    cartItems,
    totalCartItems,
  });
});

router.get("/account-login", getUserDetailsMiddleware, (req, res) => {
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
