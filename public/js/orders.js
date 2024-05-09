function seeOrder(object){
    console.log(JSON.parse(object));
    $('#order-modal-body').text('');
    var id = JSON.parse(object);
    var subtotal = parseInt(id.total) - 60;
    $('#subtotalModal').text('₱'+ subtotal );
    $('#shippingModal').text("₱60.00");
    $('#totalModal').text('₱' + id.total)

    id.items.forEach(function(item){
        var total = (parseInt(item.price) * parseInt(item.quantity)) + 60;
        var subtotal2 = parseInt(total) - 60;
        var product = `
        <div class="d-sm-flex justify-content-between mb-4 pb-3 pb-sm-2 border-bottom">
                <div class="d-sm-flex text-center text-sm-start">
                  <div class="ps-sm-4 pt-2">
                    <h3 class="product-title fs-base mb-2"><a href="shop-single-v1.html">${item.name}</a></h3>
                    <div class="fs-sm"><span class="text-muted me-2">Variation:</span>${item.variation}</div>
                    <div class="fs-lg text-accent pt-2">${item.price}.<small>00</small></div>
                  </div>
                </div>
                <div class="pt-2 ps-sm-3 mx-auto mx-sm-0 text-center">
                  <div class="text-muted mb-2">Quantity:</div>${item.quantity}
                </div>
                <div class="pt-2 ps-sm-3 mx-auto mx-sm-0 text-center">
                  <div class="text-muted mb-2">Subtotal</div>₱${subtotal2}<small>.00</small>
                </div>
        </div>
        `;
        $('#order-modal-body').append(product);
    });
    $('#order-details').modal('show');
}