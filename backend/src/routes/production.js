const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/database');

// Obtener toda la producción
router.get('/', auth, async (req, res) => {
    console.log('GET /api/production - Usuario:', req.user.userId);
    try {
        const [production] = await db.query(
            'SELECT * FROM production WHERE user_id = ? ORDER BY date DESC',
            [req.user.userId]
        );
        console.log('Producción encontrada:', production.length, 'registros');
        res.json(production);
    } catch (error) {
        console.error('Error al obtener producción:', error);
        res.status(500).json({ message: 'Error al obtener datos de producción' });
    }
});

// Registrar nueva producción
router.post('/', auth, async (req, res) => {
    console.log('POST /api/production - Datos recibidos:', req.body);
    try {
        const { processArea, quantityProduced, date } = req.body;
        const [result] = await db.query(
            'INSERT INTO production (process_area, quantity_produced, date, user_id) VALUES (?, ?, ?, ?)',
            [processArea, quantityProduced, date, req.user.userId]
        );
        res.status(201).json({ 
            message: 'Producción registrada exitosamente',
            productionId: result.insertId 
        });
    } catch (error) {
        console.error('Error al registrar producción:', error);
        res.status(500).json({ message: 'Error al registrar la producción' });
    }
});

module.exports = router;