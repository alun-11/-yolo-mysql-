/**
 * 壹小姜·数智助农 - 全局模拟数据
 * 包含：农户(15) / 商户(8) / 货源(30) / 价格(30天) / 直播数据
 */

// ========== 农户数据（15 条） ==========
export const mockFarmers = [
  { id: 1, username: 'farmer1', realName: '张大山', phone: '13800138001', address: '云南曲靖罗平县九龙街道', createTime: '2026-03-15', farmingArea: 8.5, totalSales: 12500, avgRating: 4.8 },
  { id: 2, username: 'farmer2', realName: '李云海', phone: '13800138002', address: '云南文山市德厚镇', createTime: '2026-03-20', farmingArea: 12.0, totalSales: 15800, avgRating: 4.9 },
  { id: 3, username: 'farmer3', realName: '王建国', phone: '13800138003', address: '贵州安顺市镇宁县', createTime: '2026-04-10', farmingArea: 6.5, totalSales: 8900, avgRating: 4.6 },
  { id: 4, username: 'farmer4', realName: '陈志强', phone: '13800138004', address: '广西百色市田阳县', createTime: '2026-04-25', farmingArea: 10.2, totalSales: 11200, avgRating: 4.7 },
  { id: 5, username: 'farmer5', realName: '刘德胜', phone: '13800138005', address: '四川内江资中县', createTime: '2026-05-08', farmingArea: 5.8, totalSales: 7600, avgRating: 4.5 },
  { id: 6, username: 'farmer6', realName: '赵丰收', phone: '13800138006', address: '湖南永州新田县', createTime: '2026-05-22', farmingArea: 9.0, totalSales: 13400, avgRating: 4.8 },
  { id: 7, username: 'farmer7', realName: '孙惠农', phone: '13800138007', address: '江西赣州信丰县', createTime: '2026-06-05', farmingArea: 7.3, totalSales: 9800, avgRating: 4.6 },
  { id: 8, username: 'farmer8', realName: '周金姜', phone: '13800138008', address: '广东肇庆端州区', createTime: '2026-06-18', farmingArea: 11.5, totalSales: 16200, avgRating: 4.9 },
  { id: 9, username: 'farmer9', realName: '吴姜农', phone: '13800138009', address: '山东潍坊昌乐县', createTime: '2026-07-02', farmingArea: 14.0, totalSales: 18900, avgRating: 4.7 },
  { id: 10, username: 'farmer10', realName: '郑小黄', phone: '13800138010', address: '云南红河州建水县', createTime: '2026-07-15', farmingArea: 6.8, totalSales: 8500, avgRating: 4.5 },
  { id: 11, username: 'farmer11', realName: '杨根生', phone: '13800138011', address: '云南普洱市宁洱县', createTime: '2026-07-28', farmingArea: 7.8, totalSales: 9200, avgRating: 4.6 },
  { id: 12, username: 'farmer12', realName: '何润土', phone: '13800138012', address: '贵州毕节市纳雍县', createTime: '2026-08-03', farmingArea: 9.5, totalSales: 10800, avgRating: 4.7 },
  { id: 13, username: 'farmer13', realName: '罗春华', phone: '13800138013', address: '四川宜宾叙州区', createTime: '2026-08-10', farmingArea: 4.2, totalSales: 5600, avgRating: 4.4 },
  { id: 14, username: 'farmer14', realName: '高田野', phone: '13800138014', address: '云南玉溪市华宁县', createTime: '2026-08-15', farmingArea: 13.2, totalSales: 17400, avgRating: 4.8 },
  { id: 15, username: 'farmer15', realName: '唐姜源', phone: '13800138015', address: '贵州黔东南施秉县', createTime: '2026-08-18', farmingArea: 8.0, totalSales: 11500, avgRating: 4.6 }
]

