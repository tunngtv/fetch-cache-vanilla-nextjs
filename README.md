# Hiểu hơn về 'cache' trong Fetch với VanillaJS và Next.js

Trong các ứng dụng **frontend**, việc gửi yêu cầu **API** từ phía client là chuyện cơm bữa. Hầu hết chúng ta đều chọn dùng **axios** — đơn giản, tiện lợi, dễ kiểm soát lỗi, và thân thiện với async/await.

Khi kết hợp với **React Query**, việc quản lý cache thậm chí còn dễ dàng hơn nữa. Tự động cache, tự động refetch, stale time, và nhiều thứ thú vị khác giúp cho trải nghiệm dev mượt mà hơn.

## Nhưng chuyện không dừng lại ở đó...

Một ngày đẹp trời, khi đọc tài liệu về cache trong **Next.js**, và vô tình phát hiện điều này: `force-cache` là mặc định khi dùng `fetch`. Tôi khựng lại.

> "Khoan đã, fetch mặc định cache à? Mình nhớ đâu có như vậy?"

Thật ra, đây là một hành vi **đặc trưng riêng của Next.js**, không phải của `fetch` nói chung trong trình duyệt. Điều này khiến tôi bắt đầu nghi ngờ về hiểu biết của mình đối với `fetch` — một API tưởng chừng như quá quen thuộc.

## Vậy thực chất `fetch` hoạt động như thế nào?

Tôi quay lại với [**MDN**](https://developer.mozilla.org/en-US/docs/Web/API/Request/cache), và tại đây ghi rõ: thuộc tính `cache` của `Request` sẽ quyết định cách cache được sử dụng. Và mặc định, `fetch` có thể trả về dữ liệu từ cache nếu có bản sao phù hợp và còn hạn.

> 🧠 _"If there is a match and it is fresh, it will be returned from the cache."_ — [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Request/cache)

Thú thực, trước giờ tôi chưa từng để ý đến điều này. Nói cách khác: `fetch` **có hỗ trợ cache**, nhưng hành vi cụ thể lại phụ thuộc vào môi trường và cấu hình.

## Thử nghiệm thực tế

Tôi thử tìm kiếm các ví dụ rõ ràng minh họa cache behavior của `fetch`, nhưng phần lớn tài liệu chỉ nói đến lý thuyết. Không thỏa mãn, tôi quyết định **tự tay thử nghiệm** và ghi lại quá trình. Ai biết được — biết đâu có người cũng đang băn khoăn như mình?

---

## Tổng quan nội dung

Chúng ta sẽ lần lượt đi qua:

- [Tổng quan về Cache](#cache--các-chế-độ-có-sẵn)
- Cách hoạt động của Fetch Cache trong **trình duyệt (Vanilla JS)**
- Cách hoạt động của Fetch Cache trong **Next.js (SSR)**
- Một số lưu ý & Kết luận

---

## Cache — Các chế độ có sẵn

Theo tài liệu chính thức, thuộc tính `cache` có thể nhận các giá trị sau:

| Giá trị          | Mô tả ngắn gọn                             |
|------------------|--------------------------------------------|
| `default`        | Dùng cache nếu phù hợp                     |
| `force-cache`    | Luôn ưu tiên lấy từ cache                  |
| `only-if-cached` | Chỉ lấy nếu cache có sẵn                   |
| `reload`         | Luôn gửi request mới, bỏ qua cache         |
| `no-store`       | Không ghi và không đọc từ cache            |
| `no-cache`       | Gửi request mới, có thể lưu cache nếu có   |

> ℹ️ Trong bài viết này, ta sẽ **bỏ qua `no-cache`** vì nó liên quan đến **Conditional Requests**, có thể khiến chủ đề bị loãng.

## Fetch Cache với VanilaJS

### Cấu trúc ví dụ và vai trò của Cache-Control

![Kết quả thử nghiệm cache](/assets/overview-fetch-with-vanilajs.webp)

Trong ví dụ này, chúng ta sẽ cùng tìm hiểu cách header `Cache-Control` ảnh hưởng đến phản hồi từ API. Cụ thể, khi bật `Cache-Control`, API `random-items` sẽ trả về dữ liệu kèm theo header sau:

```bash
Cache-Control: private, max-age=5
```

Trong đó, `max-age` cho trình duyệt biết rằng nó được phép lưu lại dữ liệu trong cache tối đa **5 giây** trước khi cần gửi request mới.

Để thấy rõ sự khác biệt, tôi sẽ lần lượt trình bày hai trường hợp:

- **Không có header `Cache-Control`**
- **Có header `Cache-Control`**

Chúng ta sẽ quan sát phản hồi và hành vi cache ở từng trường hợp để hiểu rõ tác động thực tế của cấu hình này.

