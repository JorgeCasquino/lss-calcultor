const db = require('../config/database');

class User {
    static async findByEmail(email) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(userData) {
        try {
            const { username, email, password } = userData;
            const [result] = await db.query(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, password]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;