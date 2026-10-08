package com.yixiaojiang.ginger.controller;

import com.yixiaojiang.ginger.common.Result;
import com.yixiaojiang.ginger.entity.Product;
import com.yixiaojiang.ginger.service.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/product")
@CrossOrigin
public class ProductController {

    @Autowired
    private IProductService productService;

    @Value("${upload.path:uploads}")
    private String uploadPath;

    @PostMapping
    public Result<Product> addProduct(@RequestBody Product product) {
        Product newProduct = productService.addProduct(product);
        return Result.success(newProduct);
    }

    @PutMapping
    public Result<String> updateProduct(@RequestBody Product product) {
        boolean success = productService.updateProduct(product);
        if (success) {
            return Result.success("更新成功");
        }
        return Result.fail("更新失败");
    }

    @DeleteMapping("/{id}")
    public Result<String> deleteProduct(@PathVariable Long id) {
        boolean success = productService.deleteProduct(id);
        if (success) {
            return Result.success("删除成功");
        }
        return Result.fail("删除失败");
    }

    @GetMapping("/{id}")
    public Result<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            return Result.success(product);
        }
        return Result.fail("产品不存在");
    }

    @GetMapping("/farmer/{farmerId}")
    public Result<List<Product>> getProductsByFarmerId(@PathVariable Long farmerId) {
        List<Product> products = productService.getProductsByFarmerId(farmerId);
        return Result.success(products);
    }

    @GetMapping("/available")
    public Result<List<Product>> getAvailableProducts() {
        List<Product> products = productService.getAvailableProducts();
        return Result.success(products);
    }

    @GetMapping("/list")
    public Result<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return Result.success(products);
    }

    @GetMapping("/qrcode/{id}")
    public Result<String> generateQrCode(@PathVariable Long id) {
        String qrCode = productService.generateQrCode(id);
        if (qrCode != null) {
            return Result.success(qrCode);
        }
        return Result.fail("生成二维码失败");
    }

    @PostMapping("/upload")
    public Map<String, Object> uploadImage(@RequestParam("image") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                : ".jpg";
            
            String fileName = "product_" + UUID.randomUUID().toString().substring(0, 8) + extension;
            
            Path uploadDir = Paths.get(uploadPath, "images");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            
            Path filePath = uploadDir.resolve(fileName);
            file.transferTo(filePath.toFile());

            response.put("code", 200);
            response.put("imageUrl", "/uploads/images/" + fileName);
            response.put("message", "上传成功");
        } catch (Exception e) {
            e.printStackTrace();
            response.put("code", 500);
            response.put("message", "图片上传失败: " + e.getMessage());
        }
        return response;
    }
}
