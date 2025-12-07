// ============= GLOBAL CART =============
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ============= SAVE CART =============
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ============= ADD TO CART =============
function addToCart(name, price, image) {
    const item = { name, price, image };
    cart.push(item);
    saveCart();
    alert(name + " added to cart!");
}

// ============= DISPLAY CART =============
function displayCart() {
    const cartContainer = document.getElementById("cart-items");
    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            <img src="${item.image}" alt="">
            <h3>${item.name}</h3>
            <p>₹${item.price}</p>
            <button class="removeItemBtn" data-index="${index}">Remove</button>
        `;

        cartContainer.appendChild(div);
    });

    document.querySelectorAll(".removeItemBtn").forEach(btn => {
        btn.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            cart.splice(index, 1);
            saveCart();
            displayCart();
        });
    });
}

// ============= CLEAR CART =============
function clearCart() {
    cart = [];
    saveCart();
    displayCart();
}

// ============= CHECKOUT =============
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    window.location.href = "payment.html";
}

// ============= EVENT LISTENERS (ONLY IF ELEMENTS EXIST) =============
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("cart-items")) {
        displayCart();
    }

    const clearBtn = document.getElementById("clearCartBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", clearCart);
    }

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", checkout);
    }
});
