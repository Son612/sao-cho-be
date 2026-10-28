# AGENTS.md — Sao cho bé

Ghi chú của dự án, dùng chung cho **Claude** (qua `CLAUDE.md` → `@AGENTS.md`) và **ChatGPT/Codex**. Quy tắc chung nằm ở kho riêng `Son612/ai-rules`.

**Kho này CÔNG KHAI** (GitHub Pages: https://son612.github.io/sao-cho-be/). Không ghi vào đây (và không đưa vào code) thông tin riêng của gia đình: tên, ngày sinh, địa chỉ Apps Script, mã PIN.

- Ghi chú mới về dự án: ghi vào file này, không ghi vào `CLAUDE.md`.
- **Đưa lên web = đẩy lên nhánh `main`** (GitHub Pages tự cập nhật sau ~1 phút). Trước khi đẩy: tăng số `CACHE` trong `sw.js` để iPhone/iPad tải bản mới.
- Từ 28/10/2026 mã nguồn nằm thẳng ở kho này (trước đó ở kho riêng `cloude-code` rồi chép sang bằng `dang-len-web.sh` — đã bỏ).

## Dự án
- `index.html` — app tích sao cho trẻ từ 3 tuổi: bé chạm vào việc đã làm (hình to, có giọng đọc tiếng Việt) để nhận sao, tích sao đổi quà. Một file HTML, không thư viện ngoài, lưu dữ liệu bằng `localStorage` trên máy đang dùng.
  - Nhiều bé, mỗi bé có độ tuổi (nhỏ 3–6 / lớn 7+) và danh sách việc, quà riêng (`kidIds`); bé mới tự có bộ gợi ý hợp tuổi. Việc đã làm đủ số lần hôm nay **vẫn ở trên màn hình**, hiện ✓ xanh (người dùng đổi ý 22/10/2026, trước đó cho biến mất), sang ngày mới tự bỏ dấu; làm hết thì có dòng khen gọn phía trên.
  - Khu bố mẹ khoá bằng mã PIN 4 số (quên mã thì nhập mã khôi phục 8 số): sửa bé/việc/quà, +/− sao, bỏ đánh dấu, lịch sử.
  - Ngày sinh (`dob`) → tự tính tuổi, chúc mừng sinh nhật; "bé lớn" = từ mốc tuổi `shared.bigAge` (mặc định 7; chưa có ngày sinh thì theo `age`). Chỉ bé lớn có: chuỗi ngày, ngày nghỉ phép (`leave_earn` khi chuỗi chia hết `leaveDays`=7, `leave_use` giữ chuỗi không đứt nhưng không cộng ngày), đổi sao lấy tiền (`shared.cash`, sự kiện `cash`).
  - Quỹ sao chung (riêng với sao cá nhân, không có nút góp sao cá nhân): "bé" đặc biệt `FUND='fund'` trong sổ sao. Việc chung (`task.fund`) ghi sao vào quỹ (`kid: FUND`, `by` = bé bấm), một bé làm là xong cho cả nhà, không tính vào chuỗi/"Hôm nay" của bé. Quà có `kidIds` chứa `fund` là quà chung đổi bằng quỹ. Nút "Thêm gợi ý việc chung" gán "Chơi không làm em bé khóc" cho anh giữa.
  - Việc có `max` lần/ngày (vd. rửa tay 3 lần); mỗi lần ghi `n` thứ tự, chống bấm trùng theo `kid|day|task|n`. Số sao không bao giờ âm (cộng dồn có sàn 0).
  - Giọng đọc dùng giọng có sẵn của máy (`speechSynthesis`); tab "Giọng nói" trong khu bố mẹ cho chọn giọng, tốc độ, độ cao, tự ưu tiên giọng Natural/Premium/Enhanced. 
  - Đồng bộ nhiều máy qua Google Trang tính của gia đình (tab "Đồng bộ"): đoạn Apps Script nằm ngay trong `index.html` (`<script id="gsCode">`), người dùng tự triển khai thành Ứng dụng web rồi dán URL vào app. Số sao = cộng "sổ sao" (`events`, chỉ thêm, không sửa); bé/việc/quà gộp theo bản sửa sau cùng (`u`, xoá = `del`); cùng việc bấm trùng trên 2 máy chỉ tính một lần. Thử đồng bộ trên máy: `node gia-lap-google.js index.html`, mở app ở `localhost` và `127.0.0.1` (hai "máy"), đổi fetch `script.google.com/...` sang `localhost:8766`.
  - **Đăng lên web**: tăng `CACHE` trong `sw.js` rồi đẩy lên `main`. Không bao giờ đưa mã đồng bộ (URL Apps Script) của gia đình vào code.
  - Thưởng chuỗi ngày (`streakCfg`, sự kiện `type: 'streak'`), biểu tượng thêm/bớt được (`shared.emoji`), quên PIN dùng mã khôi phục 8 số (`shared.rec`; PIN + mã khôi phục hiện ở cột Tên dòng 🔑 trong Google Trang tính). Các cài đặt chung này nằm trong `shared`, đồng bộ theo bản sửa sau cùng.
  - Là PWA để cài lên iPhone/iPad (Chia sẻ → Thêm vào MH chính): `manifest.webmanifest`, `sw.js` (lưu sẵn để chạy không mạng — **tăng số `CACHE` trong `sw.js` mỗi lần sửa app** — số này hiện thành "phiên bản N" cuối khu bố mẹ; sw tải lại bằng `cache: 'no-cache'/'reload'` để không dính bản GitHub còn giữ ~10 phút), biểu tượng vẽ ở `icon.svg`, xuất PNG vào `icons/`. Có sao lưu/khôi phục dữ liệu ra file JSON (tab Lịch sử).
  - Chạy thử: `open index.html` (service worker chỉ chạy qua http, dùng cấu hình `web-tinh` trong `.claude/launch.json`).
