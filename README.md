# Giao diện mua bán thiết bị nhiếp ảnh

Dự án **Giao diện mua bán thiết bị nhiếp ảnh** (Photography Equipment Trading Platform) là một ứng dụng đa nền tảng, bao gồm cả nền tảng Web và thiết bị di động (Mobile). Dự án được thiết kế để cung cấp trải nghiệm mượt mà, hiện đại và tối ưu cho người dùng khi mua bán, trao đổi các thiết bị nhiếp ảnh.

## 🛠 Công nghệ sử dụng

Dự án được chia làm hai phần chính với các công nghệ tương ứng:

### 1. Web Application (Thư mục gốc)
- **Framework**: React 18 kết hợp với Vite.
- **Styling**: Tailwind CSS (v4) để tăng tốc độ xây dựng giao diện.
- **UI Components**: 
  - [Radix UI](https://www.radix-ui.com/) cho các component cơ bản, đảm bảo khả năng truy cập (accessibility).
  - Material UI (MUI) cho một số component nâng cao.
- **Animation**: Framer Motion (`motion`).
- **Khác**: React Router (Routing), Embla Carousel, Recharts (Biểu đồ), React Hook Form, ...

### 2. Mobile Application (Thư mục `/mobile`)
- **Framework**: React Native và Expo.
- **Styling**: NativeWind (sử dụng Tailwind CSS cho React Native).
- Ứng dụng di động được chuyển đổi và đồng bộ thiết kế từ phiên bản Web.

---

## 📂 Cấu trúc thư mục

```text
Frontend/
├── src/                # Mã nguồn chính của phiên bản Web (Components, Pages, Assets,...)
├── mobile/             # Mã nguồn của phiên bản Mobile App (React Native/Expo)
├── guidelines/         # Các tài liệu hoặc hướng dẫn phát triển
├── package.json        # Cấu hình dependencies cho Web
├── vite.config.ts      # Cấu hình Vite
└── README.md           # File giới thiệu dự án
```

---

## 🚀 Hướng dẫn khởi chạy dự án

### Chạy phiên bản Web Application

1. Mở terminal tại thư mục gốc của dự án (`Frontend/`).
2. Cài đặt các gói phụ thuộc (dependencies):
   ```bash
   npm install
   ```
3. Khởi chạy server phát triển:
   ```bash
   npm run dev
   ```
4. Truy cập địa chỉ http://localhost:5173 (hoặc port được hiển thị trên terminal) để xem ứng dụng.

### Chạy phiên bản Mobile Application

1. Di chuyển vào thư mục `mobile`:
   ```bash
   cd mobile
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi chạy server Expo:
   ```bash
   npx expo start
   ```
4. Sử dụng ứng dụng **Expo Go** trên điện thoại để quét mã QR (hoặc chạy trên các trình giả lập Android/iOS).

---

## 🎨 Thiết kế gốc (Design)
Bản thiết kế giao diện gốc trên Figma có thể được tham khảo tại:
👉 [Giao diện mua bán thiết bị nhiếp ảnh - Figma](https://www.figma.com/design/zWRnV8ly0ogNpLNMXmGH9J/Giao-di%E1%BB%87n-mua-b%C3%A1n-thi%E1%BA%BFt-b%E1%BB%8B-nhi%E1%BA%BFp-%E1%BA%A3nh)
