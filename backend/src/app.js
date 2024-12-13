const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/defects', require('./routes/defects'));
app.use('/api/production', require('./routes/production'));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal!' });
});

module.exports = app;