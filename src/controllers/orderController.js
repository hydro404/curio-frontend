const axios = require("axios");
//dotenv
require("dotenv").config();

var SERVER_URL = process.env.SERVER_URL;

const approveCancelOrder = async (req, res) => {
  const cookieData = req.cookies.token;
  console.log("cookieData", cookieData)
  const { id, status} = req.body;
  try {
    const response = await axios.put(`${SERVER_URL}/admin/orders/${id}`, { status },
    {
      headers: { Authorization: `${cookieData}` },
    });
    if (response.data.status) {
      res.status(200).json({
        status: "success",
      });
    } else {
      res.status(400).send("Something went wrong");
    }
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).send("Server error during cancel order");
    console.log("error", error)
  }
};

const approveCancelOrder2 = async (req, res) => {
  const cookieData = req.cookies.token;
  console.log("cookieData", cookieData)
  const { id, status} = req.body;
  try {
    const response = await axios.put(`${SERVER_URL}/orders/${id}`, { status },
    {
      headers: { Authorization: `${cookieData}` },
    });
    if (response.data.status) {
      res.status(200).json({
        status: "success",
      });
    } else {
      res.status(400).send("Something went wrong");
    }
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).send("Server error during cancel order");
    console.log("error", error)
  }
};

module.exports = { approveCancelOrder, approveCancelOrder2 };
