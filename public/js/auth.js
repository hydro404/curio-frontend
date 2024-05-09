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

var loginBtn = document.getElementById('login-btn');

if(loginBtn){
    loginBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const signInTab = document.querySelector("#signin-tab");
        const formData = new FormData(signInTab);

        $('#si-email').removeClass('is-invalid');
        $('#si-password').removeClass('is-invalid');
        $('#error-message').removeClass('d-block');

        const dataObj = {};

        formData.forEach((value, key) => {
            dataObj[key] = value;
        });

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
                url: '/signin',
                data: dataObj,
                success: (response) => {
                    if (response.token) {
                        saveToken(response.token);
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Signed in successfully!",
                            showConfirmButton: false,
                            timer: 1500,
                            willClose: () => {
                                setTimeout(() => {
                                    window.location.reload();
                                }, 100);
                            }
                        });
                    } else {
                        // Handle cases where the token is not present in the response
                        $('#error-message').text('Sign-in failed, token not provided.');
                        $('#error-message').addClass('d-block');
                    }
                },
                error: (error) => {
                    $('#error-message').text('Invalid credentials');
                    $('#error-message').addClass('d-block');
                }
            });
        }
    });
}

var registerBtn = document.getElementById('register-btn');

if(registerBtn){
    registerBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const signUpTab = document.querySelector("#signup-tab");
    const formData = new FormData(signUpTab);

    // Reset validation states
    $('#su-fname, #su-lname, #su-email, #su-password, #su-password-confirm').removeClass('is-invalid');
    $('#error-message').removeClass('d-block');

    const dataObj = {};

    formData.forEach((value, key) => {
        dataObj[key] = value;
        console.log(key, value)
    });

    // Check for empty fields
    if (!formData.get('firstname') || !formData.get('lastname') || !formData.get('email') || !formData.get('password') || $('#su-password-confirm').val() === ''){
        if (!formData.get('firstname')) {
            $('#su-fname').addClass('is-invalid');
        }
        if (!formData.get('lastname')) {
            $('#su-lname').addClass('is-invalid');
        }
        if (!formData.get('email')) {
            $('#su-email').addClass('is-invalid');
        }
        if (!formData.get('password')) {
            $('#su-password').addClass('is-invalid');
        }
        if ($('#su-password-confirm').val() === '') {
            $('#su-password-confirm').addClass('is-invalid');
        }
        console.log("May Mali")
        return;
    } if (formData.get('password') !== $('#su-password-confirm').val()) {
        $('#su-password, #su-password-confirm').addClass('is-invalid');
        console.log("Passwords don't match")
        return;
    } else {
        $.ajax({
            type: 'POST',
            url: '/signup',
            data: dataObj,
            success: (response) => {
                console.log(response)
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Signed up successfully!",
                    showConfirmButton: false,
                    timer: 1500,
                    willClose: () => {
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                    }
                });
            },
            error: (error) => {
                console.log(error);
                $('#error-message').text('Sign-up failed, please check your details and try again.');
                $('#error-message').addClass('d-block');
            }
        });
    }
});
}
