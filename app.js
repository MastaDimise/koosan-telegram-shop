// Главный файл приложения koosan
class KoosanApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.botAPI = window.TelegramBotAPI;
        this.config = window.KOOSAN_CONFIG;

        // Состояние приложения
        this.state = {
            currentPage: 'home',
            user: null,
            cart: [],
            products: []
        };

        this.init();
    }

    async init() {
        console.log('🚀 Запуск koosan магазина...');

        // 1. Инициализируем Telegram Web App
        this.initTelegram();

        // 2. Загружаем данные
        await this.loadData();

        // 3. Настраиваем бота (если есть токен)
        await this.setupBot();

        // 4. Инициализируем UI
        this.initUI();

        // 5. Показываем приложение
        this.showApp();

        console.log('✅ Магазин koosan готов!');
    }

    initTelegram() {
        console.log('Инициализация Telegram Web App...');

        // Расширяем на весь экран
        this.tg.expand();

        // Настраиваем цвета
        this.tg.setHeaderColor('#1a1a1a');
        this.tg.setBackgroundColor('#ffffff');

        // Получаем данные пользователя
        const tgUser = this.tg.initDataUnsafe.user;
        if (tgUser) {
            this.state.user = tgUser;
            console.log('👤 Пользователь Telegram:', tgUser);
        }

        // Готово
        this.tg.ready();
        console.log('✅ Telegram Web App инициализирован');
    }

    async loadData() {
        try {
            // Загружаем товары
            const productsResponse = await fetch('data/products.json');
            this.state.products = await productsResponse.json();

            // Загружаем корзину из localStorage
            const savedCart = localStorage.getItem('koosan_cart');
            if (savedCart) {
                this.state.cart = JSON.parse(savedCart);
            }

            console.log(`📦 Загружено ${this.state.products.length} товаров`);
            console.log(`🛒 В корзине: ${this.state.cart.length} товаров`);

        } catch (error) {
            console.error('❌ Ошибка загрузки данных:', error);

            // Заглушка если файл не найден
            this.state.products = this.getMockProducts();
        }
    }

    async setupBot() {
        // Получаем токен из безопасного источника
        // В реальном приложении это должно быть через ваш backend
        const botToken = this.getBotToken();

        if (botToken) {
            // Настраиваем API
            this.botAPI.setToken(botToken);

            // Настраиваем меню кнопку
            const webAppUrl = this.config.webAppUrl;
            await this.botAPI.setupMenuButton(webAppUrl);

            // Настраиваем команды
            await this.botAPI.setupBotCommands();

            console.log('✅ Бот настроен');
        } else {
            console.log('⚠️ Токен бота не установлен, некоторые функции недоступны');
        }
    }

    getBotToken() {
        // ВНИМАНИЕ: В реальном приложении НИКОГДА не храните токен в клиентском коде!
        // Это только для демонстрации. В продакшене токен должен приходить с вашего сервера.

        // Способ 1: Из URL параметров (для теста)
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('bot_token');

        // Способ 2: Из переменной окружения (на GitHub Pages не работает)
        // Способ 3: Запрос к вашему API серверу

        return tokenFromUrl || ''; // Временно пустая строка
    }

    initUI() {
        // Инициализация UI компонентов
        window.uiManager = new UIManager(this);

        // Обработка навигации
        this.setupNavigation();

        // Обновляем бейдж корзины
        this.updateCartBadge();
    }

    showApp() {
        // Скрываем экран загрузки
        document.getElementById('loading').style.display = 'none';

        // Показываем главную страницу
        this.navigateTo('home');
    }

    // Навигация
    navigateTo(page) {
        this.state.currentPage = page;
        window.uiManager.renderPage(page);
    }

    // Корзина
    addToCart(productId, size = 'M', quantity = 1) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product) return;

        const cartItem = {
            ...product,
            cartId: Date.now(),
            selectedSize: size,
            quantity: quantity,
            addedAt: new Date().toISOString()
        };

        this.state.cart.push(cartItem);
        this.saveCart();
        this.updateCartBadge();

        // Показываем уведомление
        this.tg.showAlert(`✅ ${product.name} добавлен в корзину!`);

        // Вибрация (если поддерживается)
        if (this.tg.isVibrateSupported) {
            this.tg.HapticFeedback.impactOccurred('light');
        }
    }

    saveCart() {
        localStorage.setItem('koosan_cart', JSON.stringify(this.state.cart));
    }

    updateCartBadge() {
        window.uiManager.updateCartBadge(this.state.cart.length);
    }

    // Вспомогательные методы
    getMockProducts() {
        return [
            {
                id: 1,
                name: "Блузка",
                brand: "koosan",
                price: 2500,
                discount_price: 2250,
                discount_percent: 10,
                category: "blouse",
                sizes: ["S", "M", "L", "XL"],
                image: "https://via.placeholder.com/400x500/1a1a1a/ffffff?text=Koosan+blouse"
            },
            {
                id: 2,
                name: "Платье",
                brand: "koosan",
                price: 10000,
                discount_price: 5000,
                discount_percent: 50,
                category: "dress",
                sizes: ["S", "M", "L", "XL", "XXL"],
                image: "https://via.placeholder.com/400x500/333333/ffffff?text=Koosan+T-dress"
            }
        ];
    }
}

// Запуск приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.koosanApp = new KoosanApp();
});