// ========== 商户数据（8 条） ==========
export const mockMerchants = [
  { id: 1, username: 'merchant1', realName: '王老板', phone: '13900138001', address: '北京朝阳区新发地农产品批发市场', createTime: '2026-01-10', purchaseVolume: 18500, totalAmount: 128600 },
  { id: 2, username: 'merchant2', realName: '李经理', phone: '13900138002', address: '上海浦东新区农产品中心批发市场', createTime: '2026-02-05', purchaseVolume: 14200, totalAmount: 98700 },
  { id: 3, username: 'merchant3', realName: '张总', phone: '13900138003', address: '广州白云区增槎路农产品市场', createTime: '2026-03-18', purchaseVolume: 16800, totalAmount: 112400 },
  { id: 4, username: 'merchant4', realName: '陈采购', phone: '13900138004', address: '深圳龙岗区海吉星农产品物流园', createTime: '2026-04-22', purchaseVolume: 12300, totalAmount: 86100 },
  { id: 5, username: 'merchant5', realName: '林批发', phone: '13900138005', address: '成都农产品中心批发市场', createTime: '2026-05-30', purchaseVolume: 9800, totalAmount: 68600 },
  { id: 6, username: 'merchant6', realName: '黄掌柜', phone: '13900138006', address: '武汉白沙洲农产品大市场', createTime: '2026-06-12', purchaseVolume: 11500, totalAmount: 80500 },
  { id: 7, username: 'merchant7', realName: '吴贸易', phone: '13900138007', address: '郑州惠济区农产品物流中心', createTime: '2026-07-01', purchaseVolume: 13600, totalAmount: 95200 },
  { id: 8, username: 'merchant8', realName: '冯礼', phone: '13900138008', address: '杭州农副产品物流中心', createTime: '2026-07-20', purchaseVolume: 10200, totalAmount: 71400 }
]

