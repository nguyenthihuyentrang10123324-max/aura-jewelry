-- =====================================================
-- AURA Jewelry - Seed Data
-- =====================================================
USE aura_jewelry;

-- =====================================================
-- Clean existing data (safe for re-run)
-- =====================================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE activity_logs;
TRUNCATE TABLE coupon_usage;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE wishlist;
TRUNCATE TABLE contacts;
TRUNCATE TABLE news;
TRUNCATE TABLE product_images;
TRUNCATE TABLE product_variants;
TRUNCATE TABLE products;
TRUNCATE TABLE coupons;
TRUNCATE TABLE categories;
TRUNCATE TABLE settings;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- Seed: Users
-- Password admin123  -> $2a$10$NpvovbVVIc1Y/mipPgtcSO0fhnBPlpuAcOfFrk4/EmxZAezviNGnK
-- Password user123  -> $2a$10$pPpNq5GJvSI/gGjei5yJX.yyHCTVYeNqGnN.MUJ6fMh3GGUar6rIK
-- =====================================================
INSERT INTO users (name, email, password, phone, address, role) VALUES
('Admin AURA', 'admin@aura.vn', '$2a$10$NpvovbVVIc1Y/mipPgtcSO0fhnBPlpuAcOfFrk4/EmxZAezviNGnK', '0909123456', '123 Lê Lợi, Quận 1, TP.HCM', 'admin'),
('Trần Minh Quân', 'quan.tran@email.com', '$2a$10$pPpNq5GJvSI/gGjei5yJX.yyHCTVYeNqGnN.MUJ6fMh3GGUar6rIK', '0901234567', '45 Đường Nguyễn Huệ, Quận 1, TP.HCM', 'user'),
('Nguyễn Thanh Vân', 'van.nguyen@email.com', '$2a$10$pPpNq5GJvSI/gGjei5yJX.yyHCTVYeNqGnN.MUJ6fMh3GGUar6rIK', '0912345678', '78 Đường Đồng Khởi, Quận 1, TP.HCM', 'user'),
('Lê Thùy Trang', 'trang.le@email.com', '$2a$10$pPpNq5GJvSI/gGjei5yJX.yyHCTVYeNqGnN.MUJ6fMh3GGUar6rIK', '0934567890', '101 Đường Pasteur, Quận 3, TP.HCM', 'user'),
('Phạm Hoàng Nam', 'nam.pham@email.com', '$2a$10$pPpNq5GJvSI/gGjei5yJX.yyHCTVYeNqGnN.MUJ6fMh3GGUar6rIK', '0945678901', '22 Đường Võ Văn Tần, Quận 3, TP.HCM', 'user');

-- =====================================================
-- Seed: Categories
-- =====================================================
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Nhẫn', 'nhan', 'Bộ sưu tập nhẫn vàng, bạc, kim cương - từ nhẫn đính hôn đến nhẫn thời trang', 1),
('Dây chuyền', 'day-chuyen', 'Dây chuyền cao cấp vàng, bạc, mạ vàng với nhiều kiểu dáng', 2),
('Bông tai', 'bong-tai', 'Bông tai đính ngọc trai, kim cương, đá quý các loại', 3),
('Vòng tay', 'vong-tay', 'Vòng tay vàng, bạc, da cao cấp phong cách', 4),
('Lắc', 'lac', 'Lắc tay, lắc chân cao cấp từ vàng và bạc', 5),
('Bộ sưu tập', 'bo-suu-tap', 'Các bộ trang sức cao cấp phối hợp hoàn hảo', 6);

-- =====================================================
-- Seed: Products
-- =====================================================
INSERT INTO products (name, slug, short_description, description, price, compare_price, stock, category_id, material, weight, dimensions, is_featured, is_active) VALUES

