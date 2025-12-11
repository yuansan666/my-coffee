/**
 * products-ui.js
 * 处理商品分类页面的渲染、筛选和分页逻辑
 */

// 状态变量
let currentCategory = 'all';
let currentPrice = 'all';
let currentBrand = 'all';
let currentSort = 'default';
let currentPage = 1;
const itemsPerPage = 8;
let categories = [
    { id: 'all', name: '全部商品' },
    { id: 'white-coffee', name: '白咖啡' },
    { id: 'coffee-beans', name: '咖啡豆' },
    { id: 'coffee-equipment', name: '咖啡器具' },
    { id: 'instant-coffee', name: '速溶咖啡' },
    { id: 'accessories', name: '咖啡辅料' },
    { id: 'cups', name: '咖啡杯具' }
];

document.addEventListener('DOMContentLoaded', function() {
    // 确保 cart.js 已经加载并初始化
    if(window.loadCart) window.loadCart();

    renderCategories();
    renderProducts();
    updateActiveFilters();
});

// 渲染分类侧边栏
function renderCategories() {
    const categoryList = document.getElementById('categoryList');
    if(!categoryList) return;

    categoryList.innerHTML = '';
    categories.forEach(category => {
        const li = document.createElement('li');
        li.className = 'category-item';

        const a = document.createElement('a');
        a.href = 'javascript:void(0)';
        a.textContent = category.name;
        // 使用闭包防止变量污染，也可以使用 dataset
        a.onclick = () => filterCategory(category.id);
        if(category.id === currentCategory) a.classList.add('active');

        li.appendChild(a);
        categoryList.appendChild(li);
    });
}

// 核心渲染函数
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if(!productsGrid) return;

    // 1. 获取所有商品 (window.getProducts 来自 products.js)
    let allProducts = window.getProducts();

    // 2. 筛选
    let filtered = allProducts.filter(p => {
        // 分类
        if (currentCategory !== 'all' && p.category !== currentCategory) return false;
        // 品牌
        if (currentBrand !== 'all' && p.brand !== currentBrand) return false;
        // 价格
        if (currentPrice !== 'all') {
            if (currentPrice === '0-50' && p.price > 50) return false;
            if (currentPrice === '50-100' && (p.price <= 50 || p.price > 100)) return false;
            if (currentPrice === '100-200' && (p.price <= 100 || p.price > 200)) return false;
            if (currentPrice === '200+' && p.price <= 200) return false;
        }
        return true;
    });

    // 3. 排序
    if (currentSort === 'sales') filtered.sort((a, b) => b.sales - a.sales);
    else if (currentSort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (currentSort === 'price-desc') filtered.sort((a, b) => b.price - a.price);

    // 更新计数
    const countEl = document.getElementById('productCount');
    if(countEl) countEl.textContent = filtered.length;

    // 4. 分页
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    // 防止当前页码超出范围
    if (currentPage > totalPages) currentPage = 1;

    const start = (currentPage - 1) * itemsPerPage;
    const currentItems = filtered.slice(start, start + itemsPerPage);

    // 5. 生成 HTML
    productsGrid.innerHTML = '';
    if (currentItems.length === 0) {
        productsGrid.innerHTML = '<div class="col-12 text-center py-5 text-muted">没有找到符合条件的商品</div>';
    } else {
        currentItems.forEach(p => {
            // 检查购物车数量
            const cartItem = window.cart ? window.cart.find(item => item.id === p.id) : null;
            const qty = cartItem ? cartItem.quantity : 0;

            const html = `
                <div class="product-card">
                    <div class="product-img">
                        <img src="${p.image}" alt="${p.name}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <div class="product-title" title="${p.name}">${p.name}</div>
                        <div class="product-price">
                            ¥${p.price.toFixed(2)} 
                            <del>¥${p.originalPrice.toFixed(2)}</del>
                        </div>
                        <div class="product-sales">销量 ${p.sales}</div>
                        <button class="btn-add-cart ${qty > 0 ? 'added' : ''}" 
                                onclick="handleAddToCart('${p.id}', '${p.name}', ${p.price}, '${p.image}', this)">
                            ${qty > 0 ? `已加 (${qty})` : '加入购物车'}
                        </button>
                    </div>
                </div>
            `;
            productsGrid.innerHTML += html;
        });
    }

    renderPagination(totalPages);
}

// 分页渲染
function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    if(!pagination || totalPages <= 1) {
        if(pagination) pagination.innerHTML = '';
        return;
    }

    let html = '';
    // 上一页
    html += `<a href="#" class="page-link ${currentPage === 1 ? 'disabled' : ''}" onclick="changePage(${currentPage - 1}); return false;">上一页</a>`;

    // 页码
    for (let i = 1; i <= totalPages; i++) {
        html += `<a href="#" class="page-link ${i === currentPage ? 'active' : ''}" onclick="changePage(${i}); return false;">${i}</a>`;
    }

    // 下一页
    html += `<a href="#" class="page-link ${currentPage === totalPages ? 'disabled' : ''}" onclick="changePage(${currentPage + 1}); return false;">下一页</a>`;

    pagination.innerHTML = html;
}

// 交互函数
function changePage(page) {
    if (page < 1) return;
    currentPage = page;
    renderProducts();
    // 滚动到顶部
    document.querySelector('.products-container').scrollIntoView({ behavior: 'smooth' });
}

function filterCategory(id) {
    currentCategory = id;
    currentPage = 1;
    updateActiveFilters();
    renderProducts();
}

function filterPrice(range) {
    currentPrice = range;
    currentPage = 1;
    updateActiveFilters();
    renderProducts();
}

function filterBrand(brand) {
    currentBrand = brand;
    currentPage = 1;
    updateActiveFilters();
    renderProducts();
}

function handleSort() {
    currentSort = document.getElementById('sortSelect').value;
    currentPage = 1;
    renderProducts();
}

// 辅助：处理加入购物车点击
function handleAddToCart(id, name, price, img, btn) {
    if(window.addToCart) {
        window.addToCart(id, name, price, img);
        // 简单更新按钮状态
        btn.classList.add('added');
        btn.textContent = '已加入';
        setTimeout(() => renderProducts(), 500); // 刷新显示数量
    }
}

// 更新筛选按钮的高亮状态
function updateActiveFilters() {
    // 这里可以使用 CSS 选择器移除所有 .active 类，再根据 currentX 变量添加回去
    // 为保持代码简洁，略过具体 DOM 操作细节，逻辑同原代码
    document.querySelectorAll('.category-item a').forEach(el => {
        el.classList.toggle('active', el.textContent === categories.find(c => c.id === currentCategory).name);
    });

    document.querySelectorAll('[data-price]').forEach(el => {
        el.classList.toggle('active', el.dataset.price === currentPrice);
    });

    document.querySelectorAll('[data-brand]').forEach(el => {
        el.classList.toggle('active', el.dataset.brand === currentBrand);
    });
}