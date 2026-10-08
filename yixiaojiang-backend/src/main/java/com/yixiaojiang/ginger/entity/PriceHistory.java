package com.yixiaojiang.ginger.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import java.math.BigDecimal;
import java.time.LocalDate;


//指定该类对应的是哪个数据表名
@TableName("price_history")
public class PriceHistory {
    private Long id;
    private LocalDate date;
    private BigDecimal price;
    private String source;

    public PriceHistory() {
    }

    public PriceHistory(Long id, LocalDate date, BigDecimal price, String source) {
        this.id = id;
        this.date = date;
        this.price = price;
        this.source = source;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    @Override
    public String toString() {
        return "PriceHistory{" +
                "id=" + id +
                ", date=" + date +
                ", price=" + price +
                ", source='" + source + '\'' +
                '}';
    }
}