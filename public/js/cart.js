function addToCart(id){
    //ajax
    $.ajax({
        type: 'POST',
        url: '/addToCart',
        data: {
            id: id,
            quantity: 1
        },
        success: (response) => {
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