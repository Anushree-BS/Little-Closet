// ---------------- ORDER SUMMARY (Payments Page) ----------------

let cart = JSON.parse(localStorage.getItem("cart")) || [];

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

    const orderId = "TK" + Math.floor(Math.random() * 100000);

    localStorage.removeItem("cart");

    window.location.href = `thankyou.html?orderId=${orderId}`;
    return false;
}

// ---------------- THANK YOU PAGE: SHOW ORDER ID ----------------

if (document.getElementById("order-id")) {
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById("order-id").textContent =
        urlParams.get("orderId") || "N/A";
}
