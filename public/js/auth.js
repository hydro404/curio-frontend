function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    // Add Secure and HttpOnly if the cookie should only be transmitted over HTTPS
    // Note that HttpOnly cannot be set via JavaScript for security reasons, as it is meant to be accessible only by the web server.
    document.cookie = name + "=" + (value || "") + expires + "; path=/; Secure; SameSite=Strict";
}

// Example of setting a token in a cookie
function saveToken(token) {
    setCookie('token', token, 7); // Set a cookie for 7 days
}


function getCookie(name) {
    let cookieArray = document.cookie.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name + "=") === 0) {
            return cookie.substring(name.length + 1, cookie.length);
        }
    }
    return "";
}



document.getElementById('login-btn').addEventListener('click', (event) => {
    event.preventDefault();

    const signInTab = document.querySelector("#signin-tab");
    const formData = new FormData(signInTab);

    $('#si-email').removeClass('is-invalid');
    $('#si-password').removeClass('is-invalid');
    $('#error-message').removeClass('d-block');

    if((formData.get('email') === '') || formData.get('password') === '') {
        if(formData.get('email') === '') {
            $('#si-email').addClass('is-invalid');
        }
        if(formData.get('password') === '') {
            $('#si-password').addClass('is-invalid');
        }
        return;
    }
    else{
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3001/signin',
            data: {
                email: formData.get('email'),
                password: formData.get('password')
            },
            success: (response) => {
                saveToken(response.token)
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Signed in successfully!",
                    showConfirmButton: false,
                    timer: 1500,
                    willClose: () => {
                      // Schedule the page reload to happen just after the Swal alert closes
                      setTimeout(() => {
                        window.location.reload();
                      }, 100); // Adding a short delay ensures the alert closes smoothly before the reload
                    }
                });
            },
            error: (error) => {
                $('#error-message').text('Invalid credentials');
                $('#error-message').addClass('d-block');
    
            }
        });
    }
    
});

document.getElementById('register-btn').addEventListener('click', (event) => {
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