-- Nhẫn (category_id = 1)
('Nhẫn Kim Cương Eternal', 'nhan-kim-cuong-eternal', 'Nhẫn kim cương 6 ly thiết kế cổ điển bảng đệm bạch kim', 'Nhẫn kim cương 6 ly với thiết kế cổ điển sang trọng. Bảng đệm bạch kim 950 đục lỗ mang đến vẻ đẹp vượt thời gian. Mỗi viên kim cương được tuyển chọn kỹ lưỡng theo tiêu chuẩn 4C nghiêm ngặt, đảm bảo độ tinh xảo hoàn hảo trong từng chi tiết.', 24500000, 28000000, 15, 1, 'Bạch kim 950', '4.5g', 'Size 6–9', 1, 1),
('Nhẫn Vàng Tình Yêu', 'nhan-vang-tinh-yeu', 'Nhẫn vàng 18K đính đá sapphire xanh tuyệt đẹp', 'Nhẫn vàng 18K đính đá sapphire xanh đậm mang biểu tượng tình yêu vĩnh cửu. Viên sapphire được chọn lọc kỹ càng với màu sắc đồng đều, độ tinh khiết cao. Thiết kế tinh tế phù hợp cho những dịp đặc biệt.', 18500000, NULL, 20, 1, 'Vàng 18K', '5.2g', 'Size 5–10', 1, 1),
('Nhẫn Cưới Đôi Lứa', 'nhan-cuoi-doi-lua', 'Bộ nhẫn cưới vàng trắng 14K thiết kế tinh tế', 'Bộ nhẫn cưới vàng trắng 14K dành cho các cặp đôi. Thiết kế tinh tế, hiện đại nhưng không kém phần sang trọng. Bề mặt đánh bóng hoàn hảo mang lại ánh sáng rực rỡ.', 32000000, NULL, 10, 1, 'Vàng trắng 14K', '6.8g', 'Size 5–12', 0, 1),
('Nhẫn Bạc Minimalist', 'nhan-bac-minimalist', 'Nhẫn bạc 925 thiết kế tối giản thanh lịch', 'Nhẫn bạc 925 thiết kế tối giản (minimalist) thanh lịch và hiện đại. Phù hợp đeo hàng ngày, dễ phối hợp với mọi trang phục. Chất liệu bạc 925 bền đẹp theo thời gian.', 2900000, NULL, 50, 1, 'Bạc 925', '3.1g', 'Size 5–10', 0, 1),

-- Dây chuyền (category_id = 2)
('Dây chuyền Aurora Bloom', 'day-chuyen-aurora-bloom', 'Dây chuyền vàng 18K đính đá emerald cao cấp', 'Dây chuyền vàng 18K đính đá emerald Colombia tuyệt đẹp. Mỗi viên đá được tuyển chọn kỹ lưỡng với màu xanh đậm đà, độ tinh khiết cao. Thiết kế tinh xảo mang đến vẻ đẹp quý phái.', 12800000, 15000000, 25, 2, 'Vàng 18K', '8.5g', '45cm', 1, 1),
('Dây chuyền Ngọc Trai Akoya', 'day-chuyen-ngoc-trai-akoya', 'Dây chuyền ngọc trai Akoya Nhật Bản size 8-9mm', 'Dây chuyền ngọc trai Akoya Nhật Bản chính hãng, size 8-9mm, độ bóng cao. Khung vàng trắng 18K tôn lên vẻ đẹp ngọc ngà. Đây là lựa chọn hoàn hảo cho những dịp trọng đại.', 22000000, 25000000, 12, 2, 'Vàng trắng 18K', '12.3g', '42cm', 1, 1),
('Dây chuyền Cubic Zirconia', 'day-chuyen-cubic-zirconia', 'Dây chuyền mạ vàng đá CZ cao cấp thiết kế thanh lịch', 'Dây chuyền mạ vàng 18K với đá CZ (Cubic Zirconia) cao cấp. Đá CZ có độ trong suốt và ánh sáng tương tự kim cương thật với giá thành hợp lý. Thiết kế thanh lịch phù hợp nhiều hoàn cảnh.', 4500000, NULL, 40, 2, 'Mạ vàng 18K', '4.8g', '40cm', 0, 1),
('Dây chuyền Charm Vintage', 'day-chuyen-charm-vintage', 'Dây chuyền charm bạc 925 phong cách vintage', 'Dây chuyền charm bạc 925 với nhiều charm đa dạng theo phong cách vintage. Có thể thêm bớt charm tùy ý, cá tính hóa theo phong cách riêng. Chất liệu bạc 925 bền đẹp.', 8900000, NULL, 30, 2, 'Bạc 925', '15.2g', '50cm', 0, 1),

