class Book {
    constructor(dbRecord) {
        this.id = dbRecord.id;
        this.title = dbRecord.title;
        this.author = dbRecord.author;
        this.category_id = dbRecord.category_id;
        this.description = dbRecord.description;
        this.total_copies = dbRecord.total_copies;
        this.available_copies = dbRecord.available_copies;
    }
}

const validateBook = (data) => {
    const errors = [];
    if (!data.title) errors.push('Tên sách không được để trống');
    if (!data.author) errors.push('Tên tác giả không được để trống');
    if (!data.category_id) errors.push('Thiếu mã danh mục (category_id)');
    return errors;
};

module.exports = { Book, validateBook };