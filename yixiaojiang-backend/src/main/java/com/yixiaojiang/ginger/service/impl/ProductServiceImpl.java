package com.yixiaojiang.ginger.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yixiaojiang.ginger.entity.Product;
import com.yixiaojiang.ginger.mapper.ProductMapper;
import com.yixiaojiang.ginger.service.IProductService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ProductServiceImpl extends ServiceImpl<ProductMapper, Product> implements IProductService {

    @Value("${upload.path:uploads}")
    private String uploadPath;

    @Override
    public Product addProduct(Product product) {
        product.setCreateTime(LocalDateTime.now());
        product.setUpdateTime(LocalDateTime.now());
        product.setStatus("available");
        
        // 生成二维码
        this.save(product);
        String qrCode = generateQrCode(product.getId());
        product.setQrCode(qrCode);
        this.updateById(product);
        
        return product;
    }

    @Override
    public boolean updateProduct(Product product) {
        product.setUpdateTime(LocalDateTime.now());
        return this.updateById(product);
    }

    @Override
    public boolean deleteProduct(Long id) {
        return this.removeById(id);
    }

    @Override
    public Product getProductById(Long id) {
        return this.getById(id);
    }

    @Override
    public List<Product> getProductsByFarmerId(Long farmerId) {
        QueryWrapper<Product> wrapper = new QueryWrapper<>();
        wrapper.eq("farmer_id", farmerId);
        wrapper.orderByDesc("create_time");
        return this.list(wrapper);
    }

    @Override
    public List<Product> getAvailableProducts() {
        QueryWrapper<Product> wrapper = new QueryWrapper<>();
        wrapper.eq("status", "available");
        wrapper.orderByDesc("create_time");
        return this.list(wrapper);
    }

    @Override
    public List<Product> getAllProducts() {
        QueryWrapper<Product> wrapper = new QueryWrapper<>();
        wrapper.orderByDesc("create_time");
        return this.list(wrapper);
    }

    @Override
    public String generateQrCode(Long productId) {
        try {
            // 创建上传目录
            Path uploadDir = Paths.get(uploadPath, "qrcodes");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // 生成二维码内容
            String content = "http://localhost:8088/api/v1/product/info/" + productId;
            
            // 二维码参数
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.MARGIN, 1);

            // 生成二维码图片
            BitMatrix bitMatrix = new MultiFormatWriter().encode(
                content,
                BarcodeFormat.QR_CODE,
                200,
                200,
                hints
            );

            BufferedImage image = MatrixToImageWriter.toBufferedImage(bitMatrix);
            
            // 保存图片
            String fileName = "qr_" + productId + "_" + UUID.randomUUID().toString().substring(0, 8) + ".png";
            Path filePath = uploadDir.resolve(fileName);
            ImageIO.write(image, "PNG", filePath.toFile());

            return "/uploads/qrcodes/" + fileName;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}