# Thiệp 20/10 — Chúc mừng ngày Phụ nữ Việt Nam

Trang thiệp tĩnh single-page, mobile-first, giao diện sáng (light-only), xây bằng Vite 7 + Tailwind CSS 4. Không có runtime dependency nào; chỉ dùng Google Fonts (Be Vietnam Pro + Playfair Display).

## Tính năng

- **Mật khẩu mở thiệp**: trang hiển thị màn hình khóa; nhập mật khẩu `2010` để vào thiệp. Nhập sai sẽ rung + hiện lỗi inline, nhấn Enter cũng gửi được.
- **Thiệp lời chúc**: tấm thiệp nhỏ nằm bên phải bó hoa; bấm vào (hoặc Enter) mở thư giấy kem viền vintage với lời chúc cố định hiện dần từng chữ (hiệu ứng đánh máy, con trỏ nhấp nháy). Mở lại sẽ chạy lại hiệu ứng. `prefers-reduced-motion` → hiện toàn bộ lời chúc ngay lập tức.
- **Bó hoa SVG**: minh họa vector thuần vẽ tay (hoa loa kèn, cẩm chướng, hồng, lá dương xỉ, giấy gói họa tiết cổ điển, ruy băng lụa), có hoạt ảnh vào trang và đung đưa rất nhẹ.
- **Cánh hoa bay**: canvas cánh hoa rơi nhẹ trong hero, tự động tắt khi `prefers-reduced-motion`.
- **Chia sẻ**: nút "Chia sẻ thiệp" nằm ngay dưới bó hoa (trong hero) dùng Web Share API; trình duyệt không hỗ trợ thì sao chép liên kết và hiện toast "Đã sao chép liên kết!". Credit "created by @NTK <3" ngay bên dưới.

## Chạy dự án

```bash
npm install
npm run dev       # máy chủ phát triển
npm run build     # build production vào dist/
npm run preview   # xem thử bản build
```

## Deploy

Build xuất ra thư mục `dist/`. Khi deploy lên sub-path (ví dụ GitHub Pages), set biến môi trường `BASE_PATH` trước khi build:

```bash
BASE_PATH=/<ten-repo>/ npm run build
```

Sau đó publish toàn bộ nội dung thư mục `dist/`.
# 2010
