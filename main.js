/* main.js
   Single source of truth for cart + payments + orderID.
   Uses localStorage for cart persistence.
*/

(() => {
  // ---------- CART STORAGE ----------
  let cart = JSON.parse(localStorage.getItem('tk_cart') || '[]');

  function saveCart() {
    localStorage.setItem('tk_cart', JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    const els = document.querySelectorAll('#cart-count');
    els.forEach(el => el.textContent = cart.length);
  }

  updateCartCount();

  // expose addToCart to global scope (used by inline onclick in HTML)
  window.addToCart = function(name, price, img) {
    // basic validation
    if (!name || !price) return;
    cart.push({ name, price: Number(price), img: img || '' });
    saveCart();
    // small playful toast using alert fallback (silent)
    try {
      // small non-blocking notification using DOM (if available)
      const toast = document.createElement('div');
      toast.className = 'mini-toast';
      toast.textContent = `${name} added to cart`;
      document.body.appendChild(toast);
      setTimeout(() => toast.classList.add('visible'), 20);
      setTimeout(() => toast.classList.remove('visible'), 1400);
      setTimeout(() => document.body.removeChild(toast), 1700);
    } catch (e) {
      alert(`${name} added to cart`);
    }
  };

  // ---------- CLEAR CART ----------
  window.clearCart = function() {
    if (!cart.length) return;
    if (!confirm('Clear all items from cart?')) return;
    cart = [];
    saveCart();
    // reload page to update UI if on cart page
    if (document.getElementById('cart-items')) location.reload();
  };

  // ---------- REMOVE ONE ITEM ----------
  window.removeFromCart = function(index) {
    if (typeof index !== 'number') return;
    cart.splice(index, 1);
    saveCart();
    if (document.getElementById('cart-items')) location.reload();
  };

  // ---------- RENDER CART PAGE ----------
  function renderCartPage() {
    const listEl = document.getElementById('cart-items');
    if (!listEl) return;

    listEl.innerHTML = '';
    const summaryEl = document.getElementById('cart-summary-items');
    if (summaryEl) summaryEl.innerHTML = '';

    if (cart.length === 0) {
      listEl.innerHTML = `<div class="cart-item"><div style="padding:18px;color:#666">Your cart is empty. <a href="products.html">Browse items</a></div></div>`;
      if (document.getElementById('cart-total')) document.getElementById('cart-total').textContent = '0';
      return;
    }

    let total = 0;
    cart.forEach((item, idx) => {
      total += Number(item.price || 0);
      const itemNode = document.createElement('div');
      itemNode.className = 'cart-item';
      itemNode.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;">
          ${ item.img ? `<img src="${item.img}" alt="${item.name}" style="width:72px;height:72px;border-radius:10px;object-fit:cover">` : '' }
          <div>
            <div style="font-weight:700">${item.name}</div>
            <div style="color:#666;margin-top:6px">₹${item.price}</div>
          </div>
        </div>
        <div>
          <button class="btn btn-ghost" onclick="removeFromCart(${idx})">Remove</button>
        </div>
      `;
      listEl.appendChild(itemNode);

      // add to summary aside
      if (summaryEl) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.marginBottom = '8px';
        row.innerHTML = `<div>${item.name}</div><div>₹${item.price}</div>`;
        summaryEl.appendChild(row);
      }
    });

    if (document.getElementById('cart-total')) document.getElementById('cart-total').textContent = total;
  }

  renderCartPage();

  // ---------- CHECKOUT FROM CART ----------
  window.checkoutFromCart = function() {
    if (!cart.length) {
      alert('Your cart is empty!');
      return;
    }
    // go to payments page
    window.location.href = 'payments.html';
  };

  // ---------- RENDER ORDER SUMMARY ON PAYMENTS ----------
  function renderPaymentSummary() {
    const summaryContainer = document.getElementById('summary-items');
    const totalEl = document.getElementById('summary-total');
    if (!summaryContainer || !totalEl) return;

    if (!cart.length) {
      summaryContainer.innerHTML = `<p style="color:#666">Your cart is empty.</p>`;
      totalEl.textContent = '0';
      return;
    }

    let total = 0;
    summaryContainer.innerHTML = '';
    cart.forEach(it => {
      total += Number(it.price || 0);
      const row = document.createElement('div');
      row.style.display = 'flex'; row.style.justifyContent = 'space-between'; row.style.marginBottom = '8px';
      row.innerHTML = `<div>${it.name}</div><div>₹${it.price}</div>`;
      summaryContainer.appendChild(row);
    });

    totalEl.textContent = total;
  }

  renderPaymentSummary();

  // ---------- PROCESS ORDER ----------
  window.processOrder = function(e) {
    e.preventDefault();
    // get form fields (basic validation)
    const fullname = (document.getElementById('fullname') || {}).value || '';
    const phone = (document.getElementById('phone') || {}).value || '';
    const email = (document.getElementById('email') || {}).value || '';
    const address = (document.getElementById('address') || {}).value || '';
    const paymethod = (document.getElementById('paymentmethod') || {}).value || '';

    if (!fullname || !phone || !email || !address) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!cart.length) {
      alert('Cart is empty.');
      return;
    }

    // generate order id
    const orderId = 'TK' + Math.floor(100000 + Math.random() * 900000);
    // in a real app you'd POST order to server here

    // clear cart
    cart = [];
    saveCart();

    // redirect to thank you with orderId
    window.location.href = `thankyou.html?orderId=${orderId}`;
  };

  // ---------- THANK YOU PAGE: show order id ----------
  function renderThankYou() {
    const el = document.getElementById('order-id');
    if (!el) return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('orderId') || 'N/A';
    el.textContent = id;
  }

  renderThankYou();

  // ---------- small toast styles (dynamically) ----------
  const toastStyle = document.createElement('style');
  toastStyle.innerHTML = `
    .mini-toast{position:fixed;left:50%;transform:translateX(-50%);bottom:24px;padding:10px 16px;background:#2b2b2b;color:white;border-radius:10px;opacity:0;transition:all .28s;z-index:9999;font-weight:700}
    .mini-toast.visible{opacity:1;transform:translateX(-50%) translateY(-8px)}
  `;
  document.head.appendChild(toastStyle);

})();
