document.addEventListener("DOMContentLoaded", () => {

    // ------- DISPLAY ORDER SUMMARY ------
    const summaryBox = document.getElementById("order-summary");
    if (summaryBox) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        summaryBox.innerHTML = cart
            .map(item => `<p>${item.name} - ₹${item.price}</p>`)
            .join("");

        if (cart.length === 0) summaryBox.innerHTML = "<p>Cart is empty</p>";
    }

    // ------- PAYMENT FORM --------
    const form = document.getElementById("payment-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const orderId = Math.floor(100000 + Math.random() * 900000);
            localStorage.removeItem("cart");

            window.location.href = `thankyou.html?orderId=${orderId}`;
        });
    }

    // ------- CART PAGE RENDER -------
    const cartContainer = document.getElementById("cart-items");
    if (cartContainer) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        let total = 0;

        cartContainer.innerHTML = cart
            .map((item, index) => {
                total += item.price;

                return `
                    <div class="cart-item">
                        <p>${item.name} – ₹${item.price}</p>
                        <button onclick="removeFromCart(${index})" class="btn secondary small">Remove</button>
                    </div>
                `;
            })
            .join("");

        document.getElementById("cart-total").textContent = total;
    }

});
