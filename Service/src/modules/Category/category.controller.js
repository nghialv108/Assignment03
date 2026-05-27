const { pool } = require('../../Share/config/db.config');
const { Category, validateCategory } = require('./category.model');

const CategoryController = {
    getAllCategories: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM Categories');
            res.status(200).json(rows.map(row => new Category(row)));
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    },

    getCategoryById: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM Categories WHERE id = ?', [req.params.id]);
            if (rows.length === 0) return res.status(404).json({ message: 'Category not found' });
            res.status(200).json(new Category(rows[0]));
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    },

    createCategory: async (req, res) => {
        // KHÔNG CẦN CHECK IF ROLE NỮA - ROUTE ĐÃ CHẶN!
        const errors = validateCategory(req.body);
        if (errors.length > 0) return res.status(400).json({ errors });

        try {
            await pool.query('INSERT INTO Categories (name, description) VALUES (?, ?)',
                [req.body.name, req.body.description || '']
            );
            res.status(201).json({ message: 'Tạo danh mục thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const [result] = await pool.query('UPDATE Categories SET name = ?, description = ? WHERE id = ?',
                [req.body.name, req.body.description, req.params.id]
            );
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
            res.status(200).json({ message: 'Cập nhật thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const [result] = await pool.query('DELETE FROM Categories WHERE id = ?', [req.params.id]);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    }
};

module.exports = CategoryController;