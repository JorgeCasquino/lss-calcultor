const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/database');

// Obtener datos del dashboard
router.get('/', auth, async (req, res) => {
    try {
        // Obtener todos los defectos del usuario
        const [defects] = await db.query(
            `SELECT 
                process_area,
                defect_type,
                quantity,
                date
             FROM defects 
             WHERE user_id = ?
             ORDER BY date DESC`,
            [req.user.userId]
        );

        // Calcular métricas
        const totalDefects = defects.reduce((sum, defect) => sum + defect.quantity, 0);
        const opportunities = defects.length * 1000000; // Ejemplo simple
        const dpmo = Math.round((totalDefects / opportunities) * 1000000);
        const yieldRate = 100 - (dpmo / 10000);

        // Agrupar por área
        const defectsByArea = {};
        defects.forEach(defect => {
            if (!defectsByArea[defect.process_area]) {
                defectsByArea[defect.process_area] = 0;
            }
            defectsByArea[defect.process_area] += defect.quantity;
        });

        // Agrupar por mes
        const defectsByMonth = {};
        defects.forEach(defect => {
            const month = new Date(defect.date).toISOString().slice(0, 7);
            if (!defectsByMonth[month]) {
                defectsByMonth[month] = 0;
            }
            defectsByMonth[month] += defect.quantity;
        });

        res.json({
            kpis: {
                dpmo,
                sigma: calculateSigmaLevel(dpmo),
                yield: yieldRate.toFixed(2),
                totalDefects
            },
            defectsByArea: Object.entries(defectsByArea).map(([area, count]) => ({
                area,
                count
            })),
            defectTrend: Object.entries(defectsByMonth).map(([month, count]) => ({
                month,
                defects: count
            }))
        });
    } catch (error) {
        console.error('Error en dashboard:', error);
        res.status(500).json({ message: 'Error al obtener datos del dashboard' });
    }
});

// Función para calcular el nivel sigma
function calculateSigmaLevel(dpmo) {
    // Cálculo simplificado del nivel sigma
    return (0.8406 + Math.sqrt(29.37 - 2.221 * Math.log(dpmo))).toFixed(2);
}

module.exports = router;