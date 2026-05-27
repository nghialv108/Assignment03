const { pool } = require('../../Share/config/db.config');
const { Book, validateBook } = require('./book.model');

const BookController = {
    getAllBooks: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM Books');
            res.status(200).json(rows.map(row => new Book(row)));
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    },

    getBookById: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM Books WHERE id = ?', [req.params.id]);
            if (rows.length === 0) return res.status(404).json({ message: 'Book not found' });
            res.status(200).json(new Book(rows[0]));
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    },

    createBook: async (req, res) => {
        const errors = validateBook(req.body);
        if (errors.length > 0) return res.status(400).json({ errors });

        try {
            const { title, author, category_id, description, total_copies } = req.body;
            const copies = total_copies || 1;

            await pool.query(
                `INSERT INTO Books (title, author, category_id, description, total_copies, available_copies) VALUES (?, ?, ?, ?, ?, ?)`,
                [title, author, category_id, description || '', copies, copies]
            );
            res.status(201).json({ message: 'Thêm sách thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    },

    updateBook: async (req, res) => {
        try {
            const { title, author, category_id, total_copies, available_copies } = req.body;
            const [result] = await pool.query(
                `UPDATE Books SET title = ?, author = ?, category_id = ?, total_copies = ?, available_copies = ? WHERE id = ?`,
                [title, author, category_id, total_copies, available_copies, req.params.id]
            );
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Book not found' });
            res.status(200).json({ message: 'Cập nhật thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    },

    deleteBook: async (req, res) => {
        try {
            const [result] = await pool.query('DELETE FROM Books WHERE id = ?', [req.params.id]);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Book not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    }
};

module.exports = BookController;