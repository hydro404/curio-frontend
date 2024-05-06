const axios = require('axios');
require('dotenv').config();

var SERVER_URL = process.env.SERVER_URL;

const signIn = async (req, res) => {
    const { email, password } = req.body;
    console.log("Received:", email, password);
    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    axios.post(`${SERVER_URL}/signin`, {
        email: email,
        password: password
    }).then(response => {
        console.log("Server response:", response.data);
        if (response.data && response.data.token) {
            res.status(200).json({
                message: 'Sign-in successful',
                token: response.data.token
            });
        } else {
            // handle cases where response from auth server does not contain a token
            res.status(401).send('Invalid credentials');
        }
    }).catch(error => {
        console.error("Sign-in error:", error);
        if (error.response) {
            // Forward the error status code and message from the auth server to the client
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send("Server error during sign-in");
        }
    });
};

const signUp = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    if(!firstname || !lastname || !email || !password){
        return res.status(400).send('All fields are required.');
    }

    axios.post(`${SERVER_URL}/signup`, {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password
    })
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.error(error);
    });
};

module.exports = { signIn };
