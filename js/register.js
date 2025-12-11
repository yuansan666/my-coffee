function register() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // 简单的验证
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
        alert('请填写所有必填字段！');
        return;
    }
    
    if (!agreeTerms) {
        alert('请同意服务条款和隐私政策！');
        return;
    }
    
    // 用户名验证
    const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/;
    if (!usernameRegex.test(username)) {
        alert('用户名必须是4-16个字符，只能包含字母、数字和下划线！');
        return;
    }
    
    // 密码验证
    if (password.length < 8) {
        alert('密码长度至少为8个字符！');
        return;
    }
    
    // 密码复杂度验证（简单版本）
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!hasLetter || !hasNumber) {
        alert('密码必须包含字母和数字！');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('两次输入的密码不一致！');
        return;
    }
    
    // 检查用户名是否已存在
    const storedUsername = localStorage.getItem('username');
    if (storedUsername === username) {
        alert('该用户名已被注册，请选择其他用户名！');
        return;
    }
    
    // 保存用户信息到localStorage
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    localStorage.setItem('registrationDate', new Date().toISOString());
    
    alert('注册成功！\n欢迎加入Star咖啡商城！');
    
    // 自动登录并跳转到主页
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', username);
    window.location.href = 'main.html';
}

// 回车键提交
document.getElementById('confirmPassword').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        register();
    }
});