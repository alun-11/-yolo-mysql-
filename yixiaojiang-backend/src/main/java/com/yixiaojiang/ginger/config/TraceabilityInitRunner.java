package com.yixiaojiang.ginger.config;

import com.yixiaojiang.ginger.service.ITraceabilityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.ResultSet;

/**
 * 溯源系统启动初始化：
 * 1. 幂等补列：traceability_node.status（旧库 CREATE TABLE IF NOT EXISTS 不会自动加列）；
 * 2. 幂等生成演示溯源数据 YXJ-26-001-A3F8B2（5 节点多地区流转）。
 */
@Component
@Order(20)
public class TraceabilityInitRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(TraceabilityInitRunner.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ITraceabilityService traceabilityService;

    @Override
    public void run(String... args) {
        try {
            ensureStatusColumn();
        } catch (Exception e) {
            log.warn("traceability_node.status 列检查失败: {}", e.getMessage());
        }
        try {
            traceabilityService.initDemoTraceIfAbsent();
            log.info("溯源演示数据就绪：YXJ-26-001-A3F8B2");
        } catch (Exception e) {
            log.warn("溯源演示数据初始化失败: {}", e.getMessage());
        }
    }

    /** 通过 JDBC 元数据判断列是否存在，不存在则 ALTER 补列（兼容 MySQL 各版本） */
    private void ensureStatusColumn() throws Exception {
        Boolean exists = jdbcTemplate.execute((Connection con) -> {
            try (ResultSet rs = con.getMetaData().getColumns(con.getCatalog(), null, "traceability_node", "status")) {
                return rs.next();
            }
        });
        if (Boolean.FALSE.equals(exists)) {
            jdbcTemplate.execute("ALTER TABLE `traceability_node` ADD COLUMN `status` VARCHAR(20) NOT NULL DEFAULT 'active' "
                    + "COMMENT '节点状态（active正常 / corrected已修正留痕）' AFTER `block_height`");
            log.info("已为 traceability_node 补充 status 列");
        }
    }
}