// ========== 货源数据（22 条） ==========
export const mockProducts = [
  { id: 1, farmerName: '张大山', farmerId: 1, origin: '云南曲靖罗平县九龙街道', weight: 1200, price: 5.8, grade: 'A', status: 'available', harvestDate: '2026-06-15', createTime: '2026-08-01', description: '罗平小黄姜，姜块饱满，无病虫害，特级品' },
  { id: 2, farmerName: '李云海', farmerId: 2, origin: '云南文山市德厚镇', weight: 950, price: 6.2, grade: 'A', status: 'available', harvestDate: '2026-06-12', createTime: '2026-07-28', description: '文山小黄姜，原产地直供，姜辣素含量高' },
  { id: 3, farmerName: '王建国', farmerId: 3, origin: '贵州安顺市镇宁县', weight: 800, price: 5.5, grade: 'B', status: 'sold', harvestDate: '2026-06-10', createTime: '2026-07-25', description: '贵州镇宁小黄姜，中等品质，性价比高' },
  { id: 4, farmerName: '陈志强', farmerId: 4, origin: '广西百色市田阳县', weight: 1500, price: 6.0, grade: 'A', status: 'available', harvestDate: '2026-06-08', createTime: '2026-07-22', description: '百色小黄姜，个大皮薄，色泽金黄' },
  { id: 5, farmerName: '刘德胜', farmerId: 5, origin: '四川内江资中县', weight: 600, price: 5.2, grade: 'B', status: 'available', harvestDate: '2026-06-05', createTime: '2026-07-20', description: '内江小黄姜，传统种植，品质稳定' },
  { id: 6, farmerName: '赵丰收', farmerId: 6, origin: '湖南永州新田县', weight: 1100, price: 6.5, grade: 'A', status: 'sold', harvestDate: '2026-06-03', createTime: '2026-07-18', description: '永州小黄姜，富硒土壤种植，品质优异' },
  { id: 7, farmerName: '孙惠农', farmerId: 7, origin: '江西赣州信丰县', weight: 750, price: 5.8, grade: 'B', status: 'available', harvestDate: '2026-06-01', createTime: '2026-07-15', description: '信丰小黄姜，红壤种植，辣味浓郁' },
  { id: 8, farmerName: '周金姜', farmerId: 8, origin: '广东肇庆端州区', weight: 1350, price: 7.0, grade: 'A', status: 'available', harvestDate: '2026-05-28', createTime: '2026-07-12', description: '肇庆小黄姜，出口级品质，姜油丰富' },
  { id: 9, farmerName: '吴姜农', farmerId: 9, origin: '山东潍坊昌乐县', weight: 1800, price: 5.6, grade: 'B', status: 'available', harvestDate: '2026-05-25', createTime: '2026-07-10', description: '昌乐大姜，产量大，适合加工' },
  { id: 10, farmerName: '郑小黄', farmerId: 10, origin: '云南红河州建水县', weight: 850, price: 6.3, grade: 'A', status: 'available', harvestDate: '2026-05-22', createTime: '2026-07-08', description: '建水小黄姜，高山种植，香气独特' },
  { id: 11, farmerName: '张大山', farmerId: 1, origin: '云南曲靖罗平县九龙街道', weight: 980, price: 5.5, grade: 'B', status: 'sold', harvestDate: '2026-05-18', createTime: '2026-07-05', description: '罗平小黄姜，二批采收，品质良好' },
  { id: 12, farmerName: '李云海', farmerId: 2, origin: '云南文山市德厚镇', weight: 1100, price: 6.8, grade: 'A', status: 'available', harvestDate: '2026-05-15', createTime: '2026-07-02', description: '文山小黄姜，特级品，出口日本标准' },
  { id: 13, farmerName: '王建国', farmerId: 3, origin: '贵州安顺市镇宁县', weight: 720, price: 5.0, grade: 'C', status: 'available', harvestDate: '2026-05-12', createTime: '2026-06-28', description: '镇宁小黄姜，普通品级，适合本地销售' },
  { id: 14, farmerName: '陈志强', farmerId: 4, origin: '广西百色市田阳县', weight: 1250, price: 5.9, grade: 'A', status: 'sold', harvestDate: '2026-05-10', createTime: '2026-06-25', description: '百色小黄姜，优质品，已售往广州' },
  { id: 15, farmerName: '赵丰收', farmerId: 6, origin: '湖南永州新田县', weight: 1050, price: 6.6, grade: 'A', status: 'available', harvestDate: '2026-05-08', createTime: '2026-06-22', description: '永州富硒小黄姜，精品装，礼盒包装' },
  { id: 16, farmerName: '杨根生', farmerId: 11, origin: '云南普洱市宁洱县', weight: 2300, price: 4.8, grade: 'C', status: 'available', harvestDate: '2026-05-05', createTime: '2026-06-18', description: '普洱小黄姜，大面积采收，适合深加工原料' },
  { id: 17, farmerName: '何润土', farmerId: 12, origin: '贵州毕节市纳雍县', weight: 580, price: 6.4, grade: 'A', status: 'available', harvestDate: '2026-05-02', createTime: '2026-06-15', description: '纳雍小黄姜，高海拔种植，姜辣素含量高' },
  { id: 18, farmerName: '罗春华', farmerId: 13, origin: '四川宜宾叙州区', weight: 150, price: 7.5, grade: 'A', status: 'available', harvestDate: '2026-04-28', createTime: '2026-06-12', description: '宜宾精品小黄姜，有机认证，限量供应' },
  { id: 19, farmerName: '高田野', farmerId: 14, origin: '云南玉溪市华宁县', weight: 3200, price: 5.2, grade: 'B', status: 'available', harvestDate: '2026-04-25', createTime: '2026-06-10', description: '华宁大姜，产量大，色泽金黄，批发直供' },
  { id: 20, farmerName: '唐姜源', farmerId: 15, origin: '贵州黔东南施秉县', weight: 880, price: 6.1, grade: 'A', status: 'sold', harvestDate: '2026-04-22', createTime: '2026-06-08', description: '施秉小黄姜，原生态种植，绿色认证' },
  { id: 21, farmerName: '周金姜', farmerId: 8, origin: '广东肇庆端州区', weight: 4500, price: 4.5, grade: 'C', status: 'available', harvestDate: '2026-04-18', createTime: '2026-06-05', description: '肇庆大姜批量货，适合姜粉加工厂大批采购' },
  { id: 22, farmerName: '杨根生', farmerId: 11, origin: '云南普洱市宁洱县', weight: 420, price: 7.2, grade: 'A', status: 'available', harvestDate: '2026-04-15', createTime: '2026-06-02', description: '普洱高山小黄姜，手工精选，礼盒装' },
  { id: 23, farmerName: '何润土', farmerId: 12, origin: '贵州毕节市纳雍县', weight: 1650, price: 5.7, grade: 'B', status: 'sold', harvestDate: '2026-04-12', createTime: '2026-05-30', description: '纳雍小黄姜二批，品质稳定，已发往武汉' },
  { id: 24, farmerName: '高田野', farmerId: 14, origin: '云南玉溪市华宁县', weight: 200, price: 8.0, grade: 'A', status: 'available', harvestDate: '2026-04-08', createTime: '2026-05-28', description: '华宁特级精选姜，单块200g以上，品相极佳' },
  { id: 25, farmerName: '唐姜源', farmerId: 15, origin: '贵州黔东南施秉县', weight: 950, price: 5.9, grade: 'B', status: 'available', harvestDate: '2026-04-05', createTime: '2026-05-25', description: '施秉小黄姜，二批采收，适合本地零售' },
  { id: 26, farmerName: '张大山', farmerId: 1, origin: '云南曲靖罗平县九龙街道', weight: 1600, price: 5.6, grade: 'B', status: 'available', harvestDate: '2026-04-02', createTime: '2026-05-22', description: '罗平小黄姜三批，大批量现货，批发价优' },
  { id: 27, farmerName: '李云海', farmerId: 2, origin: '云南文山市德厚镇', weight: 680, price: 6.5, grade: 'A', status: 'sold', harvestDate: '2026-03-30', createTime: '2026-05-20', description: '文山小黄姜精选，已售往上海市场' },
  { id: 28, farmerName: '陈志强', farmerId: 4, origin: '广西百色市田阳县', weight: 2100, price: 5.3, grade: 'C', status: 'available', harvestDate: '2026-03-28', createTime: '2026-05-18', description: '百色大姜批量货，适合酱菜加工厂采购' },
  { id: 29, farmerName: '赵丰收', farmerId: 6, origin: '湖南永州新田县', weight: 830, price: 6.7, grade: 'A', status: 'available', harvestDate: '2026-03-25', createTime: '2026-05-15', description: '永州富硒小黄姜，精品礼盒装，适合高端市场' },
  { id: 30, farmerName: '高田野', farmerId: 14, origin: '云南玉溪市华宁县', weight: 2800, price: 4.9, grade: 'C', status: 'sold', harvestDate: '2026-03-22', createTime: '2026-05-12', description: '华宁大姜产地直发，已整批发往郑州物流中心' }
]

