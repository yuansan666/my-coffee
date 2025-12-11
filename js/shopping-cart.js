// shopping-cart.js - 购物车页面功能

// 渲染购物车项目
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartDiv = document.getElementById('emptyCart');
    const cartSummaryDiv = document.getElementById('cartSummary');
    
    // 加载购物车数据
    window.loadCart();
    
    if (window.cart.length === 0) {
        // 显示空购物车
        if (emptyCartDiv) emptyCartDiv.style.display = 'block';
        if (cartSummaryDiv) cartSummaryDiv.style.display = 'none';
        if (cartItemsContainer) cartItemsContainer.innerHTML = '';
        return;
    }
    
    // 显示购物车内容和摘要
    if (emptyCartDiv) emptyCartDiv.style.display = 'none';
    if (cartSummaryDiv) cartSummaryDiv.style.display = 'flex';
    
    // 生成购物车项目HTML
    let cartHTML = '';
    
    // 添加全选复选框
    cartHTML += `
        <div class="cart-header" style="border-radius: 8px 8px 0 0; margin-bottom: 2px;">
            <div class="item-checkbox" style="margin-right: 20px;">
                <input type="checkbox" id="selectAll" onclick="toggleSelectAll()">
                <label for="selectAll" style="margin-left: 5px; cursor: pointer;">全选</label>
            </div>
            <div style="flex: 1;">商品信息</div>
            <div style="width: 80px; text-align: center;">单价</div>
            <div style="width: 120px; text-align: center;">数量</div>
            <div style="width: 100px; text-align: right; margin-right: 20px;">小计</div>
            <div style="width: 80px; text-align: center;">操作</div>
        </div>
    `;
    
    window.cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        let itemImageHTML = '';
        
        // 判断是图片路径还是emoji
        if (item.image && item.image.startsWith('img/')) {
            // 如果是图片路径，使用img标签
            itemImageHTML = `<img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        } else {
            // 如果是emoji或其他，直接显示
            itemImageHTML = item.image || '☕';
        }
        
        cartHTML += `
            <div class="cart-item">
                <div class="item-checkbox">
                    <input type="checkbox" class="item-select" checked onchange="updateCartSummary()" data-id="${item.id}">
                </div>
                <div class="item-image">${itemImageHTML}</div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">¥${item.price.toFixed(2)}</div>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn" onclick="changeCartQuantity('${item.id}', -1)">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', this.value)">
                    <button class="quantity-btn" onclick="changeCartQuantity('${item.id}', 1)">+</button>
                </div>
                <div class="item-total">¥${itemTotal.toFixed(2)}</div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-outline-danger" onclick="removeCartItem('${item.id}')">删除</button>
                </div>
            </div>
        `;
    });
    
    // 添加清空购物车按钮
    cartHTML += `
        <div class="cart-header" style="justify-content: flex-end; border-radius: 0 0 8px 8px; margin-top: 2px;">
            <button class="btn btn-sm btn-outline-danger" onclick="clearCartPage()">清空购物车</button>
        </div>
    `;
    
    if (cartItemsContainer) cartItemsContainer.innerHTML = cartHTML;
    updateCartSummary();
}

// 全选/取消全选
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const itemCheckboxes = document.querySelectorAll('.item-select');
    
    itemCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updateCartSummary();
}

// 购物车页面专用的数量改变函数
function changeCartQuantity(productId, change) {
    changeQuantity(productId, change);
    renderCartItems();
}

// 直接更新商品数量
function updateQuantity(productId, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 1) {
        alert('请输入有效的数量！');
        renderCartItems(); // 重新渲染以恢复原来的数量
        return;
    }
    
    // 找到商品并更新数量
    const itemIndex = window.cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        window.cart[itemIndex].quantity = quantity;
        window.saveCart();
        renderCartItems();
    }
}

// 购物车页面专用的删除函数
function removeCartItem(productId) {
    if (confirm('确定要移除这个商品吗？')) {
        window.removeFromCart(productId);
        renderCartItems();
    }
}

// 清空购物车（页面专用函数）
function clearCartPage() {
    if (confirm('确定要清空购物车吗？')) {
        // 调用全局的clearCart函数
        window.clearCart();
        renderCartItems();
    }
}

// 更新购物车摘要
function updateCartSummary() {
    // 获取所有选中的商品
    const selectedCheckboxes = document.querySelectorAll('.item-select:checked');
    const selectedItemIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.dataset.id);
    
    // 计算选中商品的总价和数量
    let totalPrice = 0;
    let selectedCount = 0;
    
    window.cart.forEach(item => {
        if (selectedItemIds.includes(item.id)) {
            totalPrice += item.price * item.quantity;
            selectedCount += item.quantity;
        }
    });
    
    // 更新显示
    const selectedCountElement = document.getElementById('selectedCount');
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (selectedCountElement) selectedCountElement.textContent = selectedCount;
    if (totalPriceElement) totalPriceElement.textContent = `¥${totalPrice.toFixed(2)}`;
    
    // 更新全选状态
    const allCheckboxes = document.querySelectorAll('.item-select');
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox && allCheckboxes.length > 0) {
        selectAllCheckbox.checked = selectedCheckboxes.length === allCheckboxes.length;
    }
}

// 结算功能
function checkout() {
    if (window.cart.length === 0) {
        alert('购物车是空的，请先添加商品！');
        return;
    }
    
    // 获取选中的商品
    const selectedCheckboxes = document.querySelectorAll('.item-select:checked');
    if (selectedCheckboxes.length === 0) {
        alert('请选择要结算的商品！');
        return;
    }
    
    const selectedItemIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.dataset.id);
    
    // 计算总金额
    let totalAmount = 0;
    const selectedItems = [];
    
    window.cart.forEach(item => {
        if (selectedItemIds.includes(item.id)) {
            totalAmount += item.price * item.quantity;
            selectedItems.push(item);
        }
    });
    
    // 简单的结算流程
    alert(`以下商品将进行结算：\n\n${selectedItems.map(item => `${item.name} x ${item.quantity}`).join('\n')}\n\n总金额：¥${totalAmount.toFixed(2)}\n\n感谢您的购买！`);
    
    // 从购物车中移除已结算的商品
    window.cart = window.cart.filter(item => !selectedItemIds.includes(item.id));
    saveCart();
    renderCartItems();
}

// 页面加载时渲染购物车
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('shopping-cart.html')) {
        renderCartItems();
    }
});