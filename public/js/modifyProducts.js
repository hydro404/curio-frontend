// $('#add-product-form').submit(function(e) {
//     e.preventDefault();
//     var formData = new FormData(this);
    
//     for(var pair of formData.entries()) {
//         console.log(pair[0]+ ', '+ pair[1]); 
//     }

//     var image = document.getElementById('unp-product-files').files[0];

//     $.ajax({
//         url: '/addProduct',
//         type: 'POST',
//         data: {
//             name: formData.get('name'),
//             category: formData.get('category'),
//             images: image,
//             description: formData.get('description'),
//             stock: formData.get('stock'),
//             price: formData.get('price'),
//         },
//         success: function(response) {
//             if (response.status == 'success') {
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Product added successfully',
//                     showConfirmButton: false,
//                     timer: 1500
//                 });
//             } else {
//                 alert('Product not added');
//             }
//         },
//         error: function(error) {
//             console.log(error);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: error.responseJSON.message,
//         });
//         }
//     })
// });