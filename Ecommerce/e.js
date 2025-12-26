
const bar = document.getElementById("bars");
const nav = document.getElementById("navbar");
const close = document.getElementById("close");

if (bar) {
  bar.addEventListener("click", () => nav.classList.add("active"));
}

if (close) {
  close.addEventListener("click", () => nav.classList.remove("active"));
}


const mainImg = document.getElementById("main-img");
const smallImg = document.getElementsByClassName("small-image");

if (mainImg && smallImg.length > 0) {
  for (let i = 0; i < smallImg.length; i++) {
    smallImg[i].onclick = () => {
      mainImg.src = smallImg[i].src;
    };
  }
}


let cart = JSON.parse(localStorage.getItem("cart")) || [];


const addToCartBtns = document.querySelectorAll(".add-to-cart");

addToCartBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const product = btn.closest(".products");

    const item = {
      id: product.dataset.id,
      name: product.dataset.name,
      price: Number(product.dataset.price),
      image: product.dataset.image,
      quantity: 1
    };

    addItemToCart(item);
  });
});

function addItemToCart(item) {
  const existingItem = cart.find(p => p.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Item added to cart");
}


const cartBody = document.getElementById("cart-body");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartTotal = document.getElementById("cart-total");

if (cartBody) {
  renderCart();
}

function renderCart() {
  cartBody.innerHTML = "";

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;">Your cart is empty</td>
      </tr>`;
    updateTotals();
    return;
  }

  cart.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <button class="remove" data-id="${item.id}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </td>
      <td>
        <img src="${item.image}" width="70">
      </td>
      <td>${item.name}</td>
      <td>$${item.price}</td>
      <td>
        <input type="number" min="1" value="${item.quantity}" 
          class="qty" data-id="${item.id}">
      </td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
    `;

    cartBody.appendChild(row);
  });

  updateTotals();
}

document.addEventListener("click", e => {
  const removeBtn = e.target.closest(".remove");
  if (!removeBtn) return;

  const id = removeBtn.dataset.id;
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
});


document.addEventListener("input", e => {
  if (!e.target.classList.contains("qty")) return;

  const id = e.target.dataset.id;
  const qty = Number(e.target.value);

  const item = cart.find(p => p.id === id);
  if (item && qty > 0) {
    item.quantity = qty;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
});


function updateTotals() {
  let subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  if (cartTotal) cartTotal.textContent = `$${subtotal.toFixed(2)}`;
}