-- Bông tai (category_id = 3)
('Bông tai Graceful Pearl', 'bong-tai-graceful-pearl', 'Bông tai ngọc trai nước ngọt với khung vàng trắng 14K', 'Bông tai ngọc trai nước ngọt với khung vàng trắng 14K. Thiết kế thanh lịch mang đến vẻ đẹp nhẹ nhàng, kiều diễm. Phù hợp cho các buổi tiệc và sự kiện quan trọng.', 8900000, NULL, 18, 3, 'Vàng trắng 14K', '3.8g', '10mm', 1, 1),
('Bông tai Diamond Stud', 'bong-tai-diamond-stud', 'Bông tai đinh kim cương 3ly khung bạch kim', 'Bông tai đinh kim cương 3ly với khung bạch kim đơn giản mà sang trọng. Đây là món trang sức kinh điển, phù hợp mọi lứa tuổi và phong cách. Kim cương được chứng nhận GIA.', 16500000, 18500000, 15, 3, 'Bạch kim 950', '2.5g', '5mm', 1, 1),
('Bông tai Drop Sapphire', 'bong-tai-drop-sapphire', 'Bông tai giọt nước sapphire xanh đậm vàng 18K', 'Bông tai thiết kế giọt nước với đá sapphire xanh đậm. Khung vàng 18K tôn lên vẻ đẹp quý phái của đá sapphire. Thiết kế độc đáo mang đến sự thu hút riêng.', 14500000, NULL, 20, 3, 'Vàng 18K', '5.2g', '25mm', 0, 1),
('Bông tai Hoa Lotus', 'bong-tai-hoa-lotus', 'Bông tai thiết kế hoa sen cách điệu đá CZ đa sắc', 'Bông tai thiết kế hoa sen cách điệu với đá CZ đa sắc. Mỗi cánh hoa được gắn đá CZ lấp lánh tạo hiệu ứng ánh sáng đẹp mắt. Phù hợp cho những cô nàng yêu thích phong cách nữ tính.', 3200000, NULL, 45, 3, 'Bạc 925', '2.1g', '15mm', 0, 1),

-- Vòng tay (category_id = 4)
('Vòng tay Cuban Chain', 'vong-tay-cuban-chain', 'Vòng tay cuban chain vàng 18K sang trọng', 'Vòng tay cuban chain vàng 18K thiết kế mạnh mẽ, sang trọng. Các mắt xích được đánh bóng hoàn hảo mang lại ánh sáng rực rỡ. Chiều dài tiêu chuẩn phù hợp cho cả nam và nữ.', 11500000, NULL, 30, 4, 'Vàng 18K', '22g', '20cm', 1, 1),
('Vòng tay Pearl Bracelet', 'vong-tay-pearl-bracelet', 'Vòng tay ngọc trai nước ngọt kết hợp vàng 14K', 'Vòng tay ngọc trai nước ngọt kết hợp charm vàng 14K. Ngọc trai size 6-7mm với độ bóng cao được xâu chuỗi trên dây vàng mảnh. Thiết kế nhẹ nhàng, thanh lịch.', 7800000, NULL, 22, 4, 'Vàng 14K', '8.5g', '18cm', 0, 1),
('Vòng tay Charm Personal', 'vong-tay-charm-personal', 'Vòng tay charm bạc 925 có thể tháo rời tùy chỉnh', 'Vòng tay charm bạc 925 với nhiều charm đa dạng có thể tháo rời. Cá nhân hóa theo phong cách riêng, thêm charm theo dịp đặc biệt. Dây bạc mảnh mai kết hợp clasp chắc chắn.', 6200000, NULL, 35, 4, 'Bạc 925', '12.8g', '20cm', 0, 1),

