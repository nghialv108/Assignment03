class BorrowRecord {
    constructor(dbRecord) {
        this.id = dbRecord.id;
        this.user_id = dbRecord.user_id;
        this.book_id = dbRecord.book_id;
        this.borrow_date = dbRecord.borrow_date;
        this.due_date = dbRecord.due_date;
        this.return_date = dbRecord.return_date;
        this.status = dbRecord.status;
    }
}

const validateBorrowRecord = (data) => {
    const errors = [];
    if (!data.book_id) errors.push('Thiếu ID sách (book_id)');
    if (!data.due_date) errors.push('Thiếu ngày hẹn trả (due_date)');
    return errors;
};

module.exports = { BorrowRecord, validateBorrowRecord };