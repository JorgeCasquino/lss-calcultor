const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/database');

// Obtener todos los defectos
router.get('/', auth, async (req, res) => {
    try {
        console.log('Obteniendo defectos para usuario:', req.user.userId);
        const [defects] = await db.query(
            `SELECT id, process_area, defect_type, description, quantity, date 
             FROM defects 
             WHERE user_id = ?
             ORDER BY date DESC`,
            [req.user.userId]
        );
        console.log('Defectos encontrados:', defects.length);
        res.json(defects);
    } catch (error) {
        console.error('Error al obtener defectos:', error);
        res.status(500).json({ 
            message: 'Error al obtener los defectos',
            error: error.message 
        });
    }
});

// Crear un nuevo defecto
router.post('/', auth, async (req, res) => {
    try {
        const { processArea, defectType, description, quantity, date } = req.body;
        console.log('Creando nuevo defecto:', req.body);

        const [result] = await db.query(
            `INSERT INTO defects (process_area, defect_type, description, quantity, date, user_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [processArea, defectType, description, quantity, date, req.user.userId]
        );

        res.status(201).json({ 
            message: 'Defecto creado exitosamente',
            defectId: result.insertId 
        });
    } catch (error) {
        console.error('Error al crear defecto:', error);
        res.status(500).json({ 
            message: 'Error al registrar el defecto',
            error: error.message 
        });
    }
});

module.exports = router;