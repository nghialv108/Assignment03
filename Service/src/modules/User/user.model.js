class User {
    constructor(dbRecord) {
        this.id = dbRecord.id;
        this.name = dbRecord.name;
        this.email = dbRecord.email;
        this.role = dbRecord.role;
        this.phone = dbRecord.phone;
        this.status = dbRecord.status;
    }
}

const validateUser = (data) => {
    const errors = [];
    if (!data.name) errors.push('Tên không được để trống');
    if (!data.email || !data.email.includes('@')) errors.push('Email không hợp lệ');
    if (!data.password || data.password.length < 6) errors.push('Mật khẩu tối thiểu 6 ký tự');
    return errors;
};

module.exports = { User, validateUser };