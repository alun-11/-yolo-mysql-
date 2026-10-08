package com.yixiaojiang.ginger.service;

import com.yixiaojiang.ginger.entity.Product;
import java.util.List;

public interface IProductService {
    
    Product addProduct(Product product);
    
    boolean updateProduct(Product product);
    
    boolean deleteProduct(Long id);
    
    Product getProductById(Long id);
    
    List<Product> getProductsByFarmerId(Long farmerId);
    
    List<Product> getAvailableProducts();
    
    List<Product> getAllProducts();
    
    String generateQrCode(Long productId);
}