let cart = JSON.parse(localStorage.getItem('cart')) || [];

const SHIPPING_PRICE = 250;

// Cart Counter

function updateCartCounter() {
    const counter = document.getElementById('cartCount');
    if(counter) counter.textContent = cart.reduce((total, item) => total + item.quantity, 0);

    console.log("Cart Counter Working")
}

// Add To Cart 

function addToCart(product, price, image, size, color) {

    const existingItem = cart.find(item =>
        item.product === product &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            product,
            price,
            image,
            size,
            color,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
}

// "Add To Cart" Buttons

const addButtons = document.querySelectorAll('.addbtn');

addButtons.forEach(button => {
    button.addEventListener('click', function() {
        const itemCard = button.closest('.item');
        const product = itemCard.dataset.name;
        const price = parseInt(itemCard.dataset.price);
        const image = itemCard.dataset.image;

        const sizeSelect = itemCard.querySelector(".sizeSelect");

        // Default value
        let size = null;

        // Only run if product HAS sizes
        if(sizeSelect){

        size = sizeSelect.value;

        if(size === ""){
            alert("Please select a size!");
            return;
            }
        }

        const colorSelect = itemCard.querySelector(".colorSelect");

        let color = null;

        if(colorSelect){

            color = colorSelect.value;

            if(color === ""){
                alert("Please select a color!");
                return;
            }
        }

        addToCart(product, price, image, size, color);
        alert("Item add to cart!");
    });

    console.log("Add to cart working")
});

// Remove from cart 

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload();
};

function changeQuantity(index, amount) {

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCounter();
}

// Display Cart

function displayCart() {

    const cartList = document.getElementById('cartList');
    const subtotalEl = document.getElementById('subtotal');
    const fullprice = document.getElementById('total');

    if (!cartList) return;

    cartList.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item, index) => {

        // Maak seker ou items kry quantity = 1
        if (!item.quantity) item.quantity = 1;

        const li = document.createElement("li");
        li.classList.add("cartItem");

        li.innerHTML = `
            <div class="cartRow">

                <div class="cartimage">
                    <img src="${item.image}" alt="${item.product}">
                </div>

                <span class="productname">${item.product}</span>

                ${item.size ? `<span class="productsize">${item.size}</span>` : ""}
                ${item.color ? `<span class="productcolor">${item.color}</span>` : ""}

                <div class="quantityBox">
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </div>

                <span class="productprice">
                    R${item.price * item.quantity}
                </span>

                

            </div>
        `;

        cartList.appendChild(li);

        subtotal += item.price * item.quantity;
    });

    const deliveryMethod = document.querySelector('input[name="delivery"]:checked');

    let shippingCost = 0;

        if (deliveryMethod && deliveryMethod.value === "delivery") {
            shippingCost = SHIPPING_PRICE;
        }

        const shippingPrice = document.getElementById("shipping");

        if (shippingPrice) {
            shippingPrice.textContent = shippingCost === 0 ? "Free" : `R${shippingCost}`;
        }

        if (subtotalEl) {
            subtotalEl.textContent = `R${subtotal}`;
        }

        if (fullprice) {
        fullprice.textContent = `R${subtotal + shippingCost}`;
        }
}


// Run and update page when loaded

updateCartCounter();
displayCart();

const deliveryOptions = document.querySelectorAll('input[name="delivery"]');

deliveryOptions.forEach(option => {
    option.addEventListener("change", displayCart);
});