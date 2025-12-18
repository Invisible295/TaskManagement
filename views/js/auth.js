// views/js/auth.js
// Authentication logic - Login & Register

// Kiểm tra đã đăng nhập chưa (redirect nếu đã login)
if (isAuthenticated()) {
    window.location.href = 'dashboard.html';
}

// ===== UI FUNCTIONS =====

// Chuyển tab Login/Register
function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.form');
    
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    
    if (tab === 'login') {
        tabs[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    }
    
    hideAlert();
}

// Hiển thị thông báo
function showAlert(message, type = 'error') {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert alert-${type} show`;
    
    setTimeout(() => hideAlert(), 5000);
}

function hideAlert() {
    const alert = document.getElementById('alert');
    alert.classList.remove('show');
}

// ===== LOGIN HANDLER =====
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = e.target.querySelector('.btn');
    
    // Validation
    if (!username || !password) {
        showAlert('Vui lòng điền đầy đủ thông tin');
        return;
    }
    
    // Disable button & show loading
    btn.disabled = true;
    btn.innerHTML = '<span class="loading"></span>';
    
    try {
        // Call API - Dùng CONFIG.API_URL từ config.js
        const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Lưu token và user info
            saveToken(data.data.token);
            saveUser(data.data.user);
            
            showAlert('Đăng nhập thành công!', 'success');
            
            // Redirect sau 1 giây
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showAlert(data.message || 'Đăng nhập thất bại');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Không thể kết nối đến server. Vui lòng thử lại.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Đăng nhập';
    }
});

// ===== REGISTER HANDLER =====
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value.trim();
    const fullname = document.getElementById('regFullname').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const btn = e.target.querySelector('.btn');
    
    // Validation
    if (!username || !fullname || !email || !password) {
        showAlert('Vui lòng điền đầy đủ thông tin');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Mật khẩu phải có ít nhất 6 ký tự');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Email không hợp lệ');
        return;
    }
    
    // Disable button & show loading
    btn.disabled = true;
    btn.innerHTML = '<span class="loading"></span>';
    
    try {
        // Call API - Dùng CONFIG.API_URL từ config.js
        const response = await fetch(`${CONFIG.API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, fullname, email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Lưu token và user info
            saveToken(data.data.token);
            saveUser(data.data.user);
            
            showAlert('Đăng ký thành công!', 'success');
            
            // Redirect sau 1 giây
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showAlert(data.message || 'Đăng ký thất bại');
        }
    } catch (error) {
        console.error('Register error:', error);
        showAlert('Không thể kết nối đến server. Vui lòng thử lại.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Đăng ký';
    }
});

// ===== DEBUG INFO =====
if (CONFIG.DEBUG) {
    console.log('🔐 Auth page loaded');
    console.log('📡 API URL:', CONFIG.API_URL);
}