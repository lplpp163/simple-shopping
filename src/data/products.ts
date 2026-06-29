import { Product, Category, Review } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: '全部商品', icon: 'Store' },
  { id: 'electronics', name: '3C 數位', icon: 'Laptop' },
  { id: 'apparel', name: '潮流服飾', icon: 'Shirt' },
  { id: 'home', name: '居家美學', icon: 'Home' },
  { id: 'sports', name: '戶外運動', icon: 'Compass' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: '極簡主動降噪無線頭戴式耳機',
    description: '配備頂級主動降噪（ANC）晶片，完美隔絕外界噪音。40 小時超長續航力，親膚記憶海綿耳罩提供全天候極致舒適感。高解析 Hi-Res 音質，讓每個音符都絲絲入扣。',
    price: 5490,
    originalPrice: 6200,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 124,
    stock: 15,
    specs: {
      '顏色': '極致黑, 霧面銀, 燕麥奶',
      '藍牙版本': 'Bluetooth 5.3',
      '保固': '12個月台灣原廠保固'
    },
    tags: ['熱銷', '免運', '降噪']
  },
  {
    id: 'prod-2',
    name: '34吋 WQHD 曲面超寬電競顯示器',
    description: '1500R 黃金曲率，21:9 超寬螢幕，WQHD 解析度帶來沉浸式的視覺享受。144Hz 高更新率與 1ms 極速回應時間，讓遊戲畫面滑順流暢，無殘影。護眼濾藍光技術，長時間工作遊戲也不疲勞。',
    price: 12900,
    originalPrice: 14500,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 56,
    stock: 8,
    specs: {
      '面板類型': 'VA 曲面 1500R',
      '更新率': '144Hz',
      '解析度': '3440 x 1440'
    },
    tags: ['限時特惠', '高畫質', '熱門']
  },
  {
    id: 'prod-3',
    name: '極光極簡客製化機械鍵盤',
    description: '採極簡 80% TKL 配置，提供全鍵熱插拔設計，可自由更換軸體。搭載 PBT 雙色注塑鍵帽，觸感細膩不打油。配備多模式 RGB 背光，支援 Type-C、2.4G 及藍牙三模連接。',
    price: 2890,
    originalPrice: 3200,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 88,
    stock: 20,
    specs: {
      '鍵盤軸體': '紅軸 (線性靜音), 茶軸 (微段落感)',
      '連接模式': '藍牙 / 2.4G / 有線 Type-C',
      '背光': '1680萬色可自訂RGB'
    },
    tags: ['熱插拔', '三模連接']
  },
  {
    id: 'prod-4',
    name: '極地防風防水機能風衣外套',
    description: '引進最新三層科技防水透氣膜，防水係數高達 15000mm。立體剪裁完美修飾身形，腋下配有透氣拉鍊，無論日常通勤還是戶外登山，皆能輕鬆應對各種惡劣天氣。',
    price: 3280,
    originalPrice: 3980,
    category: 'apparel',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewCount: 92,
    stock: 25,
    specs: {
      '尺寸': 'S, M, L, XL',
      '顏色': '軍綠色, 太空灰, 曜石黑',
      '防水係數': '15,000 mm / H2O'
    },
    tags: ['機能款', '透氣防水', '限時降價']
  },
  {
    id: 'prod-5',
    name: '極簡真皮大容量斜背馬鞍包',
    description: '精選頂級頭層牛皮手工打造，保留天然皮革細膩質感。經典馬鞍弧形外觀，大容量雙層收納，輕鬆裝入皮夾、手機、日常化妝品。配備可調節式寬肩帶，兼具舒適度與百搭風格。',
    price: 4500,
    originalPrice: 4990,
    category: 'apparel',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80', // Replace with beautiful bag photo
    rating: 4.8,
    reviewCount: 42,
    stock: 12,
    specs: {
      '材質': '頭層義大利進口牛皮',
      '顏色': '經典駝, 焦糖棕, 曜石黑',
      '尺寸': '22cm x 18cm x 7cm'
    },
    tags: ['手工真皮', '優雅氣質']
  },
  {
    id: 'prod-6',
    name: '智能控溫極細口手沖咖啡電熱水壺',
    description: '專利 0.6cm 極細壺嘴設計，水流穩定極易掌控。電子底座支援 40°C - 100°C 精準控溫，一鍵定溫保溫長達 1 小時。內膽全 304 食品級不鏽鋼，為您的每一杯精品咖啡注入完美溫度。',
    price: 3600,
    originalPrice: 4200,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 153,
    stock: 18,
    specs: {
      '容量': '800 ml',
      '額定功率': '1000W',
      '溫度控制': '40度C 至 100度C 逐度可調'
    },
    tags: ['咖啡必備', '高質感', '精準控溫']
  },
  {
    id: 'prod-7',
    name: '香氛陶瓷超音波負離子加濕器',
    description: '高質感手工燒製霧面陶瓷外罩，搭配溫暖柔和的 LED 夜燈。每秒 240 萬次高頻超音波震盪，將精油與水細膩霧化，極靜音運行，讓清新的香氣無形漫步在客廳、臥室或辦公空間。',
    price: 1480,
    originalPrice: 1800,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewCount: 74,
    stock: 30,
    specs: {
      '材質': '霧面陶瓷, PP環保塑料',
      '噴霧時間': '連續噴霧 4小時 / 間歇噴霧 8小時',
      '水箱容量': '150 ml'
    },
    tags: ['精油香氛', '手工陶瓷', '小夜燈']
  },
  {
    id: 'prod-8',
    name: '大容量雙層真空不鏽鋼運動水壺',
    description: '採用 18/8 (304) 醫療級不鏽鋼，雙層真空結構提供 24 小時極致保冷、12 小時保溫。防漏雙扣瓶蓋，單手即可輕鬆彈開飲水。附贈矽膠提帶與底部止滑矽膠套，戶外健行、健身房運動最佳拍檔。',
    price: 980,
    originalPrice: 1200,
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 112,
    stock: 45,
    specs: {
      '容量': '750 ml',
      '材質': '18/8 食品級不鏽鋼 (BPA Free)',
      '保溫效果': '保冷 24小時 / 保溫 12小時'
    },
    tags: ['雙層真空', '戶外必備', '無毒材質']
  },
  {
    id: 'prod-9',
    name: '超輕量航太鋁合金露營折疊蛋捲桌',
    description: '採用高強度 7075 航太級鋁合金骨架，耐重達 30 公斤。極簡折疊結構設計，30 秒快速展開或收納。附有專屬提袋，收納體積僅有一般折疊桌的三分之一，露營野餐無負擔。',
    price: 1850,
    originalPrice: 2200,
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewCount: 61,
    stock: 14,
    specs: {
      '材質': '航太級 7075 鋁合金, 噴砂耐磨桌面',
      '展開尺寸': '70cm x 70cm x 45cm',
      '收納尺寸': '70cm x 15cm x 12cm'
    },
    tags: ['極輕量', '快速組裝', '露營神物']
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: '張*豪',
    rating: 5,
    comment: '主動降噪效果比想像中還要強大！捷運上的引擎聲幾乎都被隔絕了。配戴感非常舒適，戴了三個小時耳朵完全不痛，極度推薦！',
    date: '2026-06-25 14:32'
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userName: '林*婷',
    rating: 4,
    comment: '燕麥奶色實體超級美！音質清脆乾淨，尤其是人聲部分很突出。稍微重了一點點，但看在續航力那麼好的份上可以接受。',
    date: '2026-06-20 09:15'
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    userName: '陳*傑',
    rating: 5,
    comment: '21:9 的寬螢幕用來看電影跟玩賽車遊戲太震撼了！144Hz 更新率真的很滑順，沒有任何殘影。桌子夠寬的話一定要入手。',
    date: '2026-06-27 18:45'
  },
  {
    id: 'rev-4',
    productId: 'prod-6',
    userName: '葉*均',
    rating: 5,
    comment: '手沖愛好者必買！極細口水流非常穩，溫度控制很精準。而且擺在廚房顏值爆表，每天早上起床泡咖啡都心情很好。',
    date: '2026-06-22 11:24'
  }
];
