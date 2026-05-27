const { pool } = require('../../Share/config/db.config');
const { User, validateUser } = require('./user.model');

const UserController = {
    getAllUsers: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM Users');
            res.status(200).json(rows.map(row => new User(row)));
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM Users WHERE id = ?', [req.params.id]);
            if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
            res.status(200).json(new User(rows[0]));
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    },

    createUser: async (req, res) => {
        const errors = validateUser(req.body);
        if (errors.length > 0) return res.status(400).json({ errors });

        try {
            const { name, email, password, role, phone } = req.body;
            const query = `INSERT INTO Users (name, email, password, role, phone, status) VALUES (?, ?, ?, ?, ?, 'Active')`;
            const [result] = await pool.query(query, [name, email, password, role || 'reader', phone]);

            res.status(201).json({ message: 'Tạo tài khoản thành công', id: result.insertId });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { name, phone, status } = req.body;
            const [result] = await pool.query(`UPDATE Users SET name = ?, phone = ?, status = ? WHERE id = ?`,
                [name, phone, status, req.params.id]
            );
            if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
            res.status(200).json({ message: 'Cập nhật thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const [result] = await pool.query('DELETE FROM Users WHERE id = ?', [req.params.id]);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    }
};

module.exports = UserController;