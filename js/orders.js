// 订单功能
function loadOrders(filter = 'all') {
    const ordersList = document.getElementById('ordersList');
    const emptyOrders = document.getElementById('emptyOrders');
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // 如果没有订单，添加一些示例订单
    if (orders.length === 0) {
        orders = [
            {
                id: 'ORD20231215001',
                date: '2023-12-15',
                items: [
                    { id: 'g1', name: '越南中原G7速溶咖啡800g', price: 33.99, quantity: 2 },
                    { id: 'g3', name: '马来西亚泽合白咖啡600g', price: 63.00, quantity: 1 }
                ],
                total: 130.98,
                status: 'completed'
            },
            {
                id: 'ORD20231210001',
                date: '2023-12-10',
                items: [
                    { id: 'g2', name: '新加坡OWL猫头鹰速溶咖啡900g', price: 32.99, quantity: 1 },
                    { id: 'g5', name: '新加坡爷爷咖啡1000g', price: 39.99, quantity: 1 }
                ],
                total: 72.98,
                status: 'shipped'
            }
        ];
        
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    // 过滤订单
    if (filter !== 'all') {
        orders = orders.filter(order => order.status === filter);
    }
    
    if (orders.length === 0) {
        ordersList.innerHTML = '';
        emptyOrders.style.display = 'block';
        return;
    }
    
    emptyOrders.style.display = 'none';
    
    let html = '';
    
    orders.forEach(order => {
        const statusText = getStatusText(order.status);
        const statusClass = getStatusClass(order.status);
        
        html += `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <span class="order-id">订单号：${order.id}</span>
                        <span class="order-date">下单时间：${order.date}</span>
                    </div>
                    <span class="order-status ${statusClass}">${statusText}</span>
                </div>
                
                <div class="order-items">
        `;
        
        order.items.forEach(item => {
            html += `
                <div class="order-item">
                    <div class="item-image">${getProductIcon(item.id)}</div>
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-quantity">数量：${item.quantity}</div>
                    </div>
                    <div class="item-price">¥${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
        });
        
        html += `
                </div>
                
                <div class="order-footer">
                    <div class="order-total">实付金额：¥${order.total.toFixed(2)}</div>
                    <div class="order-actions">
        `;
        
        if (order.status === 'pending') {
            html += `
                <button class="btn btn-sm btn-warning" onclick="payOrder('${order.id}')">立即支付</button>
                <button class="btn btn-sm btn-outline-secondary" onclick="cancelOrder('${order.id}')">取消订单</button>
            `;
        } else if (order.status === 'shipped') {
            html += `
                <button class="btn btn-sm btn-success" onclick="confirmReceipt('${order.id}')">确认收货</button>
            `;
        } else if (order.status === 'completed') {
            html += `
                <button class="btn btn-sm btn-outline-primary" onclick="viewOrderDetail('${order.id}')">查看详情</button>
            `;
        }
        
        html += `
                    </div>
                </div>
            </div>
        `;
    });
    
    ordersList.innerHTML = html;
}

function getStatusText(status) {
    const statusMap = {
        'pending': '待付款',
        'shipped': '已发货',
        'completed': '已完成',
        'cancelled': '已取消'
    };
    
    return statusMap[status] || '未知状态';
}

function getStatusClass(status) {
    const classMap = {
        'pending': 'status-pending',
        'shipped': 'status-shipped',
        'completed': 'status-completed',
        'cancelled': 'status-cancelled'
    };
    
    return classMap[status] || '';
}

function filterOrders(status) {
    // 更新标签状态
    document.querySelectorAll('.order-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    // 加载对应状态的订单
    loadOrders(status);
}

function payOrder(orderId) {
    if (confirm('确定要支付这个订单吗？')) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'shipped';
            localStorage.setItem('orders', JSON.stringify(orders));
            alert('支付成功！订单状态已更新为已发货。');
            loadOrders('all');
            
            // 重新激活所有订单标签
            document.querySelectorAll('.order-tab').forEach(tab => {
                if (tab.textContent === '全部订单') {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
        }
    }
}

function cancelOrder(orderId) {
    if (confirm('确定要取消这个订单吗？')) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'cancelled';
            localStorage.setItem('orders', JSON.stringify(orders));
            alert('订单已取消！');
            loadOrders('all');
            
            // 重新激活所有订单标签
            document.querySelectorAll('.order-tab').forEach(tab => {
                if (tab.textContent === '全部订单') {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
        }
    }
}

function confirmReceipt(orderId) {
    if (confirm('确定已收到商品吗？')) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'completed';
            localStorage.setItem('orders', JSON.stringify(orders));
            alert('确认收货成功！订单状态已更新为已完成。');
            loadOrders('all');
            
            // 重新激活所有订单标签
            document.querySelectorAll('.order-tab').forEach(tab => {
                if (tab.textContent === '全部订单') {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
        }
    }
}

function viewOrderDetail(orderId) {
    alert(`订单 ${orderId} 的详细信息\n\n您可以在订单详情页面查看物流信息、商品详情等。`);
}

// 页面加载时加载订单
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        loadOrders('all');
    });
} else {
    loadOrders('all');
}