-- Lắc (category_id = 5)
('Lắc tay Solitaire', 'lac-tay-solitaire', 'Lắc tay vàng 18K đính kim cương 1 carat nổi bật', 'Lắc tay vàng 18K với viên kim cương 1 carat nổi bật. Đỉnh cao của sự sang trọng và đẳng cấp. Kim cương được chọn lọc kỹ càng với giác cắt Excellent. Đây là món trang sức để đời.', 15200000, 17000000, 10, 5, 'Vàng 18K', '9.8g', '18cm', 1, 1),
('Lắc tay Tennis Classic', 'lac-tay-tennis-classic', 'Lắc tay tennis 47 kim cương vàng trắng 14K', 'Lắc tay tennis vàng trắng 14K với 47 viên kim cương tổng trọng lượng 2 carat. Mỗi viên kim cương đều được tuyển chọn đồng đều về màu sắc và độ tinh khiết. Thiết kế kinh điển mọi thời đại.', 28500000, 32000000, 8, 5, 'Vàng trắng 14K', '14.5g', '20cm', 1, 1),
('Lắc tay Buộc Tóc', 'lac-tay-buoc-toc', 'Lắc tay cuff bracelet vàng 18K thiết kế unisex', 'Lắc tay dạng buộc tóc (cuff bracelet) vàng 18K phong cách unisex. Thiết kế mạnh mẽ, cá tính phù hợp cho những ai yêu thích phong cách năng động. Có thể điều chỉnh nhẹ kích thước.', 9500000, NULL, 25, 5, 'Vàng 18K', '8.2g', '6cm', 0, 1),

-- Bộ sưu tập (category_id = 6)
('Bộ Trang Sức Tiara', 'bo-trang-suc-tiara', 'Bộ Tiara sapphire kim cương phong cách hoàng gia', 'Bộ gồm tiara, nhẫn và bông tai với đá sapphire và kim cương. Phong cách hoàng gia sang trọng, phù hợp cho cô dâu và các sự kiện trọng đại. Mỗi sản phẩm đều được chế tác tỉ mỉ bởi các nghệ nhân AURA.', 68000000, 78000000, 5, 6, 'Bạch kim 950', '35g', 'Bộ', 1, 1),
('Bộ Ánh Trăng', 'bo-anh-trang', 'Bộ vàng trắng ngọc trai Akoya phong cách sang trọng', 'Bộ trang sức vàng trắng kết hợp ngọc trai Akoya và đá CZ sang trọng. Gồm dây chuyền, bông tai và vòng tay. Thiết kế tinh tế, thanh lịch phù hợp mọi dịp từ dạ tiệc đến cuộc sống hàng ngày.', 42000000, 48000000, 8, 6, 'Vàng trắng 18K', '28g', 'Bộ', 1, 1),
('Bộ Evergreen', 'bo-evergreen', 'Bộ trang sức emerald xanh ngọc vàng 18K', 'Bộ trang sức với đá emerald xanh ngọc tự nhiên rực rỡ kết hợp vàng 18K. Gồm dây chuyền, bông tai và lắc tay. Màu sắc tự nhiên đặc trưng của emerald mang đến vẻ đẹp quý phái, khác biệt.', 55000000, NULL, 6, 6, 'Vàng 18K', '32g', 'Bộ', 1, 1),
('Bộ Classic Pearl', 'bo-classic-pearl', 'Bộ trang sức ngọc trai nước ngọt cổ điển', 'Bộ trang sức cổ điển với ngọc trai nước ngọt. Gồm dây chuyền, bông tai và vòng tay. Phong cách timeless, phù hợp mọi lứa tuổi và mọi dịp từ trang phục công sở đến dạ tiệc sang trọng.', 32000000, NULL, 12, 6, 'Vàng 18K', '25g', 'Bộ', 0, 1);

