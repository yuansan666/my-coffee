// goods-detail.html 商品详情页的购物车功能
function addToCartDetail() {
    const productName = document.getElementById('productName').textContent;
    const productPrice = parseFloat(document.getElementById('productPrice').textContent);
    
    // 为这个页面创建一个商品ID
    const productId = 'detail-1';
    
    // 添加商品到购物车
    window.addToCart(productId, productName, productPrice, '☕');
}

function changeQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    let quantity = parseInt(quantityInput.value);
    quantity += change;
    
    if (quantity < 1) quantity = 1;
    if (quantity > 9999) quantity = 9999;
    
    quantityInput.value = quantity;
}

function changeImage(image, element) {
    document.getElementById('mainImage').textContent = image;
    
    // 更新缩略图激活状态
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    element.classList.add('active');
}

function buyNow() {
    addToCartDetail();
    // 跳转到购物车页面
    window.location.href = 'shopping-cart.html';
}