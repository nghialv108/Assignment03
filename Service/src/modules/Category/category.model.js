class Category {
    constructor(dbRecord) {
        this.id = dbRecord.id;
        this.name = dbRecord.name;
        this.description = dbRecord.description;
    }
}

const validateCategory = (data) => {
    const errors = [];
    if (!data.name) errors.push('Tên danh mục không được để trống');
    return errors;
};

module.exports = { Category, validateCategory };