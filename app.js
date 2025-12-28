// Простой магазин - начнем с минимального функционала
const products = [
    {
        id: 1,
        name: "Платье бордовое",
        price: 5000,
        discount: 500,
        image: "images/dressBurgundy.jpg"
    },
    {
        id: 2,
        name: "Платье белое",
        price: 5000,
        discount: 500,
        image: "images/dressWhite.jpg"
    },
    {
        id: 3,
        name: "Платье черное",
        price: 5000,
        discount: 500,
        image: "images/dressBlack.jpg"
    },
    {
        id: 4,
        name: "блузка синяя",
        price: 3500,
        discount: 0,
        image: "images/blouseBlue.jpg"
    },
    {
        id: 5,
        name: "блузка желтая",
        price: 3500,
        discount: 0,
        image: "images/blouseYellow.jpg"
    },
    {
        id: 6,
        name: "блузка черная",
        price: 3500,
        discount: 0,
        image: "images/blouseBlack.jpg"
    }
];

let cart = [];

// Инициализация Telegram
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Навигация
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const page = btn.dataset.page;
        showPage(page);
    });
});

// Показ страниц
function showPage(page) {
    const content = document.getElementById('app-content');

    switch(page) {
        case 'home':
            content.innerHTML = renderHome();
            break;
        case 'cart':
            content.innerHTML = renderCart();
            break;
        case 'profile':
            content.innerHTML = renderProfile();
            break;
    }
}

// Рендер главной страницы
function renderHome() {
    return `
        <h2>Товары</h2>
        <div class="products">
            ${products.map(product => `
                <div class="product-card" onclick="addToCart(${product.id})">
                    <div class="product-image">
                        ${product.discount ?
                          `<span class="discount">-${Math.round((1 - product.discount/product.price)*100)}%</span>` : ''}
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <div class="price">
                            ${product.discount ?
                              `<span class="old-price">${product.price} ₽</span>
                               <span class="new-price">${product.discount} ₽</span>` :
                              `<span>${product.price} ₽</span>`}
                        </div>
                        <button class="add-btn">В корзину</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Показываем главную страницу при загрузке
showPage('home');