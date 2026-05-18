// ============================================================
// auth.js — Authentication & Cookie Management
// Outline 5: Functions
// Outline 7: Cookies
// Outline 8: Validation
// Outline 9: Error Handling
// ============================================================

// ----- Outline 7: Cookie helper functions -----

// Set a cookie with a name, value, and how many days until it expires
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

// Get a cookie value by name
function getCookie(name) {
  const cookies = document.cookie.split(';');
  // Outline 2: forEach() to search cookies
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

// Delete a cookie
function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

// ----- Session Management (Outline 6: localStorage) -----

// Save the logged-in user to localStorage
function saveCurrentUser(user) {
  saveToStorage('eduflow_current_user', user);
  // Outline 7: Save username preference in a cookie
  setCookie('eduflow_username', user.username, 7);
}

// Get the currently logged-in user
function getCurrentUser() {
  return loadFromStorage('eduflow_current_user');
}

// ----- Outline 5: Auth functions -----

// Register a new user
function register() {
  const username = document.getElementById('username').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const role     = document.getElementById('btn-instructor').classList.contains('active')
                   ? 'instructor'
                   : 'student';

  // Outline 8: Validate inputs
  if (!username || !email || !password) {
    return showError('Please fill in all fields.');
  }
  if (username.length < 3) {
    return showError('Username must be at least 3 characters.');
  }
  if (!email.includes('@') || !email.includes('.')) {
    return showError('Please enter a valid email address.');
  }
  if (password.length < 6) {
    return showError('Password must be at least 6 characters.');
  }

  // Outline 9: try...catch for error handling
  try {
    // Check if email already exists
    const existing = findUserByEmail(email);
    if (existing) {
      return showError('An account with this email already exists.');
    }

    // Outline 1: Create a new User object
    const newUser = new User(
      'user_' + Date.now(),
      username,
      email,
      password,
      role
    );

    addUser(newUser);
    saveCurrentUser(newUser);

    showSuccess('Account created! Redirecting...');
    setTimeout(() => {
      window.location.href = role === 'instructor' ? 'dashboard.html' : 'index.html';
    }, 1000);

  } catch (err) {
    console.error('Register error:', err);
    showError('Something went wrong. Please try again.');
  }
}

// Login existing user
function login() {
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Outline 8: Validation
  if (!email || !password) {
    return showError('Please fill in both fields.');
  }

  try {
    const user = findUserByEmail(email);

    if (!user || user.password !== password) {
      return showError('Incorrect email or password.');
    }

    saveCurrentUser(user);
    showSuccess('Welcome back! Redirecting...');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);

  } catch (err) {
    console.error('Login error:', err);
    showError('Something went wrong. Please try again.');
  }
}

// Logout
function logout() {
  localStorage.removeItem('eduflow_current_user');
  deleteCookie('eduflow_username');
  window.location.href = 'index.html';
}

// Role selector for register page
let selectedRole = 'student';

function setRole(role) {
  selectedRole = role;
  const studentBtn    = document.getElementById('btn-student');
  const instructorBtn = document.getElementById('btn-instructor');
  if (!studentBtn || !instructorBtn) return;

  if (role === 'instructor') {
    studentBtn.classList.remove('active');
    instructorBtn.classList.add('active');
  } else {
    studentBtn.classList.add('active');
    instructorBtn.classList.remove('active');
  }
}

// ----- Outline 5: UI helper functions -----

function showError(msg) {
  const el = document.getElementById('error-msg');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  // Hide success
  const s = document.getElementById('success-msg');
  if (s) s.style.display = 'none';
}

function hideError() {
  const el = document.getElementById('error-msg');
  if (el) el.style.display = 'none';
}

function showSuccess(msg) {
  const el = document.getElementById('success-msg');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  const e = document.getElementById('error-msg');
  if (e) e.style.display = 'none';
}

// ----- Update the navbar based on login state -----

function updateNavAuth() {
  const nav  = document.getElementById('nav-auth');
  const user = getCurrentUser();
  if (!nav) return;

  if (user) {
    nav.innerHTML = `
      <span class="nav-greeting">Hi, <strong>${user.username}</strong></span>
      <a href="dashboard.html" class="btn-ghost">Dashboard</a>
      <button id="logout-btn" class="btn-ghost">Logout</button>
    `;
  } else {
    nav.innerHTML = `
      <a href="login.html" class="btn-ghost">Login</a>
      <a href="register.html" class="btn-primary">Get Started</a>
    `;
  }
}

// ----- Cart badge helper -----

function updateCartBadge() {
  const cart      = getCart();
  const countEl   = document.getElementById('cart-count');
  const iconEl    = document.getElementById('cart-icon');
  if (countEl) countEl.textContent = cart.length;
  if (iconEl)  iconEl.style.display = cart.length > 0 ? 'flex' : 'none';
}

function goToCart() {
  window.location.href = 'cart.html';
}

// ----- Theme (Outline 7: Cookies) -----

function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  setCookie('eduflow_theme', theme, 30);  // Save for 30 days

  // Update active button style
  const darkBtn  = document.getElementById('btn-dark');
  const lightBtn = document.getElementById('btn-light');
  if (darkBtn)  darkBtn.classList.toggle('active', theme === 'dark');
  if (lightBtn) lightBtn.classList.toggle('active', theme === 'light');
}

function applyThemeFromCookie() {
  const savedTheme = getCookie('eduflow_theme') || 'dark';
  setTheme(savedTheme);
}

// Apply theme on every page load
applyThemeFromCookie();

// Setup Global Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    const target = e.target;
    if (target.id === 'logout-btn') {
      logout();
    } else if (target.id === 'btn-dark') {
      setTheme('dark');
    } else if (target.id === 'btn-light') {
      setTheme('light');
    } else if (target.id === 'cart-icon' || target.closest('#cart-icon')) {
      goToCart();
    } else if (target.id === 'btn-student') {
      setRole('student');
    } else if (target.id === 'btn-instructor') {
      setRole('instructor');
    } else if (target.id === 'register-btn') {
      register();
    } else if (target.id === 'login-btn') {
      login();
    }
  });
});
