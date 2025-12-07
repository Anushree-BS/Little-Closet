/* =====================================================
   UNIVERSAL CART + PAYMENT + ORDER ID HANDLER
   ===================================================== */

// ---------------- CART STORAGE ----------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const count = document.getElementById("cart-count");
    if (count) count.textContent = cart.length;
}
updateCartCount();


// ---------------- ADD TO CART ----------------
function addToCart(name, price) {
    cart.push({ name, price });
    saveCart();
    updateCartCount();
    alert(`${name} added to cart!`);
}


// ---------------- REMOVE FROM CART ----------------
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    window.location.reload();
}


// ---------------- CART PAGE DISPLAY ----------------
if (document.getElementById("cart-items")) {

    const container = document.getElementById("cart-items");
    let total = 0;

    container.innerHTML = cart
        .map((item, index) => {
            total += item.price;
            return `
                <div class="cart-item">
                    <p><strong>${item.name}</strong><br>₹${item.price}</p>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
            `;
        })
        .join("");

    document.getElementById("cart-total").textContent = total;
}


// ---------------- PAYMENT PAGE SUMMARY ----------------
if (document.getElementById("summary-items")) {
    let summaryHTML = "";
    let total = 0;

    cart.forEach(item => {
        summaryHTML += `<p>${item.name} - ₹${item.price}</p>`;
        total += item.price;
    });

    document.getElementById("summary-items").innerHTML = summaryHTML;
    document.getElementById("summary-total").textContent = total;
}


// ---------------- PROCESS ORDER ----------------
function processOrder(event) {
    event.preventDefault();

    const orderId = "TK" + Math.floor(Math.random() * 90000 + 10000);

    localStorage.removeItem("cart");

    window.location.href = `thankyou.html?orderId=${orderId}`;
    return false;
}


// ---------------- THANK YOU PAGE ORDER ID ----------------
if (document.getElementById("order-id")) {
    const url = new URLSearchParams(window.location.search);
    document.getElementById("order-id").textContent =
        url.get("orderId") || "N/A";
}