// ========== 价格数据生成器（30 天历史 + 7 天预测） ==========
/**
 * 生成 30 天历史价格数据
 * @returns {Array} 价格数组，每项包含 date / purchase / wholesale / retail
 */
export const generatePriceHistory = (days = 30) => {
  const data = []
  const today = new Date()
  let purchase = 5.2
  let wholesale = 7.0
  let retail = 9.5

  // 使用固定种子保证数据连贯性
  const seed = 42
  let rng = seed
  const random = () => {
    rng = (rng * 9301 + 49297) % 233280
    return rng / 233280
  }

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = formatDate(date)

    // 模拟价格波动趋势（整体小幅上涨）
    const trend = (days - i) / days * 0.8
    purchase = clamp(5.0 + trend + (random() - 0.5) * 0.5, 4.5, 6.8)
    wholesale = clamp(6.8 + trend + (random() - 0.5) * 0.6, 6.2, 8.5)
    retail = clamp(9.2 + trend * 1.2 + (random() - 0.5) * 0.7, 8.8, 12.0)

    data.push({
      date: dateStr,
      purchase: parseFloat(purchase.toFixed(2)),
      wholesale: parseFloat(wholesale.toFixed(2)),
      retail: parseFloat(retail.toFixed(2))
    })
  }
  return data
}

/**
 * 生成未来 7 天价格预测数据
 */
