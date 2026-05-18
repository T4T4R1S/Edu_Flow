// ============================================================
// course.js — Course Detail Page
// Outline 3: DOM Manipulation
// Outline 5: Functions
// Outline 8: Validation
// Outline 9: Error Handling
// Outline 10: Dynamic UI & progress feedback
// ============================================================

// Get course ID from URL: course.html?id=course_1
const params   = new URLSearchParams(window.location.search);
const courseId = params.get('id');
const user     = getCurrentUser();

// Update navbar and cart badge
updateNavAuth();
updateCartBadge();

// ----- Outline 5: Main load function -----

function loadCoursePage() {
  // Outline 9: Error handling
  try {
    if (!courseId) {
      window.location.href = 'index.html';
      return;
    }

    const course = findCourseById(courseId);

    if (!course) {
      document.getElementById('course-loading').textContent = '❌ Course not found.';
      return;
    }

    // Outline 3: DOM Manipulation — fill in course info
    document.title = `${course.title} — EduFlow`;
    document.getElementById('course-title').textContent       = course.title;
    document.getElementById('course-description').textContent = course.description;
    document.getElementById('instructor-name').textContent    = course.instructorName;
    document.getElementById('instructor-avatar').textContent  = course.instructorName[0].toUpperCase();

    const thumb = document.getElementById('course-thumbnail');
    thumb.src = course.thumbnail || 'https://via.placeholder.com/400x200/0f172a/06b6d4?text=Course';

    // Show main content, hide loading
    document.getElementById('course-loading').style.display  = 'none';
    document.getElementById('course-content').style.display  = 'block';
    document.getElementById('enroll-card').style.display     = 'block';

    // Check enrollment
    const isEnrolled  = user && course.enrolledStudents && course.enrolledStudents.includes(user.id);
    const isOwner     = user && course.instructorId === user.id;

    const enrollBtn  = document.getElementById('enroll-btn');
    const cartBtn    = document.getElementById('cart-btn');

    if (isOwner) {
      enrollBtn.textContent   = '📋 Your Course';
      enrollBtn.disabled      = true;
      cartBtn.style.display   = 'none';
    } else if (isEnrolled) {
      enrollBtn.textContent   = '✅ Continue Learning';
      enrollBtn.disabled      = true;
      cartBtn.style.display   = 'none';
      document.getElementById('enroll-msg').textContent = 'You are enrolled!';
      loadProgress();
    }

    renderLessons(course, isEnrolled || isOwner);

  } catch (err) {
    console.error('Course load error:', err);
    document.getElementById('course-loading').textContent = '❌ Failed to load course.';
  }
}

// ----- Outline 5: Render lessons -----

function renderLessons(course, hasAccess) {
  const container = document.getElementById('lessons-list');
  container.innerHTML = '';

  if (!course.lessons || course.lessons.length === 0) {
    container.innerHTML = '<p class="small-label">No lessons available yet.</p>';
    return;
  }

  // Outline 2: forEach() to render lessons
  course.lessons.forEach((lesson, index) => {
    const isDone = user ? isLessonDone(user.id, courseId, lesson.id) : false;

    // Outline 3: Create lesson element dynamically
    const item = document.createElement('div');
    item.className = 'lesson-item' + (isDone ? ' completed' : '');

    item.innerHTML = `
      <div class="lesson-left">
        <div class="lesson-number ${isDone ? 'done' : ''}">${isDone ? '✓' : index + 1}</div>
        <div>
          <p class="lesson-title">${lesson.title}</p>
          ${isDone ? '<p class="lesson-status done-txt">✅ Completed</p>' : ''}
          ${!hasAccess ? '<p class="lesson-status">🔒 Enroll to unlock</p>' : ''}
        </div>
      </div>
      ${hasAccess && user ? `
        <button class="btn-small ${isDone ? 'btn-done' : 'btn-mark'} toggle-lesson-btn"
                data-lesson-id="${lesson.id}" data-is-done="${isDone}">
          ${isDone ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
      ` : ''}
    `;

    container.appendChild(item);
  });
}

// ----- Outline 5: Load and display progress -----

function loadProgress() {
  if (!user) return;

  const progress  = getCourseProgress(user.id, courseId);
  const section   = document.getElementById('progress-section');
  const pctEl     = document.getElementById('progress-percent');
  const barEl     = document.getElementById('progress-bar');
  const labelEl   = document.getElementById('progress-label');

  section.style.display   = 'block';
  pctEl.textContent       = `${progress.percentage}%`;
  barEl.style.width       = `${progress.percentage}%`;
  labelEl.textContent     = `${progress.done} of ${progress.total} lessons completed`;

  // Re-render lessons with updated state
  const course = findCourseById(courseId);
  if (course) renderLessons(course, true);
}

// ----- Toggle lesson complete/incomplete -----

function toggleLesson(lessonId, currentlyDone) {
  // Outline 8: Validate user is logged in
  if (!user) {
    alert('Please log in to track your progress.');
    return;
  }

  markLessonDone(user.id, courseId, lessonId, !currentlyDone);
  loadProgress(); // Outline 10: Immediately update UI
}

// ----- Enroll in course -----

function enrollCourse() {
  // Outline 8: Validate login
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const course = findCourseById(courseId);
    if (!course) return;

    // Add student to enrolled list if not already there
    if (!course.enrolledStudents) course.enrolledStudents = [];
    if (!course.enrolledStudents.includes(user.id)) {
      course.enrolledStudents.push(user.id);
      saveCourse(course);
    }

    // Outline 10: Dynamic UI update — show feedback
    const enrollBtn = document.getElementById('enroll-btn');
    const enrollMsg = document.getElementById('enroll-msg');
    const cartBtn   = document.getElementById('cart-btn');

    enrollBtn.textContent = '✅ Continue Learning';
    enrollBtn.disabled    = true;
    enrollMsg.textContent = '🎉 Successfully enrolled!';
    cartBtn.style.display = 'none';

    loadProgress();

    // Remove from cart if was there
    removeFromCartStorage(courseId);
    updateCartBadge();

  } catch (err) {
    console.error('Enroll error:', err);
    alert('Failed to enroll. Please try again.');
  }
}

// ----- Add to Cart -----

function addToCart() {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const added = addToCartStorage(courseId);
  updateCartBadge();

  const cartBtn = document.getElementById('cart-btn');
  if (added) {
    cartBtn.textContent = '✅ Added to Cart!';
    cartBtn.disabled    = true;
    setTimeout(() => {
      cartBtn.textContent = '🛒 In Cart — View Cart';
      cartBtn.addEventListener('click', () => window.location.href = 'cart.html');
    }, 1500);
  } else {
    cartBtn.textContent = '🛒 Already in Cart';
  }
}

// Start loading the page
loadCoursePage();

// Setup Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    if (e.target.id === 'enroll-btn') {
      enrollCourse();
    } else if (e.target.id === 'cart-btn') {
      // Because addToCart reassigns the click event if already added, we check if it's the original action
      if (e.target.textContent.includes('Add to Cart')) {
        addToCart();
      }
    } else if (e.target.classList.contains('toggle-lesson-btn')) {
      const lessonId = e.target.getAttribute('data-lesson-id');
      const isDone = e.target.getAttribute('data-is-done') === 'true';
      toggleLesson(lessonId, isDone);
    }
  });
});
