# F2S Lab — Demo tương tác Two-Stream Fourier

WebApp tĩnh tiếng Việt minh họa đề tài **“Triệt tiêu hiện tượng học vẹt (Shortcut Learning) và ảo giác OOD trong Transformer”** theo poster do nhóm nghiên cứu cung cấp.

## Chạy tại máy

Mở `index.html` bằng trình duyệt; không yêu cầu cài gói thư viện, tài khoản hay backend.

Hoặc chạy web server cục bộ:

```bash
python -m http.server 8000
```

Truy cập `http://localhost:8000`.

## Đưa lên GitHub và Vercel

1. Tạo repository GitHub, tải **các tệp trong thư mục này** vào gốc repository (hoặc push bằng Git).
2. Truy cập Vercel → Add New → Project → Import repository GitHub.
3. Chọn Framework Preset **Other**; Root Directory là thư mục chứa `index.html`.
4. Không cần Build Command; nhấn Deploy.

Tệp `vercel.json` giúp Vercel phục vụ web tĩnh.

## Chức năng

- Bảng quy chế giả lập 10 điều có thể chỉnh sửa / khôi phục.
- Tra cứu xuôi (`!n`) và ngược (`?x`), quan sát một kiểu lỗi học đường tắt được mô phỏng.
- Minh họa hai kịch bản OOD và số liệu đối chứng được trích từ poster.
- Trực quan mã Fourier K=1, ma trận độ tương đồng tuần hoàn, can thiệp ablation.
- Trang nêu rõ phạm vi nghiên cứu và giới hạn.

## Nguồn và tính trung thực

**Không có mô hình AI thật đang chạy trong ứng dụng này.** Các câu trả lời F2S trong mục tra cứu là tra cứu xác định từ bảng; các câu trả lời GPT-2 được giả lập để giải thích loại lỗi, không phải dự đoán của checkpoint. Đồ thị và các tỷ lệ phần trăm được chép theo poster, không phải kết quả đo độc lập.

Poster báo cáo: F2S 3.920 tham số, OOD 100% ở cả hai kịch bản, GPT-2 chuẩn 4.704 tham số có độ chính xác 0,08% (kịch bản 1) và 0% (kịch bản 2); GPT-2 lớn 58.896 tham số có độ chính xác 0% và 0,04%. Ablation tắt L2H0 cho kết quả khoảng 3,3% với câu hỏi “Điều n” và 100% với câu hỏi ngược. Đây là số liệu *do poster công bố*.

Để chứng thực thực nghiệm phải tích hợp bộ mã mô hình, checkpoint, tập dữ liệu, cơ chế đánh giá và quy trình tái lập.
