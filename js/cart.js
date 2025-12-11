// cart.js - 简单的购物车系统
// 暴露到全局作用域，以便其他文件可以访问
window.cart = [];

// 从本地存储加载购物车
function loadCart() {
    const savedCart = localStorage.getItem('starCoffeeCart');
    if (savedCart) {
        window.cart = JSON.parse(savedCart);
    } else {
        // 如果本地存储没有购物车，创建一个空的
        window.cart = [];
    }
    updateCartCount();
}

// 保存购物车到本地存储
function saveCart() {
    localStorage.setItem('starCoffeeCart', JSON.stringify(window.cart));
    updateCartCount();
}

// 更新购物车数量显示
function updateCartCount() {
    const totalItems = window.cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(element => {
        if (element) element.textContent = totalItems;
    });
}

// 添加商品到购物车（通用函数）
function addToCart(productId, productName, productPrice, productImage = '☕') {
    // 检查参数是否有效
    if (!productId || !productName || productPrice <= 0) {
        alert('添加商品失败：参数无效！');
        return false;
    }
    
    // 检查是否已存在
    const existingItemIndex = window.cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        // 如果已存在，增加数量
        window.cart[existingItemIndex].quantity += 1;
        alert(`"${productName}" 已添加到购物车！\n当前数量：${window.cart[existingItemIndex].quantity}`);
    } else {
        // 如果不存在，添加新商品
        window.cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
        alert(`"${productName}" 已添加到购物车！`);
    }
    
    window.saveCart();
    
    // 返回成功消息
    return true;
}

// 从购物车移除商品
function removeFromCart(productId) {
    const itemIndex = window.cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        const itemName = window.cart[itemIndex].name;
        window.cart = window.cart.filter(item => item.id !== productId);
        window.saveCart();
        alert(`"${itemName}" 已从购物车移除！`);
        return true;
    }
    return false;
}

// 改变商品数量
function changeQuantity(productId, change) {
    const itemIndex = window.cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        window.cart[itemIndex].quantity += change;
        
        // 确保数量至少为1
        if (window.cart[itemIndex].quantity < 1) {
            window.cart[itemIndex].quantity = 1;
        }
        
        saveCart();
        return true;
    }
    return false;
}

// 设置商品数量
function setQuantity(productId, quantity) {
    const itemIndex = window.cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        const newQuantity = Math.max(1, parseInt(quantity));
        window.cart[itemIndex].quantity = newQuantity;
        saveCart();
        return true;
    }
    return false;
}

// 获取购物车中商品的总数量
function getCartTotalItems() {
    return window.cart.reduce((total, item) => total + item.quantity, 0);
}

// 获取购物车中商品的总金额
function getCartTotalAmount() {
    return window.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// 检查购物车是否为空
function isCartEmpty() {
    return window.cart.length === 0;
}

// 清空购物车
function clearCart() {
    window.cart = [];
    window.saveCart();
    alert('购物车已清空！');
    return true;
}

// 初始化购物车
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});

// 将关键函数暴露到全局作用域
window.loadCart = loadCart;
window.saveCart = saveCart;
window.updateCartCount = updateCartCount;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.changeQuantity = changeQuantity;
window.setQuantity = setQuantity;
window.getCartTotalItems = getCartTotalItems;
window.getCartTotalAmount = getCartTotalAmount;
window.isCartEmpty = isCartEmpty;
window.clearCart = clearCart;