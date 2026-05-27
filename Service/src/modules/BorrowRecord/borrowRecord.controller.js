const { pool } = require('../../Share/config/db.config');
const { BorrowRecord, validateBorrowRecord } = require('./borrowRecord.model');

const BorrowRecordController = {
    getAllRecords: async (req, res) => {
        try {
            // Lấy thẳng từ req.user do middleware set
            const { id: userId, role } = req.user;

            let query = 'SELECT * FROM BorrowRecords';
            let params = [];

            // Reader chỉ thấy phiếu mượn của họ
            if (role !== 'admin') {
                query += ' WHERE user_id = ?';
                params.push(userId);
            }

            const [rows] = await pool.query(query, params);
            res.status(200).json(rows.map(row => new BorrowRecord(row)));
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    },

    getRecordById: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM BorrowRecords WHERE id = ?', [req.params.id]);
            if (rows.length === 0) return res.status(404).json({ message: 'Record not found' });

            const record = rows[0];
            const { id: userId, role } = req.user;

            // Logic mềm: Không chặn ở route, nhưng nếu Reader cố tình mở phiếu của người khác thì báo lỗi
            if (role !== 'admin' && record.user_id !== userId) {
                return res.status(403).json({ message: 'Bạn không có quyền xem phiếu mượn này' });
            }

            res.status(200).json(new BorrowRecord(record));
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    },

    createRecord: async (req, res) => {
        const errors = validateBorrowRecord(req.body);
        if (errors.length > 0) return res.status(400).json({ errors });

        try {
            const userId = req.user.id;
            const { book_id, due_date } = req.body;

            await pool.query(
                `INSERT INTO BorrowRecords (user_id, book_id, borrow_date, due_date, status) VALUES (?, ?, CURDATE(), ?, 'PENDING')`,
                [userId, book_id, due_date]
            );

            res.status(201).json({ message: 'Tạo yêu cầu mượn sách thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    },

    updateRecord: async (req, res) => {
        try {
            const { status, return_date } = req.body;
            const [result] = await pool.query(`UPDATE BorrowRecords SET status = ?, return_date = ? WHERE id = ?`,
                [status, return_date || null, req.params.id]
            );
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Record not found' });
            res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    },

    deleteRecord: async (req, res) => {
        try {
            const [result] = await pool.query('DELETE FROM BorrowRecords WHERE id = ?', [req.params.id]);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Record not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Lỗi Server', error: error.message });
        }
    }
};

module.exports = BorrowRecordController;