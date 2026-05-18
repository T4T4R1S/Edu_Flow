// ============================================================
// cart.js — Cart Page
// Outline 2: Array Methods
// Outline 3: DOM Manipulation
// Outline 5: Functions
// Outline 10: Dynamic UI
// ============================================================

const user = getCurrentUser();

// Update navbar
updateNavAuth();
updateCartBadge();

// ----- Outline 5: Load and render cart -----

function loadCart() {
  const cartIds    = getCart();
  const container  = document.getElementById('cart-items');
  const emptyMsg   = document.getElementById('cart-empty');
  const footer     = document.getElementById('cart-footer');
  const summary    = document.getElementById('cart-summary');

  container.innerHTML = '';

  if (cartIds.length === 0) {
    emptyMsg.style.display = 'block';
    footer.style.display   = 'none';
    if (summary) summary.textContent = 'Your cart is empty.';
    return;
  }

  emptyMsg.style.display = 'none';
  footer.style.display   = 'flex';

  // Outline 10: Live summary counter
  if (summary) summary.textContent = `${cartIds.length} course${cartIds.length !== 1 ? 's' : ''} in your cart — all free!`;

  // Outline 2: map() + forEach()
  cartIds.forEach(courseId => {
    const course = findCourseById(courseId);
    if (!course) return;

    const isEnrolled = user && course.enrolledStudents && course.enrolledStudents.includes(user.id);

    // Outline 3: Create element dynamically
    const item = document.createElement('div');
    item.className = 'cart-item';
    item.id        = `cart-item-${courseId}`;

    item.innerHTML = `
      <img src="${course.thumbnail || 'https://via.placeholder.com/120x80'}" 
           alt="${course.title}" class="cart-thumb" 
           onerror="this.src='https://via.placeholder.com/120x80'" />
      <div class="cart-info">
        <h3>${course.title}</h3>
        <p class="course-card-desc">by ${course.instructorName}</p>
        ${isEnrolled ? '<span class="enrolled-badge">✅ Already enrolled</span>' : '<span class="free-badge">Free</span>'}
      </div>
      <div class="cart-actions">
        <button class="btn-ghost small remove-cart-btn" data-course-id="${courseId}">✕ Remove</button>
      </div>
    `;

    container.appendChild(item);
  });
}

// ----- Outline 5: Remove one item from cart -----

function removeFromCart(courseId) {
  removeFromCartStorage(courseId);
  updateCartBadge();
  loadCart(); // Outline 10: Immediately re-render
}

// ----- Outline 5: Clear entire cart -----

function clearCart() {
  clearCartStorage();
  updateCartBadge();
  loadCart();
}

// ----- Outline 5: Enroll in all cart courses -----

function enrollAll() {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const cartIds = getCart();
  if (cartIds.length === 0) return;

  let enrolledCount = 0;

  // Outline 9: Error handling
  try {
    // Outline 2: forEach() to enroll in each course
    cartIds.forEach(courseId => {
      const course = findCourseById(courseId);
      if (!course) return;

      if (!course.enrolledStudents) course.enrolledStudents = [];

      // Only enroll if not already enrolled
      if (!course.enrolledStudents.includes(user.id)) {
        course.enrolledStudents.push(user.id);
        saveCourse(course);
        enrolledCount++;
      }
    });

    clearCartStorage();
    updateCartBadge();

    // Outline 10: Show result message
    const resultEl = document.getElementById('enroll-result');
    resultEl.textContent   = `🎉 Successfully enrolled in ${enrolledCount} course${enrolledCount !== 1 ? 's' : ''}! Go to your dashboard to start learning.`;
    resultEl.style.display = 'block';

    document.getElementById('cart-footer').style.display = 'none';

    // Reload to show empty cart
    setTimeout(() => loadCart(), 3000);

  } catch (err) {
    console.error('Enroll all error:', err);
    alert('Something went wrong. Please try again.');
  }
}

// Start
loadCart();

// Setup Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    if (e.target.id === 'clear-cart-btn') {
      clearCart();
    } else if (e.target.id === 'enroll-all-btn') {
      enrollAll();
    } else if (e.target.classList.contains('remove-cart-btn')) {
      const courseId = e.target.getAttribute('data-course-id');
      removeFromCart(courseId);
    }
  });
});
