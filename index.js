const express = require('express');
const { Rcon } = require('rcon-client');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public')); // Для хранения HTML/CSS

// Настройки (на Render.com лучше задать их в Environment Variables)
const config = {
    host: process.env.RCON_HOST || 'ваш_ip',
    port: parseInt(process.env.RCON_PORT) || 25575,
    password: process.env.RCON_PASSWORD || 'ваш_пароль'
};

// Отправка команды
app.post('/send', async (req, res) => {
    const { command } = req.body;

    if (!command) {
        return res.status(400).json({ error: 'Команда не указана' });
    }

    try {
        const rcon = await Rcon.connect(config);
        const response = await rcon.send(command);
        await rcon.end();
        
        res.json({ response: response || 'Команда выполнена' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка RCON: ' + err.message });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Консоль запущена на порту ${PORT}`);
});
