// 商品数据定义
window.products = [
    // 白咖啡类
    {id: 1, name: "越南中原G7速溶咖啡800g", price: 33.99, originalPrice: 46.90, sales: 360089, category: "white-coffee", brand: "g7", image: "img/G7.jpg"},
    {id: 2, name: "新加坡OWL猫头鹰速溶咖啡900g", price: 32.99, originalPrice: 45.00, sales: 366699, category: "white-coffee", brand: "owl", image: "img/mty.png"},
    {id: 3, name: "马来西亚泽合白咖啡600g", price: 63.00, originalPrice: 75.00, sales: 24212, category: "white-coffee", brand: "oldtown", image: "img/zb.png"},
    {id: 4, name: "旧街场白咖啡640g", price: 41.99, originalPrice: 55.00, sales: 4598, category: "white-coffee", brand: "oldtown", image: "img/jjc.png"},
    {id: 5, name: "猫头鹰低脂速溶咖啡900g", price: 42.59, originalPrice: 52.59, sales: 1714, category: "white-coffee", brand: "owl", image: "img/mtydz.png"},
    
    // 咖啡豆类
    {id: 6, name: "云南小粒咖啡豆500g", price: 89.90, originalPrice: 108.00, sales: 1543, category: "coffee-beans", brand: "other", image: "img/ynxl.png"},
    {id: 7, name: "巴西阿拉比卡咖啡豆500g", price: 78.50, originalPrice: 95.00, sales: 2345, category: "coffee-beans", brand: "other", image: "img/bxal.png"},
    {id: 8, name: "哥伦比亚咖啡豆500g", price: 85.00, originalPrice: 102.00, sales: 1876, category: "coffee-beans", brand: "other", image: "img/glby.png"},
    {id: 9, name: "有机咖啡豆250g", price: 56.00, originalPrice: 68.00, sales: 987, category: "coffee-beans", brand: "other", image: "img/yjkfd.png"},
    {id: 10, name: "意式浓缩拼配豆500g", price: 78.00, originalPrice: 92.00, sales: 1234, category: "coffee-beans", brand: "other", image: "img/ysnsppd.png"},
    
    // 速溶咖啡类
    {id: 11, name: "新加坡爷爷咖啡1000g", price: 39.99, originalPrice: 49.99, sales: 14321, category: "instant-coffee", brand: "other", image: "img/yeye.png"},
    {id: 12, name: "雀巢金牌速溶咖啡200g", price: 69.90, originalPrice: 85.00, sales: 5890, category: "instant-coffee", brand: "nescafe", image: "img/qcjp.png"},
    {id: 13, name: "麦斯威尔三合一咖啡500g", price: 36.80, originalPrice: 45.00, sales: 4321, category: "instant-coffee", brand: "maxwell", image: "img/id13.png"},
    {id: 14, name: "印尼Kapal Api咖啡400g", price: 28.90, originalPrice: 38.00, sales: 3765, category: "instant-coffee", brand: "other", image: "img/id14.png"},
    {id: 15, name: "泰国高盛咖啡500g", price: 32.50, originalPrice: 42.00, sales: 2987, category: "instant-coffee", brand: "other", image: "img/id15.png"},
    
    // 咖啡器具类
    {id: 16, name: "意式浓缩咖啡机", price: 899.00, originalPrice: 1099.00, sales: 567, category: "coffee-equipment", brand: "other", image: "img/id16.png"},
    {id: 17, name: "手动咖啡研磨机", price: 159.00, originalPrice: 199.00, sales: 892, category: "coffee-equipment", brand: "other", image: "img/id17.png"},
    {id: 18, name: "咖啡滤纸100片装", price: 18.90, originalPrice: 25.00, sales: 4567, category: "coffee-equipment", brand: "other", image: "img/id18.png"},
    {id: 19, name: "咖啡奶泡器电动", price: 49.90, originalPrice: 68.00, sales: 1234, category: "coffee-equipment", brand: "other", image: "img/id19.png"},
    {id: 20, name: "法压壶350ml", price: 78.00, originalPrice: 98.00, sales: 876, category: "coffee-equipment", brand: "other", image: "img/id20.png"},
    
    // 咖啡辅料和杯具类
    {id: 21, name: "马来西亚进口可可粉500g", price: 29.99, originalPrice: 39.99, sales: 18619, category: "accessories", brand: "other", image: "img/kkf.png"},
    {id: 22, name: "比利时焦糖饼干礼盒312g", price: 43.99, originalPrice: 55.00, sales: 1647, category: "accessories", brand: "other", image: "img/bg.png"},
    {id: 23, name: "陶瓷咖啡杯套装", price: 68.00, originalPrice: 88.00, sales: 987, category: "cups", brand: "other", image: "img/id23.png"},
    {id: 24, name: "保温咖啡杯", price: 89.00, originalPrice: 120.00, sales: 876, category: "cups", brand: "other", image: "img/id24.png"}
];

// 搜索函数
window.searchProducts = function(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return [];
    }
    
    const term = searchTerm.toLowerCase().trim();
    
    return window.products.filter(product => {
        return product.name.toLowerCase().includes(term) ||
               product.brand.toLowerCase().includes(term) ||
               product.category.toLowerCase().includes(term);
    });
}

// 获取商品函数
window.getProducts = function() {
    return window.products;
}

// 根据ID获取商品函数
window.getProductById = function(productId) {
    return window.products.find(product => product.id === productId);
}