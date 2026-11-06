# SECOND ME — The Emberforge

Game giải đố hành động bằng React, TypeScript và Vite.

## Nội dung

- 5 màn giải đố dùng Echo để giữ ấn thạch và mở cổng.
- Mỗi chặng có giới hạn 6 giây; chạm đúng ấn thạch kế tiếp để nạp lại thời gian.
- Bẫy dập, đá rơi và dây leo làm chậm tăng dần theo từng màn.
- Thu thập 5 di vật, rèn Kiếm Echo và đánh boss ở màn 6.
- Tiến độ được lưu trong trình duyệt.

## Chạy dự án

```bash
pnpm install
pnpm dev
```

Mở `http://localhost:3000`.

## Điều khiển

- `WASD` hoặc phím mũi tên: di chuyển
- `R`: bắt đầu/dừng ghi đường đi
- `E`: gọi Echo
- `Q`: xóa Echo
- `J` hoặc `Space`: chém kiếm khi đánh boss
- `Shift`: lướt né
- `Esc`: tạm dừng
- `T`: chơi lại màn

## Kiểm tra

```bash
pnpm exec tsx --test src/game/GameEngine.test.ts src/game/logic/*.test.ts
pnpm exec tsc --noEmit
pnpm build
```

Hiện có 40 bài kiểm tra tự động cho Echo, cổng, bẫy, đồng hồ, chiến dịch và boss.
