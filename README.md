# Photography Equipment Rental & Marketplace (Mobile App)

Ứng dụng di động mua bán và cho thuê thiết bị nhiếp ảnh cao cấp, được chuyển đổi từ phiên bản Web sang React Native bằng Expo và NativeWind.

## 📱 Công nghệ sử dụng
- **React Native** (với nền tảng Expo): Giúp hỗ trợ chạy trên cả Android và iOS.
- **Expo Router**: Tính năng định tuyến mới nhất của Expo, điều hướng dựa trên cấu trúc file (File-based Routing).
- **NativeWind (Tailwind CSS)**: Hỗ trợ viết styling giao diện ngay trong component bằng các class của Tailwind CSS.
- **Lucide React Native**: Cung cấp bộ thư viện biểu tượng dạng Vector SVG sắc nét, đồng bộ với bản Web.

## 🚀 Hướng dẫn cài đặt và sử dụng

### 1. Yêu cầu môi trường
- Máy tính của bạn cần cài đặt **Node.js** (Khuyến nghị bản >= 18).
- Cài phần mềm **Expo Go** trên điện thoại (tải từ App Store hoặc Google Play) để có thể scan mã QR chạy app thực tế.

### 2. Cài đặt các thư viện
Di chuyển vào vị trí thư mục `mobile` chứa bộ mã nguồn ứng dụng di động:
```bash
cd mobile
npm install
```

### 3. Chạy ứng dụng (Development Server)
Sau khi cài đặt xong, hãy chạy lệnh dưới đây để bắt đầu server của Expo:
```bash
npm start
```

### 4. Hiển thị ứng dụng:
- **Ngay trên điện thoại thực**: Hãy lấy điện thoại mở app Expo Go và scan mã QR hiện ra trong màn hình Terminal. App sẽ tự động tải bundle về và hiển thị như một ứng dụng Native thực thụ!
- **Trên máy ảo iOS/Android**: 
  - Nếu bạn bấm phím `i` trong terminal, Expo sẽ chạy trên iOS Simulator (cần có macOS/xcode).
  - Nếu bạn bấm phím `a` trong terminal, Expo sẽ khởi động Android Emulator (nếu đã bật Android Studio).
- **Trên nền tảng Web**: Bấm `w` để build giao diện ra dạng web (dành cho browser).

## 💡 Cấu trúc dự án
- `/app/(tabs)`: Chứa chức năng màn hình chính có Bottom Tabs (Khám phá, Giao dịch, Thông báo, Hồ sơ).
- `/app/equipment/[id].tsx`: Màn hình riêng lẻ xem chi tiết một sản phẩm (Dynamic Route).
- `tailwind.config.js` & `babel.config.js`: Được thiết lập để render NativeWind ngay bên trong React Native.
