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


function addToCart(id){
    
    var user_id = $('#user_id').val();
    //ajax
    $.ajax({
        type: 'POST',
        url: '/addToCart',
        data: {
            user_id: user_id,
            product_id: id,
            quantity: 1
        },
        success: (response) => {
            console.log(response);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Added to cart!",
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
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Something went wrong",
                showConfirmButton: false,
                timer: 1500,
                willClose: () => {
                    // Schedule the page reload to happen just after the Swal alert closes
                    setTimeout(() => {
                        window.location.reload();
                    }, 100); // Adding a short delay ensures the alert closes smoothly before the reload
                }
            });
        }
    });
}