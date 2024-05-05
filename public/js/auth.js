document.getElementById('login-btn').addEventListener('click', (event) => {
    event.preventDefault();

    const signInTab = document.querySelector("#signin-tab");
    const formData = new FormData(signInTab);

    $.ajax({
        type: 'POST',
        url: 'http://localhost:3001/signin',
        data: {
            email: formData.get('email'),
            password: formData.get('password')
        },
        success: (response) => {
            if (response) {
                alert('Sign-in successful');
                console.log(response.message);
                console.log(response);
            } else {
                alert('Invalid credentials');
            }
        },
        error: (error) => {
            console.error('Sign-in error:', error);
            alert('Server error during sign-in');
        }
    });
});