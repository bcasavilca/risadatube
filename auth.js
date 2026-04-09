// Auth System - Sign In / Sign Up

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.target;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Handle Sign In
function handleSignIn(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember')?.checked;
    
    // Validate
    if (!email || !password) {
        showError('Preencha todos os campos');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('risadatube_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showError('Email ou senha incorretos');
        return;
    }
    
    // Create session
    const session = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        loginTime: new Date().toISOString()
    };
    
    if (remember) {
        localStorage.setItem('risadatube_session', JSON.stringify(session));
    } else {
        sessionStorage.setItem('risadatube_session', JSON.stringify(session));
    }
    
    // Redirect to home
    showSuccess('Login realizado com sucesso!');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Handle Sign Up
function handleSignUp(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    // Validate
    if (!firstName || !lastName || !email || !username || !password) {
        showError('Preencha todos os campos');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('As senhas não coincidem');
        return;
    }
    
    if (password.length < 8) {
        showError('A senha deve ter pelo menos 8 caracteres');
        return;
    }
    
    if (!terms) {
        showError('Aceite os termos de serviço');
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('risadatube_users') || '[]');
    
    // Check if email exists
    if (users.find(u => u.email === email)) {
        showError('Este email já está registado');
        return;
    }
    
    // Check if username exists
    if (users.find(u => u.username === username)) {
        showError('Este nome de utilizador já existe');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        username: username.startsWith('@') ? username : '@' + username,
        password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('risadatube_users', JSON.stringify(users));
    
    // Create session
    const session = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('risadatube_session', JSON.stringify(session));
    
    showSuccess('Conta criada com sucesso!');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Social Login (simulated)
function socialLogin(provider) {
    showSuccess(`Login com ${provider} em desenvolvimento...`);
}

// Show error message
function showError(message) {
    const existing = document.querySelector('.error-message, .success-message');
    if (existing) existing.remove();
    
    const form = document.querySelector('form');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    form.insertBefore(errorDiv, form.firstChild);
}

// Show success message
function showSuccess(message) {
    const existing = document.querySelector('.error-message, .success-message');
    if (existing) existing.remove();
    
    const form = document.querySelector('form');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    form.insertBefore(successDiv, form.firstChild);
}

// Check if user is logged in
function checkAuth() {
    const session = localStorage.getItem('risadatube_session') || sessionStorage.getItem('risadatube_session');
    return session ? JSON.parse(session) : null;
}

// Logout
function logout() {
    localStorage.removeItem('risadatube_session');
    sessionStorage.removeItem('risadatube_session');
    window.location.href = 'signin.html';
}

// Update UI based on auth state - UNIVERSAL VERSION
function updateAuthUI() {
    const user = checkAuth();
    
    // Página index.html - header
    const userMenuHeader = document.getElementById('userMenuHeader');
    const authButtonsHeader = document.getElementById('authButtonsHeader');
    
    if (userMenuHeader && authButtonsHeader) {
        if (user) {
            userMenuHeader.style.display = 'block';
            authButtonsHeader.style.display = 'none';
        } else {
            userMenuHeader.style.display = 'none';
            authButtonsHeader.style.display = 'flex';
        }
    }
    
    // Página upload.html - header actions
    const userMenu = document.getElementById('userMenu');
    const authButtons = document.getElementById('authButtons');
    
    if (userMenu && authButtons) {
        if (user) {
            userMenu.style.display = 'flex';
            authButtons.style.display = 'none';
            const userNameEl = userMenu.querySelector('.user-name');
            if (userNameEl && user.firstName) {
                userNameEl.textContent = user.firstName;
            }
        } else {
            userMenu.style.display = 'none';
            authButtons.style.display = 'flex';
        }
    }
    
    // Página index.html - old IDs (fallback)
    const loginBtn = document.getElementById('loginBtn');
    const userMenuOld = document.getElementById('userMenu');
    
    if (loginBtn && userMenuOld) {
        if (user) {
            userMenuOld.style.display = 'flex';
            loginBtn.style.display = 'none';
        } else {
            userMenuOld.style.display = 'none';
            loginBtn.style.display = 'flex';
        }
    }
}

// Toggle header dropdown
function toggleHeaderDropdown() {
    const dropdown = document.getElementById('headerDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Toggle user dropdown (para upload.html)
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    // Header dropdown
    const userMenuHeader = document.getElementById('userMenuHeader');
    const headerDropdown = document.getElementById('headerDropdown');
    if (userMenuHeader && headerDropdown && !userMenuHeader.contains(e.target)) {
        headerDropdown.classList.remove('active');
    }
    
    // Upload page dropdown
    const userMenu = document.getElementById('userMenu');
    const userDropdown = document.getElementById('userDropdown');
    if (userMenu && userDropdown && !userMenu.contains(e.target)) {
        userDropdown.classList.remove('active');
    }
});

// Initialize
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        updateAuthUI();
    });
}