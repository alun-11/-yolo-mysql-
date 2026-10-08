CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL,
    real_name VARCHAR(50),
    address VARCHAR(200),
    create_time DATETIME,
    update_time DATETIME,
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id BIGINT,
    farmer_name VARCHAR(50),
    origin VARCHAR(100),
    weight DECIMAL(10,2),
    price DECIMAL(10,2),
    harvest_date DATE,
    grade VARCHAR(10),
    status VARCHAR(20) DEFAULT 'available',
    qr_code VARCHAR(200),
    image_url VARCHAR(200),
    create_time DATETIME,
    update_time DATETIME,
    INDEX idx_farmer_id (farmer_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS price_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    source VARCHAR(100),
    create_time DATETIME,
    UNIQUE KEY uk_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 溯源信息表
CREATE TABLE IF NOT EXISTS `traceability_info` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
  `traceability_code` VARCHAR(50) NOT NULL UNIQUE COMMENT '溯源码（YXJ-2026-001-A3F8B2）',
  `product_id` BIGINT NOT NULL COMMENT '产品/货源ID',
  `farmer_id` BIGINT NOT NULL COMMENT '农户ID',
  `product_name` VARCHAR(100) NOT NULL COMMENT '产品名称',
  `origin` VARCHAR(200) NOT NULL COMMENT '产地（省市区街道）',
  `grade` VARCHAR(20) COMMENT '等级（特级/A级/B级）',
  `weight` DECIMAL(10,2) COMMENT '净重（公斤）',
  `block_height` BIGINT COMMENT '区块链高度',
  `tx_hash` VARCHAR(100) COMMENT '交易哈希',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_traceability_code (`traceability_code`),
  INDEX idx_product_id (`product_id`),
  INDEX idx_farmer_id (`farmer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='溯源信息表';

-- 溯源环节明细表（简化版哈希链：每个环节的 node_hash = SHA256(prev_hash|node_type|node_data|node_time)）
CREATE TABLE IF NOT EXISTS `traceability_node` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
  `trace_id` BIGINT NOT NULL COMMENT '溯源信息ID（traceability_info.id）',
  `node_type` VARCHAR(30) NOT NULL COMMENT '环节类型（FARMER_HARVEST/LOCAL_COLLECTION/AI_INSPECTION/COLD_CHAIN_LOGISTICS/DESTINATION_STORAGE/INFO_CORRECTION）',
  `node_name` VARCHAR(50) NOT NULL COMMENT '环节名称（农户发布与采收/产地预冷与集散/AI质检与分级/跨省冷链运输/销地入库/信息更正记录）',
  `node_data` TEXT COMMENT '环节数据JSON（desc描述 + detail键值对；更正节点含correction留痕信息）',
  `node_time` DATETIME COMMENT '环节时间',
  `prev_hash` VARCHAR(64) COMMENT '上一节点哈希（首节点为创世哈希）',
  `node_hash` VARCHAR(64) NOT NULL COMMENT '本节点哈希',
  `block_height` BIGINT COMMENT '区块高度',
  `status` VARCHAR(20) NOT NULL DEFAULT 'active' COMMENT '节点状态（active正常 / corrected已修正留痕）',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_trace_id (`trace_id`),
  INDEX idx_node_type (`node_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='溯源环节明细表（哈希链存证，修改留痕）';