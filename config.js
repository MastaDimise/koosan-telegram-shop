// Конфигурация магазина koosan
const KOOSAN_CONFIG = {
    // Основные настройки
    shopName: 'koosan',
    shopDescription: 'Женская одежда',
    shopSlogan: 'Стиль без границ',

    // Telegram настройки
    botUsername: '@koosan_shop_bot', // Замените на ваш
    botToken: '', // НЕ храните токен в клиентском коде!

    // GitHub Pages URL (будет автоматически определен)
    webAppUrl: window.location.origin,

    // API endpoints (если будут)
    apiBaseUrl: 'https://api.koosan-shop.ru', // Для будущего

    // Настройки магазина
    currency: '₽',
    defaultLanguage: 'ru',

    // Социальные сети
    socialLinks: {
        instagram: 'https://www.instagram.com/koosan.ru?igsh=MTJtNmRvc3lxYWVwaA==',
    },

    // Контакты поддержки
    support: {
        email: 'rakaevaanastasiia@gmail.ru',
        telegram: '@rakaevanastasiia',
        phone: '+7 (977) 255-45-604'
    },

    // Настройки доставки
    delivery: {
        freeFrom: 5000, // Бесплатно от 5000₽
        cost: 300, // Стоимость доставки
        cities: ['Москва', 'Санкт-Петербург', 'Казань']
    }
};

// Экспортируем конфигурацию
window.KOOSAN_CONFIG = KOOSAN_CONFIG;