-- =====================================================
-- Seed: Product Images
-- =====================================================
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
-- Nhẫn
(1, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop', 'Nhẫn Kim Cương Eternal', 1, 1),
(1, 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop', 'Nhẫn Kim Cương Eternal nhìn gần', 2, 0),
(2, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop', 'Nhẫn Vàng Tình Yêu', 1, 1),
(3, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop', 'Nhẫn Cưới Đôi Lứa', 1, 1),
(4, 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&h=800&fit=crop', 'Nhẫn Bạc Minimalist', 1, 1),
-- Dây chuyền
(5, 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop', 'Dây chuyền Aurora Bloom', 1, 1),
(5, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop', 'Dây chuyền Aurora Bloom đính kèm', 2, 0),
(6, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop', 'Dây chuyền Ngọc Trai Akoya', 1, 1),
(7, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop', 'Dây chuyền Cubic Zirconia', 1, 1),
(8, 'https://images.unsplash.com/photo-1608250171392-3a6c2dc4c4df?w=800&h=800&fit=crop', 'Dây chuyền Charm Vintage', 1, 1),
-- Bông tai
(9, 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop', 'Bông tai Graceful Pearl', 1, 1),
(10, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop', 'Bông tai Diamond Stud', 1, 1),
(11, 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&h=800&fit=crop', 'Bông tai Drop Sapphire', 1, 1),
(12, 'https://images.unsplash.com/photo-1608250171392-3a6c2dc4c4df?w=800&h=800&fit=crop', 'Bông tai Hoa Lotus', 1, 1),
-- Vòng tay
(13, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop', 'Vòng tay Cuban Chain', 1, 1),
(14, 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop', 'Vòng tay Pearl Bracelet', 1, 1),
(15, 'https://images.unsplash.com/photo-1608250171392-3a6c2dc4c4df?w=800&h=800&fit=crop', 'Vòng tay Charm Personal', 1, 1),
-- Lắc
(16, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop', 'Lắc tay Solitaire', 1, 1),
(17, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop', 'Lắc tay Tennis Classic', 1, 1),
(18, 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop', 'Lắc tay Buộc Tóc', 1, 1),
-- Bộ sưu tập
(19, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop', 'Bộ Trang Sức Tiara', 1, 1),
(20, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop', 'Bộ Ánh Trăng', 1, 1),
(21, 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop', 'Bộ Evergreen', 1, 1),
(22, 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop', 'Bộ Classic Pearl', 1, 1);

-- =====================================================
-- Seed: Coupons
-- =====================================================
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, valid_from, valid_until, is_active) VALUES
('AURA10', 'Giảm 10% cho đơn hàng từ 500K', 'percentage', 10.00, 500000, 500000, 100, '2024-01-01 00:00:00', '2026-12-31 23:59:59', 1),
('WELCOME50', 'Giảm 50K cho khách hàng mới', 'fixed_amount', 50000, 300000, NULL, 50, '2024-01-01 00:00:00', '2026-12-31 23:59:59', 1),
('SUMMER20', 'Giảm 20% tối đa 1 triệu - Summer Sale', 'percentage', 20.00, 1000000, 1000000, 200, '2024-06-01 00:00:00', '2026-08-31 23:59:59', 1);

-- =====================================================
-- Seed: News
-- =====================================================
INSERT INTO news (title, slug, summary, content, thumbnail, author_name, category, tags, is_featured, is_published) VALUES
('Hành trình ra đời một kiệt tác kim hoàn', 'hanh-trinh-ra-doi-kiet-tac-kim-hoan',
'Khám phá các bước từ bản phác thảo tay đầu tiên đến khi sản phẩm hoàn thiện rạng rỡ.',
'<p>Mỗi món trang sức tại AURA bắt đầu từ một ý tưởng, một bản phác thảo được vẽ bằng tay bởi các nghệ nhân của chúng tôi.</p><p>Quá trình chế tác một kiệt tác kim hoàn bao gồm nhiều công đoạn tỉ mỉ:</p><ul><li><strong>Thiết kế và phác thảo</strong> – Nghệ nhân vẽ bản phác thảo chi tiết, chọn đá quý phù hợp</li><li><strong>Chọn lọc đá quý</strong> – Mỗi viên đá đều trải qua quy trình kiểm tra nghiêm ngặt</li><li><strong>Gia công kim loại</strong> – Tạo hình, đúc, đánh bóng từng chi tiết</li><li><strong>Đính đá</strong> – Kỹ thuật đính đá tinh xảo bởi thợ kim hoàn lành nghề</li><li><strong>Hoàn thiện và kiểm tra chất lượng</strong> – Đảm bảo mỗi sản phẩm đều hoàn hảo</li></ul><p>Tất cả các sản phẩm đều trải qua quy trình kiểm tra nghiêm ngặt trước khi đến tay khách hàng.</p>',
'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&h=600&fit=crop',
'AURA Jewelry', 'Kim hoàn', '["kim hoàn","chế tác","nghệ nhân"]', 1, 1),

('Bí quyết chọn trang sức theo trang phục', 'bi-quyet-chon-trang-suc-theo-trang-phuc',
'Nghệ thuật phối hợp phụ kiện để tôn lên khí chất cá nhân trong mọi hoàn cảnh.',
'<p>Việc chọn trang sức phù hợp với trang phục là một nghệ thuật. Dưới đây là những bí quyết từ các chuyên gia của AURA:</p><h3>Trang phục công sở</h3><p>Nên chọn những món trang sức thanh lịch, đơn giản như nhẫn cưới, dây chuyền mảnh hoặc bông tai nhỏ. Tránh những món quá lòe loẹt để giữ vẻ chuyên nghiệp.</p><h3>Trang phục dạo phố</h3><p>Bạn có thể thoải mái hơn với các món trang sức có thiết kế độc đáo, charm hoặc các bộ trang sức phong cách. Kết hợp cùng trang phục jeans, áo thun để tạo điểm nhấn.</p><h3>Trang phục dạ tiệc</h3><p>Đây là dịp để bạn tỏa sáng với những món trang sức đá quý, kim cương hoặc các bộ sưu tập cao cấp. Chọn những món có thiết kế nổi bật để tạo ấn tượng mạnh.</p>',
'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
'AURA Jewelry', 'Phong cách', '["phối đồ","phong cách","trang sức"]', 0, 1),

('Cách nhận biết kim cương chất lượng cao', 'cach-nhan-biet-kim-cuong-chat-luong-cao',
'Hiểu rõ về quy tắc 4C và những tiêu chuẩn khắt khe tại AURA Jewelry.',
'<p>Để đánh giá chất lượng kim cương, người ta thường dựa vào tiêu chuẩn 4C:</p><h3>1. Carat (Trọng lượng)</h3><p>Trọng lượng kim cương được đo bằng carat, 1 carat = 0.2 gram. Kim cương càng nặng càng quý hiếm và có giá trị cao hơn.</p><h3>2. Clarity (Độ tinh khiết)</h3><p>Độ tinh khiết đề cập đến các tạp chất bên trong hoặc vết xước bên ngoài. Kim cương càng trong suốt càng có giá trị. Thang đo từ FL (Không tì vết) đến I3 (Có tì vết nhiều).</p><h3>3. Color (Màu sắc)</h3><p>Kim cương không màu (colorless) được đánh giá cao nhất theo thang D-Z. Kim cương càng gần màu D càng quý.</p><h3>4. Cut (Giác cắt)</h3><p>Chất lượng giác cắt quyết định độ lấp lánh và ánh sáng của kim cương. Giác cắt Excellent cho ánh sáng tối ưu.</p><p>Tất cả kim cương tại AURA đều có chứng chỉ GIA hoặc HRD, đảm bảo nguồn gốc và chất lượng.</p>',
'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=600&fit=crop',
'AURA Jewelry', 'Kiến thức', '["kim cương","4C","đá quý"]', 1, 1),

('Xu hướng trang sức 2024', 'xu-huong-trang-suc-2024',
'Những xu hướng trang sức nổi bật nhất năm 2024 mà bạn không nên bỏ lỡ.',
'<p>Năm 2024 chứng kiến nhiều xu hướng trang sức thú vị:</p><h3>1. Trang sức bền vững</h3><p>Khách hàng ngày càng quan tâm đến nguồn gốc và quy trình sản xuất. AURA cam kết sử dụng vàng có chứng chỉ RJC (Responsible Jewellery Council).</p><h3>2. Thiết kế đa năng</h3><p>Trang sức có thể transform từ trang sức ban ngày thành trang sức dạ tiệc đang rất được ưa chuộng. Những món có thể tháo rời, kết hợp linh hoạt là xu hướng hot.</p><h3>3. Đá màu tự nhiên</h3><p>Sapphire, emerald, ruby với màu sắc đậm đà đang là lựa chọn của nhiều tín đồ trang sức. Không chỉ dừng ở kim cương trắng, đá màu mang đến cá tính riêng.</p><h3>4. Cá nhân hóa</h3><p>Dịch vụ thiết kế riêng theo yêu cầu ngày càng phổ biến. Khách hàng muốn sở hữu món trang sức độc đáo, mang dấu ấn cá nhân.</p>',
'https://images.unsplash.com/photo-1608250171392-3a6c2dc4c4df?w=800&h=600&fit=crop',
'AURA Jewelry', 'Xu hướng', '["2024","xu hướng","trang sức"]', 0, 1),

('Chăm sóc trang sức đúng cách', 'cham-soc-trang-suc-dung-cach',
'Hướng dẫn bảo quản và vệ sinh trang sức để giữ độ bền đẹp theo thời gian.',
'<p>Để trang sức luôn bền đẹp như mới, bạn cần lưu ý:</p><h3>Bảo quản đúng cách</h3><ul><li>Đựng trang sức trong hộp riêng biệt có lớp đệm mềm</li><li>Tránh để trang sức va chạm với nhau gây trầy xước</li><li>Giữ nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp</li></ul><h3>Vệ sinh định kỳ</h3><ul><li>Dùng khăn mềm lau sạch sau khi sử dụng</li><li>Rửa bằng nước ấm và xà phòng nhẹ, sau đó lau khô</li><li>Mang đến AURA để được làm sạch chuyên nghiệp miễn phí</li></ul><h3>Lưu ý khi sử dụng</h3><ul><li>Tháo trang sức khi tắm, bơi, nấu ăn hoặc tập thể dục</li><li>Tránh tiếp xúc với hóa chất như nước hoa, kem dưỡng</li><li>Không đeo trang sức khi vận động mạnh hoặc làm việc nặng</li></ul>',
'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=600&fit=crop',
'AURA Jewelry', 'Hướng dẫn', '["bảo quản","vệ sinh","hướng dẫn"]', 0, 1),

('Ngọc trai - Vẻ đẹp tự nhiên', 'ngoc-trai-ve-dep-tu-nhien',
'Tìm hiểu về nguồn gốc và cách phân biệt các loại ngọc trai chất lượng.',
'<p>Ngọc trai là một trong những loại đá quý tự nhiên được yêu thích nhất. Tại AURA, chúng tôi cung cấp nhiều loại ngọc trai:</p><h3>Các loại ngọc trai</h3><ul><li><strong>Akoya:</strong> Nhật Bản, size nhỏ (5-9mm), độ bóng cao nhất</li><li><strong>South Sea:</strong> Úc, Indonesia, size lớn (10-15mm), màu trắng hoặc vàng</li><li><strong>Tahitian:</strong> Polynesia, màu đen đặc trưng với ánh xanh lục</li><li><strong>Freshwater:</strong> Trung Quốc, giá cả phải chăng, nhiều màu sắc</li></ul><h3>Cách nhận biết ngọc trai chất lượng</h3><ul><li><strong>Độ bóng:</strong> Ngọc trai chất lượng cao có ánh bóng như gương, phản chiếu rõ ràng</li><li><strong>Kích thước:</strong> Càng lớn càng quý hiếm và có giá trị cao hơn</li><li><strong>Hình dạng:</strong> Tròn đều là quý nhất, nhưng ngọc trai baroque cũng rất đẹp</li><li><strong>Màu sắc:</strong> Tùy loại, nhưng phải đều màu, không có đốm lạ</li></ul>',
'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=600&fit=crop',
'AURA Jewelry', 'Đá quý', '["ngọc trai","akoya","south sea"]', 1, 1);

-- =====================================================
-- Seed: Contacts
-- =====================================================
INSERT INTO contacts (name, email, phone, subject, message, status) VALUES
('Hoàng Anh Tuấn', 'tuan.hoang@email.com', '0909876543', 'Hỏi về nhẫn đính hôn', 'Tôi muốn đặt làm nhẫn đính hôn theo yêu cầu riêng. Xin liên hệ tôi sớm để được tư vấn chi tiết về kim cương và thiết kế.', 'new'),
('Trần Thị Mai', 'mai.tran@email.com', '0912345679', 'Chính sách bảo hành', 'Xin hỏi chính sách bảo hành cho sản phẩm dây chuyền ngọc trai Akoya? Thời hạn bảo hành là bao lâu?', 'read'),
('Lê Văn Minh', 'minh.le@email.com', '0987654321', 'Hợp tác kinh doanh', 'Tôi muốn hỏi về chương trình đại lý của AURA. Xin gửi chi tiết về điều kiện và chính sách hợp tác.', 'replied'),
('Nguyễn Thu Hà', 'ha.nguyen@email.com', '0932198765', 'Kiểm tra đơn hàng', 'Tôi đã đặt đơn hàng ORD-AURA001 cách đây 3 ngày nhưng chưa nhận được email xác nhận. Xin kiểm tra giúp.', 'new'),
('Đặng Minh Châu', 'chau.dang@email.com', '0941234567', 'Tư vấn chọn quà', 'Tôi muốn mua bộ trang sức làm quà tặng mẹ nhân dịp sinh nhật. Bạn có thể tư vấn giúp tôi không?', 'read');

-- =====================================================
-- Seed: Settings
-- =====================================================
INSERT INTO settings (setting_key, setting_value, setting_type, group_name, description) VALUES
('site_name', 'AURA Jewelry', 'string', 'general', 'Tên website'),
('site_description', 'Trang sức cao cấp AURA - Kiệt tác từ nghệ nhân', 'string', 'general', 'Mô tả website'),
('site_logo', '/logo.svg', 'string', 'general', 'Logo website'),
('contact_email', 'contact@aura-jewelry.com', 'string', 'contact', 'Email liên hệ'),
('contact_phone', '0909 123 456', 'string', 'contact', 'Số điện thoại liên hệ'),
('contact_address', '123 Lê Lợi, Quận 1, TP.HCM', 'string', 'contact', 'Địa chỉ cửa hàng'),
('contact_hotline', '1900 1234', 'string', 'contact', 'Hotline'),
('free_shipping_threshold', '500000', 'number', 'shipping', 'Ngưỡng miễn phí vận chuyển (VNĐ)'),
('default_shipping_fee', '30000', 'number', 'shipping', 'Phí vận chuyển mặc định (VNĐ)'),
('pagination_limit', '12', 'number', 'display', 'Số sản phẩm mỗi trang'),
('pagination_news_limit', '6', 'number', 'display', 'Số tin tức mỗi trang');
