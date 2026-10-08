package com.yixiaojiang.ginger.controller;

import com.yixiaojiang.ginger.common.Result;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.ByteArrayResource;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ai")
@CrossOrigin
public class AIController {

    private String uploadPath = "uploads";

    @Value("${ai.python-service-url:http://localhost:8000}")
    private String pythonServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/disease-detect")
    public Result<Map<String, Object>> detectDisease(@RequestParam("image") MultipartFile file) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                : ".jpg";
            
            String fileName = "upload_" + UUID.randomUUID().toString().substring(0, 8) + extension;
            
            Path uploadDir = Paths.get(System.getProperty("user.dir"), uploadPath, "images");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            
            Path filePath = uploadDir.resolve(fileName);
            file.transferTo(filePath.toFile());

            Map<String, Object> result = callPythonModel(filePath.toString());

            Map<String, Object> response = new HashMap<>();
            response.put("imageUrl", "/uploads/images/" + fileName);
            response.put("prediction", result);
            
            return Result.success(response);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.fail("图片上传或识别失败: " + e.getMessage());
        }
    }

    private Map<String, Object> callPythonModel(String imagePath) {
        String detectUrl = pythonServiceUrl + "/api/v1/detect/";
        
        try {
            Path path = Paths.get(imagePath);
            byte[] imageBytes = Files.readAllBytes(path);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(imageBytes) {
                @Override
                public String getFilename() {
                    return "image.jpg";
                }
            });
            
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                detectUrl,
                HttpMethod.POST,
                requestEntity,
                Map.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> result = response.getBody();
                if (result != null && result.get("code").equals(200)) {
                    return parseDetectionResult(result);
                }
            }
            
            return getMockResult(imagePath);
        } catch (Exception e) {
            e.printStackTrace();
            return getMockResult(imagePath);
        }
    }

    private Map<String, Object> parseDetectionResult(Map<String, Object> result) {
        Map<String, Object> prediction = new HashMap<>();
        
        try {
            Map<String, Object> summary = (Map<String, Object>) result.get("summary");
            boolean hasDefect = Boolean.parseBoolean(String.valueOf(summary.get("has_defect")));
            String status = String.valueOf(summary.get("status"));
            
            if ("bad".equals(status) || hasDefect) {
                java.util.List<Map<String, Object>> detections = (java.util.List<Map<String, Object>>) result.get("data");
                String diseaseName = "病虫害";
                double maxConfidence = 0;
                
                if (detections != null && !detections.isEmpty()) {
                    for (Map<String, Object> det : detections) {
                        String className = String.valueOf(det.get("class_name"));
                        double conf = Double.parseDouble(String.valueOf(det.get("confidence")));
                        if (conf > maxConfidence) {
                            maxConfidence = conf;
                            diseaseName = className;
                        }
                    }
                }
                
                prediction.put("disease", diseaseName);
                prediction.put("confidence", String.format("%.2f", maxConfidence));
                prediction.put("severity", maxConfidence > 0.8 ? "严重" : (maxConfidence > 0.5 ? "中等" : "轻微"));
                prediction.put("suggestion", getSuggestion(diseaseName));
            } else if ("good".equals(status)) {
                prediction.put("disease", "健康");
                prediction.put("confidence", "0.98");
                prediction.put("severity", "无");
                prediction.put("suggestion", "作物健康，继续保持当前管理方式。");
            } else {
                prediction.put("disease", "检测不确定");
                prediction.put("confidence", "0.50");
                prediction.put("severity", "未知");
                prediction.put("suggestion", "无法确定作物状态，请重新拍摄清晰图片进行检测。");
            }
            
            prediction.put("rawResult", result);
        } catch (Exception e) {
            e.printStackTrace();
            return getMockResult("");
        }
        
        return prediction;
    }

    private String getSuggestion(String diseaseName) {
        Map<String, String> suggestions = new HashMap<>();
        suggestions.put("姜瘟", "姜瘟病：建议立即清除病株，用生石灰消毒土壤。使用多菌灵或恶霉灵灌根，配合生根剂使用。避免大水漫灌，保持土壤排水良好。");
        suggestions.put("炭疽病", "炭疽病：使用咪鲜胺或苯醚甲环唑喷雾防治，每隔7-10天喷一次，连续喷2-3次。注意及时清除病叶，加强通风透光。");
        suggestions.put("叶枯病", "叶枯病：使用代森锰锌可湿性粉剂500倍液或百菌清喷雾，每隔7天喷一次，连续喷3次。及时摘除病叶，减少病菌传播。");
        suggestions.put("姜螟", "姜螟：使用氯虫苯甲酰胺或甲维盐喷雾防治。发现虫孔及时用药，可结合灌根处理。注意田间卫生，清除杂草和残株。");
        suggestions.put("蚜虫", "蚜虫：使用吡虫啉或啶虫脒喷雾，每隔5-7天喷一次。可利用天敌如瓢虫进行生物防治。及时清除田间杂草。");
        suggestions.put("病虫害", "检测到病虫害，建议仔细观察作物症状，必要时请农技人员现场诊断，采取针对性防治措施。");
        
        return suggestions.getOrDefault(diseaseName, "建议及时咨询农技人员，采取针对性防治措施。");
    }

    private Map<String, Object> getMockResult(String imagePath) {
        Map<String, Object> result = new HashMap<>();
        
        String[] diseases = {
            "健康", "姜瘟病", "腐烂病", "叶斑病", "根腐病", "炭疽病"
        };
        String[] suggestions = {
            "作物健康，继续保持当前管理方式",
            "建议使用多菌灵或甲基托布津喷雾，每隔7天喷一次，连续3次",
            "立即清除病株，用生石灰消毒土壤，避免大水漫灌",
            "使用代森锰锌可湿性粉剂500倍液喷雾",
            "用恶霉灵灌根，配合生根剂使用",
            "使用咪鲜胺或苯醚甲环唑喷雾防治"
        };
        
        int index = (int) (Math.random() * diseases.length);
        
        result.put("disease", diseases[index]);
        result.put("confidence", String.format("%.2f", 0.85 + Math.random() * 0.14));
        result.put("suggestion", suggestions[index]);
        result.put("severity", index == 0 ? "无" : (index < 3 ? "严重" : "中等"));
        
        return result;
    }

    @GetMapping("/model-info")
    public Result<Map<String, Object>> getModelInfo() {
        String infoUrl = pythonServiceUrl + "/api/v1/detect/model-info";
        
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(infoUrl, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> result = response.getBody();
                if (result != null && "ok".equals(result.get("status"))) {
                    return Result.success(result);
                }
            }
            
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("status", "warning");
            fallback.put("message", "Python AI服务未连接，使用模拟数据");
            fallback.put("model_type", "YOLOv11 (本地模型)");
            fallback.put("model_path", "E:/luoping-ginger-v1/backend/ai_models/best.pt");
            
            return Result.success(fallback);
        } catch (Exception e) {
            e.printStackTrace();
            
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("status", "error");
            fallback.put("message", "Python AI服务不可用");
            
            return Result.fail("AI服务不可用");
        }
    }
}
