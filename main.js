// ---------------- CART LOGIC ---------------- //

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart to storage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart number in navbar
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const counter = document.getElementById("cart-count");
  if (counter) counter.innerText = count;
}
updateCartCount();

// Add item to cart
function addToCart(name, price) {
  let item = cart.find(i => i.name === name);

  if (item) {
    item.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  saveCart();
  updateCartCount();
  alert("Item added to cart!");
}

// Load Cart Items in cart.html
function loadCart() {
  const container = document.getElementById("cart-items");
  const totalBox = document.getElementById("cart-total");

  if (!container) return;

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    container.innerHTML += `
      <div class="cart-item">
        <strong>${item.name}</strong>
        <span>₹${item.price} × ${item.quantity}</span>
      </div>
    `;
  });

  totalBox.innerText = total;
}

// Clear Cart
function clearCart() {
  cart = [];
  saveCart();
  loadCart();
  updateCartCount();
}

// Checkout → go to payments
function goToCheckout() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }
  window.location.href = "payments.html";
}

// Payment → go to thankyou
function makePayment() {
  localStorage.removeItem("cart");
  window.location.href = "thankyou.html";
}
