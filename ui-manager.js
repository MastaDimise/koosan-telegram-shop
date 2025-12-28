// Управление пользовательским интерфейсом
class UIManager {
    constructor(app) {
        this.app = app;
        this.tg = app.tg;
        this.container = document.getElementById('telegram-web-app');
    }

    renderPage(page) {
        this.container.innerHTML = this.getPageHTML(page);
        this.attachEventListeners();
    }

    getPageHTML(page) {
        switch(page) {
            case 'home':
                return this.renderHomePage();
            case 'cart':
                return this.renderCartPage();
            case 'profile':
                return this.renderProfilePage();
            case 'product':
                return this.renderProductPage();
            default:
                return '<div class="page-not-found">Страница не найдена</div>';
        }
    }

    renderHomePage() {
        const products = this.app.state.products;

        return `
            <div class="page home-page">
                <header class="app-header">
                    <h1 class="shop-name">koosan</h1>
                    <p class="shop-slogan">Оверсайз одежда</p>
                </header>

                <div class="categories">
                    <button class="category-btn active" data-category="all">Все</button>
                    <button class="category-btn" data-category="pants">Брюки</button>
                    <button class="category-btn" data-category="tshirts">Футболки</button>
                    <button class="category-btn" data-category="hoodies">Худи</button>
                </div>

                <div class="products-grid">
                    ${products.map(product => `
                        <div class="product-card" data-product-id="${product.id}">
                            <div class="product-image" style="background-image: url('${product.image}')">
                                ${product.discount_percent ?
                                    `<div class="discount-badge">-${product.discount_percent}%</div>` : ''}
                            </div>
                            <div class="product-info">
                                <h3 class="product-name">${product.name}</h3>
                                <p class="product-brand">${product.brand}</p>
                                <div class="product-price">
                                    ${product.discount_price ?
                                        `<span class="current-price">${product.discount_price} ₽</span>
                                         <span class="old-price">${product.price} ₽</span>` :
                                        `<span class="current-price">${product.price} ₽</span>`}
                                </div>
                                <button class="add-to-cart-btn" data-product-id="${product.id}">
                                    <i class="fas fa-shopping-cart"></i> В корзину
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <nav class="bottom-nav">
                    <button class="nav-btn active" data-page="home">
                        <i class="fas fa-home"></i>
                        <span>Главная</span>
                    </button>
                    <button class="nav-btn" data-page="cart">
                        <i class="fas fa-shopping-cart"></i>
                        <span>Корзина <span class="cart-badge">${this.app.state.cart.length}</span></span>
                    </button>
                    <button class="nav-btn" data-page="profile">
                        <i class="fas fa-user"></i>
                        <span>Профиль</span>
                    </button>
                </nav>
            </div>
        `;
    }

    renderCartPage() {
        const cart = this.app.state.cart;
        const total = cart.reduce((sum, item) => sum + (item.discount_price || item.price) * item.quantity, 0);

        return `
            <div class="page cart-page">
                <header class="page-header">
                    <button class="back-btn" data-page="home">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h2>Корзина</h2>
                    <div class="header-placeholder"></div>
                </header>

                ${cart.length === 0 ? `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <h3>Корзина пуста</h3>
                        <p>Добавьте товары из каталога</p>
                        <button class="btn-primary" data-page="home">В каталог</button>
                    </div>
                ` : `
                    <div class="cart-items">
                        ${cart.map(item => `
                            <div class="cart-item" data-cart-id="${item.cartId}">
                                <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                                <div class="cart-item-details">
                                    <h4>${item.name}</h4>
                                    <p>Размер: ${item.selectedSize}</p>
                                    <div class="cart-item-controls">
                                        <button class="qty-btn minus">-</button>
                                        <span class="qty">${item.quantity}</span>
                                        <button class="qty-btn plus">+</button>
                                        <span class="cart-item-price">${(item.discount_price || item.price) * item.quantity} ₽</span>
                                    </div>
                                </div>
                                <button class="remove-item-btn" data-cart-id="${item.cartId}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>

                    <div class="cart-summary">
                        <div class="summary-row">
                            <span>Товары (${cart.length})</span>
                            <span>${total} ₽</span>
                        </div>
                        <div class="summary-row total">
                            <span>Итого</span>
                            <span>${total} ₽</span>
                        </div>
                        <button class="btn-primary checkout-btn">Оформить заказ</button>
                    </div>
                `}

                <nav class="bottom-nav">
                    <button class="nav-btn" data-page="home">
                        <i class="fas fa-home"></i>
                        <span>Главная</span>
                    </button>
                    <button class="nav-btn active" data-page="cart">
                        <i class="fas fa-shopping-cart"></i>
                        <span>Корзина <span class="cart-badge">${cart.length}</span></span>
                    </button>
                    <button class="nav-btn" data-page="profile">
                        <i class="fas fa-user"></i>
                        <span>Профиль</span>
                    </button>
                </nav>
            </div>
        `;
    }

    renderProfilePage() {
        const user = this.app.state.user;

        return `
            <div class="page profile-page">
                <header class="page-header">
                    <h2>Профиль</h2>
                </header>

                <div class="profile-info">
                    ${user ? `
                        <div class="user-card">
                            <div class="user-avatar">
                                ${user.photo_url ?
                                    `<img src="${user.photo_url}" alt="Avatar">` :
                                    `<i class="fas fa-user"></i>`}
                            </div>
                            <div class="user-details">
                                <h3>${user.first_name} ${user.last_name || ''}</h3>
                                <p>@${user.username || 'без username'}</p>
                            </div>
                        </div>
                    ` : `
                        <div class="user-card">
                            <div class="user-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="user-details">
                                <h3>Гость</h3>
                                <p>Войдите через Telegram</p>
                            </div>
                        </div>
                    `}
                </div>

                <div class="profile-menu">
                    <a href="#" class="menu-item">
                        <i class="fas fa-box"></i>
                        <span>Мои заказы</span>
                        <i class="fas fa-chevron-right"></i>
                    </a>
                    <a href="#" class="menu-item">
                        <i class="fas fa-heart"></i>
                        <span>Избранное</span>
                        <i class="fas fa-chevron-right"></i>
                    </a>
                    <a href="#" class="menu-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Адреса доставки</span>
                        <i class="fas fa-chevron-right"></i>
                    </a>
                    <a href="#" class="menu-item">
                        <i class="fas fa-credit-card"></i>
                        <span>Способы оплаты</span>
                        <i class="fas fa-chevron-right"></i>
                    </a>
                    <a href="#" class="menu-item">
                        <i class="fas fa-cog"></i>
                        <span>Настройки</span>
                        <i class="fas fa-chevron-right"></i>
                    </a>
                    <a href="#" class="menu-item">
                        <i class="fas fa-question-circle"></i>
                        <span>Помощь</span>
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </div>

                <nav class="bottom-nav">
                    <button class="nav-btn" data-page="home">
                        <i class="fas fa-home"></i>
                        <span>Главная</span>
                    </button>
                    <button class="nav-btn" data-page="cart">
                        <i class="fas fa-shopping-cart"></i>
                        <span>Корзина <span class="cart-badge">${this.app.state.cart.length}</span></span>
                    </button>
                    <button class="nav-btn active" data-page="profile">
                        <i class="fas fa-user"></i>
                        <span>Профиль</span>
                    </button>
                </nav>
            </div>
        `;
    }

    attachEventListeners() {
        // Навигация
        this.container.querySelectorAll('[data-page]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const page = btn.dataset.page;
                this.app.navigateTo(page);
            });
        });

        // Добавление в корзину
        this.container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(btn.dataset.productId);
                this.app.addToCart(productId);
            });
        });

        // Удаление из корзины
        this.container.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartId = parseInt(btn.dataset.cartId);
                this.removeFromCart(cartId);
            });
        });
    }

    removeFromCart(cartId) {
        this.app.state.cart = this.app.state.cart.filter(item => item.cartId !== cartId);
        this.app.saveCart();
        this.app.updateCartBadge();
        this.renderPage('cart');
        this.tg.showAlert('Товар удален из корзины');
    }

    updateCartBadge(count) {
        document.querySelectorAll('.cart-badge').forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
        });
    }
}