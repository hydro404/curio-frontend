document.addEventListener("DOMContentLoaded", function () {
  const orderLinks = document.querySelectorAll(".nav-link-style");

  orderLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default link behavior
      const orderNo = this.textContent.trim(); // Get the order number from the link text
      fetchOrderDetails(orderNo); // Fetch order details using the order number
    });
  });

  // Function to fetch order details and update modal content
  function fetchOrderDetails(orderNo) {
    // Fetch order details from the server endpoint
    fetch(`/order-details/${orderNo}`)
      .then((response) => response.json())
      .then((order) => {
        // Update modal content with order details
        updateModalContent(order);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
      });
  }

  // Function to update modal content with order details
  function updateModalContent(order) {
    // Update modal title with order number
    const modalTitle = document.querySelector(".modal-title");
    modalTitle.textContent = "Order No - " + order.order_no;

    // Update modal body with order details
    const modalBody = document.querySelector("#order-modal-body");
    // Clear previous content
    modalBody.innerHTML = "";

    // Generate HTML for each detail and append to modal body
    order.details.forEach((detail) => {
      const itemHtml = `
          <!-- Item -->
          <div class="d-sm-flex justify-content-between mb-4 pb-3 pb-sm-2 border-bottom">
                <div class="d-sm-flex text-center text-sm-start"><a class="d-inline-block flex-shrink-0 mx-auto" href="/product?id=${detail.id}" style="width: 10rem;"><img src="img/${detail.image[0]}" alt="${detail.name}"></a>
                  <div class="ps-sm-4 pt-2">
                    <h3 class="product-title fs-base mb-2"><a href="/product?id=${detail.id}">${detail.name}</a></h3>
                    <div class="fs-sm"><span class="text-muted me-2">Size:</span>${detail.size}</div>
                    <div class="fs-lg text-accent pt-2">&#8369;${detail.price}</div>
                  </div>
                </div>
                <div class="pt-2 ps-sm-3 mx-auto mx-sm-0 text-center">
                  <div class="text-muted mb-2">Quantity:</div>${detail.qty}
                </div>
                <div class="pt-2 ps-sm-3 mx-auto mx-sm-0 text-center">
                  <div class="text-muted mb-2">Subtotal</div>&#8369;${detail.subtotal}
                </div>
              </div>
        `;
      // Append itemHtml to modal body
      modalBody.innerHTML += itemHtml;
    });

    // Update modal footer with order totals
    const modalFooter = document.querySelector(".modal-footer");
    modalFooter.innerHTML = `
        <!-- Footer -->
        <div class="modal-footer flex-wrap justify-content-between bg-secondary fs-md">
          <div class="px-2 py-1"><span class="text-muted">Subtotal:&nbsp;</span><span>&#8369;${
            order.order_total
          }</span></div>
          <div class="px-2 py-1"><span class="text-muted">Shipping:&nbsp;</span><span>&#8369;${
            order.shipping_fee
          }</span></div>
          <div class="px-2 py-1"><span class="text-muted">Total:&nbsp;</span><span class="fs-lg">&#8369;${(
            parseFloat(order.order_total) + parseFloat(order.shipping_fee)
          ).toFixed(2)}</span></div>
        </div>
      `;
  }

  // Now, add your additional code here without modifying the existing one
});
