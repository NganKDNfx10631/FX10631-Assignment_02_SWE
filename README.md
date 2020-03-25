# Hướng dẫn sử dụng hệ thống dịch của FUNiX

Hướng dẫn sử dụng các công cụ, hệ thống dịch thuật của FUNiX.
Cập nhật ngày `08/03/2020`

## Mục lục

* FUNiX Subtitle:
   * Thêm file phụ đề cho video trên `Udemy`.
   * Thêm file phụ đề cho các nguồn khác.
   * Bảng ID.
* FUNiX Onpage:
* FUNiX Subtitle Downloader:
   * Tải phụ đề từ `Udemy`.
   * Tải phụ đề từ `applieddigitalskills`.
* FUNiX Admin:
   * Thêm tài khoản cho CTV.

## FUNiX Subtitle

### Thêm file phụ đề cho video trên `Udemy`.

B1: Truy cập vào trang [Subtitle Admin](https://funix-subtitle.firebaseapp.com/) --> `Add Udemy Video`.<br/>
B2: Điền các thông tin
* `Udemy Link`: Link bài học trên Udemy.
* `Lession Name`: Tên bài học.
* `EN`: File phụ đề tiếng Anh.
* `VI`: File phụ đề tiếng Việt.

B3: Nhấn `Add New` để thêm phụ đề.

### Thêm file phụ đề cho các nguồn khác.

B1: Truy cập vào trang [Subtitle Admin](https://funix-subtitle.firebaseapp.com/) --> `Add other subtitle`.<br/>
B2: Điền các thông tin
* `Page ID`: ID của trang chứa video. Để xem pageID là gì thì tìm trong phần `Bảng ID`
* `Video ID`: ID của Video.
* `Lession Name`: Tên Video.
* `EN`: File phụ đề tiếng Anh.
* `VI`: File phụ đề tiếng Việt.

B3: Nhấn `Add New` để thêm phụ đề.

### Bảng ID

|Web| Page ID|
| ------------- |-------------|
| Youtube | youtube |
| Applieddigitalskills | applieddigitalskills |
| Edx | edx |

## FUNiX Onpage

## FUNiX Subtitle Downloader

### Tải phụ đề từ `Udemy`.

B1: Nhấn vào biểu tượng của extension trên thanh công cụ của Chrome --> `Download Udemy Subtitle`.<br/>
B2: Nhập ID course muốn lấy file phụ đề trên udemy và `Udemy key`.<br/>
B3: Nhấn nút “Download” để tiến hành tải về.<br/>

**Cách lấy ID khóa học trên Udemy:**
B1: Vào trang web giới thiệu khóa học đó.<br/>
B2: Url của trang giới thiệu sẽ có dạng `https://www.udemy.com/course/<id>/` . Chỉ cần copy phần id là được.<br/>
![Link](https://i.imgur.com/1JPccxx.png)
Ví dụ: ID của khóa học “https://www.udemy.com/course/html-and-css-for-beginners-crash-course-learn-fast-easy/” sẽ là **html-and-css-for-beginners-crash-course-learn-fast-easy**.

**Cách lấy Key theo tài khoản của Udemy:**
B1: Vào 1 video bất kỳ của khóa học đó.<br/>
B2: Nhấp `F12` để mở của sổ Dev tool, vào tab `Network`.<br/>
![](https://i.imgur.com/PkgX1QB.png)
B3: Trong phần `Fillter`, nhập **view-logs** để tìm kiếm.<br/>
![](https://i.imgur.com/rBYCOB4.png)
B4: Sau khi đã được như hình ảnh trên, ở mục `Headers` hãy kéo xuống phần `Request Header`. Tìm kiếm mục `authorization`, nội dung của mục đó sẽ có dạng như sau: `Bearer <key>`, hãy copy phần **<key>** đó vào.<br/>
![](https://i.imgur.com/m9vkjwo.png)

**Một số thông báo lỗi thường gặp**

1. **“Fill all infomations!”**: Hãy nhập đầy đủ các thông tin.
2. **“Not found that course'id”**: Kiểm tra lại id đã đúng chưa.
3. **“Key is not true, find new key!”**: Hãy lấy lại key theo hướng dẫn ở III và thử lại.

### Tải phụ đề từ `applieddigitalskills`

B2: Nhấn vào icon trên thanh công cụ để mở menu, nhấn vào: `DOWNLOAD APPLIEDDIGITALSKILLS SUBTITLE`. <br/>
B3: Nhập URL của trang applieddigitalskills cần tải phụ đề và nhấn “Download”.

## FUNiX Admin

### Thêm tài khoản cho CTV

B1: Vào trang Admin --> `Account Manager` <br/>
B2: Nhập email của CTV. <br/>
B3: Nhấn Add để thêm email đó vào hệ thống.
