
function checkout(){
//     checkout-fn
// checkout-ln
// checkout-email
// checkout-phone
// checkout-address-1
// checkout-address-2
// city
// province
// checkout-zip
// ="Nationwide Delivery"
// radio
// total

    var fn = document.getElementById('checkout-fn').value;
    var ln = document.getElementById('checkout-ln').value;
    var email = document.getElementById('checkout-email').value;
    var phone = document.getElementById('checkout-phone').value;
    var address1 = document.getElementById('checkout-address-1').value;
    var address2 = document.getElementById('checkout-address-2').value;
    var city = document.getElementById('city').value;
    var province = document.getElementById('province').value;
    var zip = document.getElementById('checkout-zip').value;
    var delivery = 'Nationwide Delivery';

    var selectedRadio = document.querySelector('input[name="payment-method"]:checked');
    if (selectedRadio) {
        var payment = selectedRadio.value;
    }
    var total = document.getElementById('orderTotal').value;
    total = parseFloat(total);

    var data = {
        firstname: fn,
        lastname: ln,
        email: email,
        phone: phone,
        address1: address1,
        address2: address2,
        city: city,
        province: province,
        zipcode: zip,
        courier: delivery,
        payment: payment,
        total: total
    };

    $.ajax({
        type: "POST",
        url: "/checkout",
        data: data,
        success: function (data) {
            console.log('Checkout success:', data);
            if (data.status === 'success') {
                Swal.fire({
                    title: 'Checkout Success',
                    text: 'Thank you for your order!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 1500
                }).then(() => {
                    window.location.href = '/account-orders';
                })
            } else {
                alert('Something went wrong');
            }
        },
        error: function (error) {
            console.error('Checkout error:', error);
            alert('Server error during checkout');
        }
    });

}
