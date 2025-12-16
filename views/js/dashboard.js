// views/js/dashboard.js
// Dashboard logic - Tasks, Groups, Profile management

// Kiểm tra authentication
requireAuth();

// ===== STATE =====
let currentTasks = [];
let currentGroups = [];
let editingTaskId = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
    loadTasks();
    
    if (CONFIG.DEBUG) {
        console.log('📊 Dashboard loaded');
        console.log('👤 Current user:', getUser());
    }
});

// ===== USER INFO =====
async function loadUserInfo() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/auth/me`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('userName').textContent = data.data.user.fullname;
            saveUser(data.data.user);
        }
    } catch (error) {
        console.error('Error loading user:', error);
    }
}

// Đăng xuất
function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        removeToken();
        window.location.href = 'login.html';
    }
}

// ===== NAVIGATION =====
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        
        // Update active states
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        item.classList.add('active');
        document.getElementById(page + 'Page').classList.add('active');
        
        // Update page title
        const titles = {
            tasks: 'Công việc của tôi',
            groups: 'Nhóm của tôi',
            profile: 'Hồ sơ cá nhân'
        };
        document.getElementById('pageTitle').textContent = titles[page];
        
        // Load data
        if (page === 'tasks') loadTasks();
        if (page === 'groups') loadGroups();
        if (page === 'profile') loadProfile();
    });
});

// ===== TASKS =====
async function loadTasks() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/tasks`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        
        if (data.status === 'success') {
            currentTasks = data.data.tasks;
            displayTasks(currentTasks);
            
            if (CONFIG.DEBUG) console.log('✅ Tasks loaded:', currentTasks.length);
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        document.getElementById('tasksList').innerHTML = `
            <div class="empty-state">
                <h3>❌ Lỗi tải dữ liệu</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

function displayTasks(tasks) {
    const container = document.getElementById('tasksList');
    
    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>📝 Chưa có công việc</h3>
                <p>Thêm công việc đầu tiên của bạn!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tasks.map(task => {
        // Status class
        let statusClass = 'status-pending';
        if (task.status === 'In Progress') statusClass = 'status-progress';
        if (task.status === 'Completed') statusClass = 'status-completed';
        
        return `
        <div class="task-card">
            <div class="task-header">
                <div>
                    <div class="task-title">${escapeHtml(task.taskname)}</div>
                    <div class="task-priority">${'⭐'.repeat(task.priority)}</div>
                </div>
            </div>
            <div class="task-description">${escapeHtml(task.description) || 'Không có mô tả'}</div>
            <div class="task-footer">
                <span class="task-status ${statusClass}">
                    ${task.status}
                </span>
                <div class="task-actions">
                    <button class="btn-icon" onclick="editTask(${task.taskid})" title="Sửa">✏️</button>
                    <button class="btn-icon" onclick="deleteTask(${task.taskid})" title="Xóa">🗑️</button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function filterTasks() {
    const status = document.getElementById('filterStatus').value;
    const priority = document.getElementById('filterPriority').value;
    
    let filtered = currentTasks;
    
    if (status) {
        filtered = filtered.filter(t => t.status === status);
    }
    if (priority) {
        filtered = filtered.filter(t => t.priority == priority);
    }
    
    displayTasks(filtered);
}

function searchTasks() {
    const keyword = document.getElementById('searchTask').value.toLowerCase();
    
    if (!keyword) {
        displayTasks(currentTasks);
        return;
    }
    
    const filtered = currentTasks.filter(t => 
        t.taskname.toLowerCase().includes(keyword) || 
        (t.description && t.description.toLowerCase().includes(keyword))
    );
    
    displayTasks(filtered);
}

// ===== MODAL =====
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
    if (modalId === 'taskModal' && !editingTaskId) {
        document.getElementById('taskForm').reset();
        document.getElementById('taskModalTitle').textContent = 'Thêm công việc';
        document.getElementById('taskId').value = '';
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
    editingTaskId = null;
}

// ===== TASK FORM =====
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const taskId = document.getElementById('taskId').value;
    const taskData = {
        taskname: document.getElementById('taskName').value.trim(),
        description: document.getElementById('taskDescription').value.trim(),
        status: document.getElementById('taskStatus').value,
        priority: parseInt(document.getElementById('taskPriority').value)
    };
    
    try {
        let response;
        if (taskId) {
            // Update existing task
            response = await fetch(`${CONFIG.API_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(taskData)
            });
        } else {
            // Create new task
            response = await fetch(`${CONFIG.API_URL}/tasks/create`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(taskData)
            });
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
            closeModal('taskModal');
            loadTasks();
            alert(taskId ? '✅ Cập nhật thành công!' : '✅ Thêm thành công!');
        } else {
            alert('❌ ' + (data.message || 'Có lỗi xảy ra'));
        }
    } catch (error) {
        console.error('Error saving task:', error);
        alert('❌ Không thể lưu công việc');
    }
});

async function editTask(taskId) {
    editingTaskId = taskId;
    const task = currentTasks.find(t => t.taskid === taskId);
    
    if (task) {
        document.getElementById('taskId').value = task.taskid;
        document.getElementById('taskName').value = task.taskname;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskStatus').value = task.status;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskModalTitle').textContent = 'Sửa công việc';
        openModal('taskModal');
    }
}

async function deleteTask(taskId) {
    if (!confirm('Bạn có chắc muốn xóa công việc này?')) return;
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (response.ok || response.status === 204) {
            loadTasks();
            alert('✅ Xóa thành công!');
        } else {
            const data = await response.json();
            alert('❌ ' + (data.message || 'Không thể xóa'));
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('❌ Không thể xóa công việc');
    }
}

// ===== GROUPS =====
async function loadGroups() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/groups`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        
        if (data.status === 'success') {
            currentGroups = data.data.groups;
            displayGroups(currentGroups);
            
            if (CONFIG.DEBUG) console.log('✅ Groups loaded:', currentGroups.length);
        }
    } catch (error) {
        console.error('Error loading groups:', error);
        document.getElementById('groupsList').innerHTML = `
            <div class="empty-state">
                <h3>❌ Lỗi tải dữ liệu</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

function displayGroups(groups) {
    const container = document.getElementById('groupsList');
    
    if (groups.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>👥 Chưa có nhóm</h3>
                <p>Tạo nhóm mới để làm việc nhóm!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = groups.map(group => `
        <div class="group-card">
            <div class="group-name">${escapeHtml(group.groupName)}</div>
            <div class="group-info">👤 Trưởng nhóm: ${escapeHtml(group.truongnhom_name || group.truongnhom_fullname || 'N/A')}</div>
            <div class="group-info">👥 Vai trò: ${group.role === 'leader' ? 'Trưởng nhóm' : 'Thành viên'}</div>
            ${group.memberCount ? `<div class="group-info">👨‍👩‍👧‍👦 Thành viên: ${group.memberCount}</div>` : ''}
        </div>
    `).join('');
}

// ===== PROFILE =====
async function loadProfile() {
    const user = getUser();
    if (user) {
        document.getElementById('profileUsername').value = user.username;
        document.getElementById('profileFullname').value = user.fullname;
        document.getElementById('profileEmail').value = user.email;
    }
}

document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const profileData = {
        fullname: document.getElementById('profileFullname').value.trim(),
        email: document.getElementById('profileEmail').value.trim()
    };
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/auth/profile`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(profileData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            saveUser(data.data.user);
            loadUserInfo();
            alert('✅ Cập nhật thành công!');
        } else {
            alert('❌ ' + (data.message || 'Có lỗi xảy ra'));
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('❌ Không thể cập nhật thông tin');
    }
});

// ===== UTILITY =====
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}