// Telegram Bot API взаимодействие
class TelegramBotAPI {
    constructor() {
        this.botToken = ' '; // Токен будет устанавливаться динамически
        this.baseUrl = 'https://api.telegram.org/bot';
    }

    // Установка токена (безопасно)
    setToken(token) {
        this.botToken = token;
        console.log('Bot token установлен');
    }

    // Настройка кнопки меню через API
    async setupMenuButton(webAppUrl) {
        if (!this.botToken) {
            console.error('Bot token не установлен');
            return false;
        }

        try {
            const response = await fetch(`${this.baseUrl}${this.botToken}/setChatMenuButton`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    menu_button: {
                        type: "web_app",
                        text: "🛍️ Открыть koosan",
                        web_app: {
                            url: webAppUrl
                        }
                    }
                })
            });

            const data = await response.json();

            if (data.ok) {
                console.log('✅ Menu button успешно настроен');
                return true;
            } else {
                console.error('❌ Ошибка настройки menu button:', data);
                return false;
            }
        } catch (error) {
            console.error('❌ Ошибка сети:', error);
            return false;
        }
    }

    // Настройка команд бота
    async setupBotCommands() {
        if (!this.botToken) return false;

        try {
            const response = await fetch(`${this.baseUrl}${this.botToken}/setMyCommands`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    commands: [
                        { command: 'start', description: '🚀 Запустить магазин' },
                        { command: 'catalog', description: '📋 Каталог товаров' },
                        { command: 'cart', description: '🛒 Моя корзина' },
                        { command: 'help', description: '❓ Помощь' },
                        { command: 'about', description: 'ℹ️ О магазине' }
                    ],
                    language_code: 'ru'
                })
            });

            const data = await response.json();
            return data.ok;
        } catch (error) {
            console.error('Ошибка настройки команд:', error);
            return false;
        }
    }

    // Отправка сообщения пользователю
    async sendMessage(chatId, text, options = {}) {
        if (!this.botToken) return false;

        try {
            const response = await fetch(`${this.baseUrl}${this.botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: 'HTML',
                    ...options
                })
            });

            return await response.json();
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
            return null;
        }
    }
}

// Создаем глобальный экземпляр
window.TelegramBotAPI = new TelegramBotAPI();