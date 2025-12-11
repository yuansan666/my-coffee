// 用户认证相关功能
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // 从localStorage获取注册信息
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    
    if (username && password) {
        // 检查是否与注册信息匹配
        if (storedUsername === username && storedPassword === password) {
            alert('登录成功！');
            // 存储登录状态
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', username);
            // 跳转到主页
            window.location.href = 'main.html';
        } else {
            // 如果没有注册信息，使用默认账户
            if (!storedUsername && !storedPassword) {
                if (username === 'admin' && password === '123456') {
                    alert('登录成功！使用默认账户');
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('currentUser', username);
                    window.location.href = 'main.html';
                } else {
                    alert('用户名或密码错误！');
                }
            } else {
                alert('用户名或密码错误！');
            }
        }
    } else {
        alert('请输入用户名和密码！');
    }
}

// 更新用户状态（用于导航栏）
function updateUserStatus() {
    const userActions = document.getElementById('userActions');
    if (!userActions) return;
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (isLoggedIn === 'true' && currentUser) {
        userActions.innerHTML = `
            <div class="user-info">
                欢迎，<span>${currentUser}</span>
            </div>
            <a href="#" class="btn-login" onclick="logout()">退出</a>
        `;
    } else {
        userActions.innerHTML = `
            <a href="index.html" class="btn-login">登录</a>
            <a href="register.html" class="btn-register">注册</a>
        `;
    }
}

// 登出功能
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    alert('已成功退出登录');
    updateUserStatus();
    // 如果当前在需要登录的页面，跳转到登录页
    if (window.location.pathname.includes('main.html')) {
        window.location.href = 'index.html';
    }
}

// 页面加载时更新用户状态
document.addEventListener('DOMContentLoaded', function() {
    updateUserStatus();
    
    // 设置导航栏活动状态
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-menu li');
    
    navItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            const linkPage = link.getAttribute('href');
            if (currentPage === linkPage || 
                (currentPage === '' && linkPage === 'main.html') ||
                (currentPage === 'index.html' && linkPage === 'main.html')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
    });
    
    // 登录页的回车键功能
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    }
});

