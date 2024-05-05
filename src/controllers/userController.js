const axios = require('axios');

const signIn = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    try {
        const response = await axios.post('https://example.com/api/signin', { email, password });
        if (response.data.success) {
            res.status(200).json({
                message: 'Sign-in successful',
                token: response.data.token
            });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Sign-in error:', error);
        res.status(500).send('Server error during sign-in');
    }
};

module.exports = { signIn };
