-- 插入初始用户数据
INSERT INTO sys_user (username, password, phone, role, real_name, address, create_time) VALUES
('farmer', '123456', '13800138001', 'farmer', '测试用户', '云南省罗平县', NOW())
ON DUPLICATE KEY UPDATE password = VALUES(password);

INSERT INTO sys_user (username, password, phone, role, real_name, address, create_time) VALUES
('merchant', '123456', '13800138002', 'merchant', '李四商户', '云南省昆明市', NOW())
ON DUPLICATE KEY UPDATE password = VALUES(password);

INSERT INTO sys_user (username, password, phone, role, real_name, address, create_time) VALUES
('admin', '123456', '13800138003', 'admin', '王管理员', '云南省曲靖市', NOW())
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- 插入价格历史数据（近7天）
INSERT INTO price_history (date, price, source) VALUES
(DATE_SUB(CURDATE(), INTERVAL 6 DAY), 5.20, '市场调研'),
(DATE_SUB(CURDATE(), INTERVAL 5 DAY), 5.35, '市场调研'),
(DATE_SUB(CURDATE(), INTERVAL 4 DAY), 5.28, '市场调研'),
(DATE_SUB(CURDATE(), INTERVAL 3 DAY), 5.42, '市场调研'),
(DATE_SUB(CURDATE(), INTERVAL 2 DAY), 5.50, '市场调研'),
(DATE_SUB(CURDATE(), INTERVAL 1 DAY), 5.45, '市场调研'),
(CURDATE(), 5.55, '市场调研')
ON DUPLICATE KEY UPDATE price = VALUES(price);