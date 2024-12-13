const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authController = {
    // Registro de usuario
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            
            // Verificar si el usuario ya existe
            const [existingUsers] = await db.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({ message: 'El email ya está registrado' });
            }

            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insertar nuevo usuario
            await db.query(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword]
            );

            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({ message: 'Error al registrar usuario' });
        }
    },

    // Login de usuario
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Buscar usuario
            const [users] = await db.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            const user = users[0];

            // Verificar contraseña
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Generar token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ message: 'Error al iniciar sesión' });
        }
    }
};

module.exports = authController;