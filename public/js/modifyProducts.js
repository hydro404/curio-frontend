$('#form-update-product').submit(function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    
    for(var pair of formData.entries()) {
        console.log(pair[0]+ ', '+ pair[1]); 
    }
    // id, name, description, price, category, stock
    $.ajax({
        url: '/updateProduct',
        type: 'POST',
        data: {
            id : formData.get('id'),
            name: formData.get('name'),
            category: formData.get('category'),
            price: formData.get('price'),
            stock: formData.get('stock'),
            description: formData.get('description'),
        },
        success: function(response) {
            if (response.status == 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Product updated successfully',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.reload();
                });
            } else {
                console.log(response)
                alert('Product not updated');
            }
        },
        error: function(error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.responseJSON.message,
        });
        }
    })
});