# TaskManagement

Ứng dụng quản lý công việc (Task Management) được xây dựng bằng Node.js và Express, phục vụ cho nhóm Team For One.

## 📋 Mô tả

Dự án này cung cấp một hệ thống quản lý công việc hoàn chỉnh với các tính năng xác thực người dùng, quản lý tasks và API RESTful.

## 🚀 Công nghệ sử dụng

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT (jsonwebtoken)** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables management

## 📁 Cấu trúc dự án

```
TaskManagement/
├── configs/          # Cấu hình database và các services
├── controllers/      # Xử lý business logic
├── middlewares/      # Middleware functions (auth, validation, etc.)
├── models/          # Database models
├── routes/          # API routes
├── utils/           # Utility functions
├── views/           # View templates
├── server.js        # Entry point
└── package.json     # Dependencies
```

## ⚙️ Cài đặt

### Yêu cầu

- Node.js (v14 trở lên)
- MySQL Server
- npm hoặc yarn

### Các bước cài đặt

1. Clone repository:
```bash
git clone https://github.com/NvkhoaDev54/TaskManagement.git
cd TaskManagement
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` và cấu hình các biến môi trường:
```env
PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=task_management
JWT_SECRET=your_jwt_secret_key
```

4. Thiết lập database MySQL (tạo database và các tables cần thiết)

5. Chạy ứng dụng:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🔧 Scripts

- `npm test` - Chạy tests
- `npm start` - Khởi động server
- `npm run dev` - Chạy ở chế độ development với nodemon

## 📝 API Endpoints

(Cập nhật các endpoints cụ thể của dự án)

```
# Authentication
POST /api/auth/register - Đăng ký tài khoản
POST /api/auth/login - Đăng nhập

# Tasks
GET /api/tasks - Lấy danh sách tasks
POST /api/tasks - Tạo task mới
PUT /api/tasks/:id - Cập nhật task
DELETE /api/tasks/:id - Xóa task
```

## 🔐 Bảo mật

- Mật khẩu được mã hóa bằng bcrypt
- Xác thực sử dụng JWT tokens
- CORS được cấu hình để bảo vệ API

## 👥 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

ISC

## 👨‍💻 Tác giả

**Team For One**

- GitHub: [@NvkhoaDev54](https://github.com/NvkhoaDev54)

## 🙏 Lời cảm ơn

Cảm ơn tất cả những người đã đóng góp cho dự án này!

---

⭐ Nếu thấy dự án hữu ích, hãy star repository này!