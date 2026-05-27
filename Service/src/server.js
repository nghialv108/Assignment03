const env = require('./Share/config/enviroment');
const express = require('express');
const app = express();
const { checkConnection } = require('./Share/config/db.config');

app.use(express.json());

// Import Routes
const userRoutes = require('./modules/User/user.route');
const categoryRoutes = require('./modules/Category/category.route');
const bookRoutes = require('./modules/Book/book.route');
const borrowRoutes = require('./modules/BorrowRecord/borrowRecord.route');

// Định tuyến
app.use('/service/users', userRoutes);
app.use('/service/categories', categoryRoutes);
app.use('/service/books', bookRoutes);
app.use('/service/borrows', borrowRoutes);

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`🚀 Service is running on http://localhost:${PORT}`);
    await checkConnection(); // Kiểm tra DB khi khởi động
});