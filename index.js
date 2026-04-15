const express = require('express');
const cors = require('cors');
const { Rcon } = require('rcon-client');

const app = express();

// Разрешаем запросы от твоего локального HTML-файла
app.use(cors());
app.use(express.json());

// Параметры подключения берутся из настроек Render (Environment Variables)
const config = {
    host: process.env.RCON_HOST,
    port: parseInt(process.env.RCON_PORT) || 25575,
    password: process.env.RCON_PASSWORD
};

// Роут для проверки, что сервер живой
app.get('/', (req, res) => {
    res.send('RCON Backend is running!');
});

// Основной роут для команд
app.post('/send', async (req, res) => {
    const { command } = req.body;

    if (!command) {
        return res.status(400).json({ error: 'Команда не введена' });
    }

    try {
        console.log(`Выполнение команды: ${command}`);
        const rcon = await Rcon.connect(config);
        const response = await rcon.send(command);
        await rcon.end();
        
        res.json({ response: response || 'Команда выполнена (сервер не вернул текста)' });
    } catch (err) {
        console.error('Ошибка RCON:', err.message);
        res.status(500).json({ error: 'Ошибка сервера Minecraft: ' + err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