export const generatePriceForecast = (lastPurchase = 5.8) => {
  const data = []
  const today = new Date()
  // 模拟先涨后小幅回调的曲线
  const trendPattern = [0.25, 0.45, 0.65, 0.85, 0.80, 0.55, 0.35]
  let purchase = lastPurchase

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const dateStr = formatDate(date)
    purchase = lastPurchase + trendPattern[i - 1]
    data.push({
      date: dateStr,
      purchase: parseFloat(purchase.toFixed(2))
    })
  }
  return data
}

// ========== 直播电商数据 ==========
export const mockLiveData = {
  totalSessions: 156,
  totalSales: 28560,
  totalAmount: 189600,
  totalOrders: 3245,
  avgViewers: 1280,
  conversionRate: '8.5%',
  recentSessions: [
    { id: 1, title: '罗平小黄姜产地直发', date: '2026-08-15', viewers: 1560, sales: 850, amount: 5950, orders: 96 },
    { id: 2, title: '文山小黄姜专场', date: '2026-08-14', viewers: 1320, sales: 720, amount: 5040, orders: 85 },
    { id: 3, title: '贵州镇宁小黄姜', date: '2026-08-13', viewers: 1180, sales: 680, amount: 4760, orders: 72 },
    { id: 4, title: '百色小黄姜特惠', date: '2026-08-12', viewers: 1450, sales: 920, amount: 6440, orders: 108 },
    { id: 5, title: '永州富硒小黄姜', date: '2026-08-11', viewers: 980, sales: 560, amount: 3920, orders: 62 }
  ],
  // 近 7 天销量数据（用于折线图）
  weeklySales: [
    { date: '2026-08-11', sales: 560, amount: 3920 },
    { date: '2026-08-12', sales: 920, amount: 6440 },
    { date: '2026-08-13', sales: 680, amount: 4760 },
    { date: '2026-08-14', sales: 720, amount: 5040 },
    { date: '2026-08-15', sales: 850, amount: 5950 },
    { date: '2026-08-16', sales: 1050, amount: 7350 },
    { date: '2026-08-17', sales: 1180, amount: 8260 }
  ],
  // 货源销售排行榜
  ranking: [
    { origin: '云南罗平', sales: 8920, amount: 53520 },
    { origin: '贵州安顺', sales: 7650, amount: 45900 },
    { origin: '四川内江', sales: 6380, amount: 38280 },
    { origin: '山东潍坊', sales: 5240, amount: 31440 },
    { origin: '广西百色', sales: 4180, amount: 25080 }
  ]
}

// ========== 大屏 KPI 数据 ==========
export const mockDashboardKpi = {
  farmerCount: 1256,
  aiDetectWeight: 8950,
  traceScanCount: 3428,
  avgIncomeIncrease: 23.5
}

// ========== 产地分布数据 ==========
export const mockRegionData = [
  { name: '云南罗平', value: 8920 },
  { name: '贵州安顺', value: 7650 },
  { name: '四川内江', value: 6380 },
  { name: '山东潍坊', value: 5240 },
  { name: '广西百色', value: 4180 },
  { name: '湖南永州', value: 3520 },
  { name: '广东肇庆', value: 2890 },
  { name: '江西赣州', value: 2360 }
]

export const mockProvinceData = [
  { name: '云南', value: 8920, cities: '罗平、文山、建水' },
  { name: '贵州', value: 7650, cities: '安顺、镇宁' },
  { name: '四川', value: 6380, cities: '内江、资中' },
  { name: '山东', value: 5240, cities: '潍坊、昌乐' },
  { name: '广西', value: 4180, cities: '百色、田阳' },
  { name: '湖南', value: 3520, cities: '永州、新田' },
  { name: '广东', value: 2890, cities: '肇庆、端州' },
  { name: '江西', value: 2360, cities: '赣州、信丰' }
]

// ========== 工具函数 ==========
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// ========== 预生成数据（供直接导入使用） ==========
export const mockPriceHistory = generatePriceHistory(30)
export const mockPriceForecast = generatePriceForecast(5.85)

export default {
  mockFarmers,
  mockMerchants,
  mockProducts,
  mockPriceHistory,
  mockPriceForecast,
  mockLiveData,
  mockDashboardKpi,
  mockRegionData,
  mockProvinceData,
  generatePriceHistory,
  generatePriceForecast
}
