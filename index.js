const express = require('express');
const { Rcon } = require('rcon-client');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Указываем серверу, что файлы для сайта лежат в папке public
app.use(express.static(path.join(__dirname, 'public')));

const config = {
    host: process.env.RCON_HOST,
    port: parseInt(process.env.RCON_PORT) || 25575,
    password: process.env.RCON_PASSWORD
};

// Главная страница — отдаем наш HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API для отправки команд
app.post('/send', async (req, res) => {
    const { command } = req.body;
    if (!command) return res.status(400).json({ error: 'Пустая команда' });

    try {
        const rcon = await Rcon.connect(config);
        const response = await rcon.send(command);
        await rcon.end();
        res.json({ response: response || 'Выполнено успешно.' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера: ' + err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
