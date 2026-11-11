
/* =================================
   MENU RESPONSIVO
================================= */

const menuButton = document.getElementById("menu-button");
const navigation = document.getElementById("navigation");

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("active");
});

document.querySelectorAll(".navigation a").forEach(link => {
    link.addEventListener("click", () => {
        navigation.classList.remove("active");
    });
});


/* =================================
   PRODUTOS
================================= */

const products = [
    {
        id: 1,
        name: "Gestão Financeira para Funcionários",
        category: "EBOOK",
        description: "Aprenda a organizar rendimentos, despesas e poupanças.",
        price: 4.99,
        cover: "cover-one"
    },
    {
        id: 2,
        name: "Introdução ao Empreendedorismo",
        category: "MANUAL",
        description: "Conceitos fundamentais para desenvolver ideias de negócio.",
        price: 5.99,
        cover: "cover-two"
    },
    {
        id: 3,
        name: "Organização e Produtividade",
        category: "TEMPLATE",
        description: "Modelos digitais para organizar tarefas e objectivos.",
        price: 3.99,
        cover: "cover-three"
    }
];


/* =================================
   ELEMENTOS
================================= */

const productGrid = document.getElementById("product-grid");
const cartDisplay = document.getElementById("cart-count");

const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

const openCart = document.getElementById("open-cart");
const closeCart = document.getElementById("close-cart");
const clearCart = document.getElementById("clear-cart");
const checkoutButton = document.getElementById("checkout-button");


/* =================================
   ESTADO DO CARRINHO
================================= */

let cart = [];

try {
    const savedCart = JSON.parse(localStorage.getItem("vertex-cart"));

    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(item =>
            products.some(product => product.id === item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        );
    }
} catch (error) {
    cart = [];
}


/* =================================
   MOSTRAR PRODUTOS
================================= */

function displayProducts() {

    productGrid.innerHTML = "";

    products.forEach(product => {

        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-cover ${product.cover}">
                <span>VERTEX DIGITAL</span>
                <h3>${product.name}</h3>
                <small>${product.category}</small>
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="product-bottom">

                    <strong>$${product.price.toFixed(2)}</strong>

                    <button class="add-button"
                        data-id="${product.id}">
                        Adicionar +
                    </button>

                </div>

            </div>
        `;

        productGrid.appendChild(card);

    });

}


/* =================================
   GUARDAR CARRINHO
================================= */

function saveCart() {

    localStorage.setItem(
        "vertex-cart",
        JSON.stringify(cart)
    );

}


/* =================================
   ADICIONAR PRODUTO
================================= */

productGrid.addEventListener("click", event => {

    const button = event.target.closest(".add-button");

    if (!button) return;

    const id = Number(button.dataset.id);

    const existingProduct = cart.find(item => item.id === id);

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            id: id,
            quantity: 1
        });

    }

    updateCart();

    button.textContent = "Adicionado ✓";

    setTimeout(() => {
        button.textContent = "Adicionar +";
    }, 1000);

});


/* =================================
   ACTUALIZAR CARRINHO
================================= */

function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    cart.forEach(item => {

        const product = products.find(
            p => p.id === item.id
        );

        if (!product) return;

        const subtotal = product.price * item.quantity;

        total += subtotal;
        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div class="cart-item-info">

                <h3>${product.name}</h3>

                <p>$${product.price.toFixed(2)} por unidade</p>

                <strong>$${subtotal.toFixed(2)}</strong>

            </div>

            <div class="quantity-controls">

                <button data-action="decrease"
                    data-id="${product.id}">−</button>

                <span>${item.quantity}</span>

                <button data-action="increase"
                    data-id="${product.id}">+</button>

                <button class="remove-item"
                    data-action="remove"
                    data-id="${product.id}">
                    Remover
                </button>

            </div>
        `;

        cartItems.appendChild(cartItem);

    });


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                O teu carrinho está vazio.
            </p>
        `;

    }

    cartDisplay.textContent = totalQuantity;

    cartTotal.textContent = `$${total.toFixed(2)}`;

    saveCart();

}


/* =================================
   CONTROLOS DE QUANTIDADE
================================= */

cartItems.addEventListener("click", event => {

    const button = event.target.closest("button");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    const item = cart.find(product => product.id === id);

    if (!item) return;

    if (action === "increase") {

        item.quantity++;

    }

    if (action === "decrease") {

        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(product => product.id !== id);
        }

    }

    if (action === "remove") {

        cart = cart.filter(product => product.id !== id);

    }

    updateCart();

});


/* =================================
   ABRIR E FECHAR CARRINHO
================================= */

openCart.addEventListener("click", () => {

    cartOverlay.classList.add("active");

});

closeCart.addEventListener("click", () => {

    cartOverlay.classList.remove("active");

});

cartOverlay.addEventListener("click", event => {

    if (event.target === cartOverlay) {
        cartOverlay.classList.remove("active");
    }

});


/* =================================
   ESVAZIAR CARRINHO
================================= */

clearCart.addEventListener("click", () => {

    cart = [];

    updateCart();

});


/* =================================
   PAGAMENTO - DEMONSTRAÇÃO
================================= */

checkoutButton.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("O teu carrinho está vazio.");

        return;

    }

    alert(
        "O carrinho está pronto. A integração de pagamentos será implementada numa próxima etapa."
    );

});


/* =================================
   INICIALIZAR
================================= */

displayProducts();

updateCart();
