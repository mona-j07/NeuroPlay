require('dotenv').config();
const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/analyze', (req, res) => {
    const gameData = JSON.stringify(req.body);
    const isWindows = process.platform === 'win32';
    const enginePath = path.join(__dirname, isWindows ? './engine.exe' : './engine');

    const child = spawn(enginePath);

    let output = '';
    let error = '';

    child.stdin.write(gameData + '\n');
    child.stdin.end();

    child.stdout.on('data', (data) => {
        output += data.toString();
    });

    child.stderr.on('data', (data) => {
        error += data.toString();
    });

    child.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: 'Engine error', details: error });
        }
        try {
            const result = JSON.parse(output);
            res.json(result);
        } catch (e) {
            res.status(500).json({ error: 'Failed to parse engine output', raw: output });
        }
    });
});

app.listen(port, () => {
    console.log(`NeuroPlay Bridge API listening at http://localhost:${port}`);
});
