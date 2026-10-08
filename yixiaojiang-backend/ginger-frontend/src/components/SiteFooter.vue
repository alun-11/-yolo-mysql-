<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-section">
        <h4>🏆 资质与认证</h4>
        <ul>
          <li>✅ 地理标志授权证书编号：云地标授字[2025]001号</li>
          <li>✅ 第三方检测资质：CMA认证</li>
          <li>✅ 云南省农产品质量安全追溯</li>
          <li>✅ 绿色食品A级认证</li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>🔗 友情链接</h4>
        <ul>
          <li><a href="#">云南省农业农村厅</a></li>
          <li><a href="#">全国农产品质量安全网</a></li>
          <li><a href="#">中国农业信息网</a></li>
          <li><a href="#">罗平县人民政府</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>📞 联系我们</h4>
        <ul>
          <li>📍 云南省曲靖市罗平县</li>
          <li>📞 13312452161</li>
          <li>📧 service@yixiaojiang.cn</li>
          <li>🕐 工作日 9:00-18:00</li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>⚠️ 声明与条款</h4>
        <ul>
          <li><a href="#">平台隐私协议</a></li>
          <li><a href="#">服务条款</a></li>
          <li><a href="#">数据使用说明</a></li>
          <li><a href="#">联系客服</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="copyright">
        <p>© 2026 壹小姜团队 版权所有</p>
        <p>Powered by Spring Boot + Vue.js + YOLOv11 · 数智助农平台</p>
      </div>
      <div class="icp-info">
        <p>滇ICP备2024000000号-1</p>
        <p>公安备案号：滇公网安备 00000000000000号</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 资质公示页脚组件
</script>

<style scoped>
.site-footer {
  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
  color: #ccc;
  padding: 40px 0 20px;
  width: 100%;
  border-top: 3px solid var(--yxj-gold, #DAA520);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.footer-section h4 {
  margin: 0 0 16px 0;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  padding-left: 8px;
  border-left: 3px solid var(--yxj-gold, #DAA520);
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 10px;
  font-size: 13px;
  color: #b0b0b0;
  line-height: 1.6;
}

.footer-section a {
  color: #b0b0b0;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #DAA520;
}

.footer-bottom {
  max-width: 1200px;
  margin: 30px auto 0;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright p,
.icp-info p {
  margin: 4px 0;
  font-size: 13px;
  color: #888;
}

@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
}
</style>
