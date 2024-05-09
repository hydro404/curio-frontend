const axios = require('axios');
require('dotenv').config();

var SERVER_URL = process.env.SERVER_URL;

const signIn = async (req, res) => {
    const { email, password } = req.body;
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
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).send('First name, last name, email, and password are required.');
    }
    console.log(req.body);

    axios.post(`${SERVER_URL}/signup`, {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password
    }).then(response => {
        console.log("Server response:", response.data);
        if (response.data.message === 'User registered successfully') {
            res.status(200).json({
                message: 'Sign-up successful',
            });
        } else {
            res.status(401).send('Sign-up failed. Please try again.');
        }
    }).catch(error => {
        console.error("Sign-up error:", error);
        if (error.response) {
            // Forward the error status code and message from the auth server to the client
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send("Server error during sign-up");
        }
    });
};

const updateProfile = async (req, res) => {
    const cookieData = req.cookies.token;

    const { firstname, lastname, phone } = req.body;
    console.log(req.body)
    if (!firstname || !lastname || !phone) {
        return res.status(400).send('First name, last name, and email are required.');
    }
    axios.put(`${SERVER_URL}/profile`, {
        firstname: firstname,
        lastname: lastname,
        phone: phone
    }, {
        headers: { Authorization: `${cookieData}` },
    }
    ).then(response => {
        if (response.data.status === 'success') {
            res.status(200).json({
                message: 'Profile updated successfully',
                status: 'success'
            });
        } else {
            res.status(401).send('Profile update failed. Please try again.');
        }
    }).catch(error => {
        console.error("Profile update error:", error);
        if (error.response) {
            // Forward the error status code and message from the auth server to the client
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send("Server error during profile update");
        }
    });
};

const changePassword = async (req, res) => {
    const cookieData = req.cookies.token;

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).send('Current password, new password, and confirm password are required.');
    }

    axios.post(`${SERVER_URL}/change-password`, {
        currentPassword: currentPassword,
        newPassword: newPassword,
    }, {
        headers: { Authorization: `${cookieData}` },
    }
    ).then(response => {
        if (response.data.status === 'success') {
            res.status(200).json({
                message: 'Password updated successfully',
                status: 'success'
            });
        } else {
            res.status(401).send('Password update failed. Please try again.');
        }
    }).catch(error => {
        console.error("Password update error:", error);
        if (error.response) {
            // Forward the error status code and message from the auth server to the client
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send("Server error during password update");
        }
    });
}

module.exports = { signIn, signUp, updateProfile, changePassword};
