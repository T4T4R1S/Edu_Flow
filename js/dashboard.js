// ============================================================
// dashboard.js — Dashboard Page
// Outline 1: Classes (Course, Lesson)
// Outline 2: Array Methods
// Outline 3: DOM Manipulation
// Outline 5: Functions
// Outline 8: Validation
// Outline 9: Error Handling
// Outline 10: Dynamic UI
// ============================================================

const user = getCurrentUser();

// Redirect if not logged in (Outline 8: Validation)
if (!user) {
  window.location.href = 'login.html';
}

// Set greeting
document.getElementById('nav-greeting').textContent = `Hi, ${user.username}!`;

// Lessons being built for a new course
let newLessonsList = [];

// ----- Outline 5: Init function -----

function initDashboard() {
  const title    = document.getElementById('dash-title');
  const subtitle = document.getElementById('dash-subtitle');

  if (user.role === 'instructor') {
    title.textContent    = 'Instructor Dashboard';
    subtitle.textContent = 'Manage your courses and track student progress';
    document.getElementById('instructor-section').style.display = 'block';
    loadInstructorStats();
    loadInstructorCourses();
  } else {
    title.textContent    = 'My Learning';
    subtitle.textContent = 'Track your progress and continue learning';
    document.getElementById('student-section').style.display = 'block';
    loadStudentStats();
    loadStudentCourses();
  }
}

// ===================== STUDENT =====================

// ----- Outline 5: Load student stats -----

function loadStudentStats() {
  const allCourses = getAllCourses();

  // Outline 2: filter() — find enrolled courses
  const enrolled = allCourses.filter(c =>
    c.enrolledStudents && c.enrolledStudents.includes(user.id)
  );

  // Outline 2: filter() — find completed courses (100%)
  const completed = enrolled.filter(c => {
    const p = getCourseProgress(user.id, c.id);
    return p.percentage === 100;
  });

  const inProgress = enrolled.filter(c => {
    const p = getCourseProgress(user.id, c.id);
    return p.percentage > 0 && p.percentage < 100;
  });

  // Outline 10: Update stats in real time (live counter)
  const statsRow = document.getElementById('stats-row');
  statsRow.innerHTML = `
    <div class="stat-card">
      <p class="stat-label">Enrolled</p>
      <p class="stat-number cyan">${enrolled.length}</p>
    </div>
    <div class="stat-card">
      <p class="stat-label">Completed</p>
      <p class="stat-number green">${completed.length}</p>
    </div>
    <div class="stat-card">
      <p class="stat-label">In Progress</p>
      <p class="stat-number purple">${inProgress.length}</p>
    </div>
  `;
}

// ----- Outline 5: Load student courses -----

function loadStudentCourses() {
  const allCourses = getAllCourses();
  const grid       = document.getElementById('student-courses');
  const emptyMsg   = document.getElementById('student-empty');

  // Outline 2: filter()
  const enrolled = allCourses.filter(c =>
    c.enrolledStudents && c.enrolledStudents.includes(user.id)
  );

  if (enrolled.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }

  grid.innerHTML = '';

  // Outline 2: forEach()
  enrolled.forEach(course => {
    const progress  = getCourseProgress(user.id, course.id);
    const thumbnail = course.thumbnail || 'https://via.placeholder.com/400x200/0f172a/06b6d4?text=Course';

    // Outline 3: Create card element
    const card = document.createElement('div');
    card.className = 'course-card';
    card.addEventListener('click', () => {
      window.location.href = `course.html?id=${course.id}`;
    });

    card.innerHTML = `
      <img src="${thumbnail}" alt="${course.title}" onerror="this.src='https://via.placeholder.com/400x200'" />
      <div class="course-card-body">
        <h3 class="course-card-title">${course.title}</h3>
        <p class="course-card-instructor">by ${course.instructorName}</p>
        <div class="progress-mini">
          <div class="progress-mini-header">
            <span>Progress</span>
            <span class="${progress.percentage === 100 ? 'text-green' : 'text-cyan'}">${progress.percentage}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width:${progress.percentage}%"></div>
          </div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ===================== INSTRUCTOR =====================

// ----- Outline 5: Load instructor stats -----

function loadInstructorStats() {
  const allCourses = getAllCourses();

  // Outline 2: filter()
  const myCourses = allCourses.filter(c => c.instructorId === user.id);

  // Outline 2: reduce() — total students across all my courses
  const totalStudents = myCourses.reduce((sum, c) => sum + (c.enrolledStudents ? c.enrolledStudents.length : 0), 0);

  // Outline 2: reduce() — total lessons
  const totalLessons = myCourses.reduce((sum, c) => sum + (c.lessons ? c.lessons.length : 0), 0);

  const statsRow = document.getElementById('stats-row');
  statsRow.innerHTML = `
    <div class="stat-card">
      <p class="stat-label">My Courses</p>
      <p class="stat-number cyan">${myCourses.length}</p>
    </div>
    <div class="stat-card">
      <p class="stat-label">Total Students</p>
      <p class="stat-number green">${totalStudents}</p>
    </div>
    <div class="stat-card">
      <p class="stat-label">Total Lessons</p>
      <p class="stat-number purple">${totalLessons}</p>
    </div>
  `;
}

// ----- Add a lesson to the temp list -----

function addLessonToList() {
  const input       = document.getElementById('new-lesson');
  const lessonTitle = input.value.trim();

  // Outline 8: Validate
  if (!lessonTitle) {
    alert('Please enter a lesson title.');
    return;
  }

  newLessonsList.push(lessonTitle);
  input.value = '';

  renderLessonsPreview();

  // Outline 10: Feedback
  showSuccessMessage(`Lesson "${lessonTitle}" added!`);
}

// ----- Outline 5: Render lessons preview -----

function renderLessonsPreview() {
  const preview = document.getElementById('lessons-preview');
  preview.innerHTML = '';

  if (newLessonsList.length === 0) return;

  // Outline 2: forEach()
  newLessonsList.forEach((title, i) => {
    const item = document.createElement('div');
    item.className = 'lesson-preview-item';
    item.innerHTML = `
      <span>${i + 1}. ${title}</span>
      <button class="remove-btn" data-index="${i}">✕</button>
    `;
    preview.appendChild(item);
  });
}

function removeLesson(index) {
  // Outline 2: splice to remove
  newLessonsList.splice(index, 1);
  renderLessonsPreview();
}

// ----- Outline 5: Create a new course -----

function createCourse() {
  const title       = document.getElementById('new-title').value.trim();
  const description = document.getElementById('new-description').value.trim();
  const thumbnail   = document.getElementById('new-thumbnail').value.trim();

  const errorEl   = document.getElementById('create-error');
  const successEl = document.getElementById('create-success');
  errorEl.style.display   = 'none';
  successEl.style.display = 'none';

  // Outline 8: Validate required fields
  if (!title) {
    errorEl.textContent   = '❌ Course title is required.';
    errorEl.style.display = 'block';
    return;
  }
  if (!description) {
    errorEl.textContent   = '❌ Course description is required.';
    errorEl.style.display = 'block';
    return;
  }

  // Outline 9: try...catch
  try {
    const courseId = 'course_' + Date.now();

    // Outline 1: Use Course class
    const newCourse = new Course(
      courseId,
      title,
      description,
      thumbnail || 'https://via.placeholder.com/400x200/0f172a/06b6d4?text=Course',
      user.id,
      user.username
    );

    // Outline 2: map() to convert lesson titles to Lesson objects
    newCourse.lessons = newLessonsList.map((lessonTitle, i) =>
      new Lesson(`lesson_${Date.now()}_${i}`, lessonTitle, courseId)
    );

    saveCourse(newCourse);

    // Outline 10: Success feedback
    successEl.textContent   = `🎉 Course "${title}" created successfully!`;
    successEl.style.display = 'block';

    // Clear form
    document.getElementById('new-title').value       = '';
    document.getElementById('new-description').value = '';
    document.getElementById('new-thumbnail').value   = '';
    newLessonsList = [];
    renderLessonsPreview();

    // Reload stats and courses
    loadInstructorStats();
    loadInstructorCourses();

  } catch (err) {
    console.error('Create course error:', err);
    errorEl.textContent   = '❌ Something went wrong. Please try again.';
    errorEl.style.display = 'block';
  }
}

// ----- Outline 5: Load instructor's courses -----

function loadInstructorCourses() {
  const allCourses = getAllCourses();
  const container  = document.getElementById('instructor-courses');
  const emptyMsg   = document.getElementById('instructor-empty');

  container.innerHTML = '';

  // Outline 2: filter()
  const myCourses = allCourses.filter(c => c.instructorId === user.id);

  if (myCourses.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }

  emptyMsg.style.display = 'none';

  // Outline 2: forEach()
  myCourses.forEach(course => {
    const students  = course.enrolledStudents ? course.enrolledStudents.length : 0;
    const lessons   = course.lessons ? course.lessons.length : 0;
    const thumbnail = course.thumbnail || 'https://via.placeholder.com/400x200/0f172a/06b6d4?text=Course';

    // Outline 3: Create element dynamically
    const card = document.createElement('div');
    card.className = 'instructor-course-card';

    card.innerHTML = `
      <img src="${thumbnail}" alt="${course.title}" onerror="this.src='https://via.placeholder.com/400x200'" class="inst-thumb" />
      <div class="inst-info">
        <div class="inst-header">
          <div>
            <h3>${course.title}</h3>
            <p class="course-card-desc">${course.description}</p>
          </div>
          <div class="inst-actions">
            <a href="course.html?id=${course.id}" class="btn-ghost small">View</a>
            <button class="btn-small btn-danger delete-course-btn" data-course-id="${course.id}">Delete</button>
          </div>
        </div>
        <div class="inst-meta">
          <span>👥 ${students} students</span>
          <span>📖 ${lessons} lessons</span>
          <span>📅 ${new Date(course.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// ----- Delete a course -----

function deleteCourse(courseId) {
  if (!confirm('Are you sure you want to delete this course? This cannot be undone.')) return;

  // Outline 9: try...catch
  try {
    // Outline 2: filter() to remove the course
    const allCourses = getAllCourses().filter(c => c.id !== courseId);
    saveAllCourses(allCourses);

    // Outline 10: Live UI update
    loadInstructorStats();
    loadInstructorCourses();
    showSuccessMessage('Course deleted successfully.');
  } catch (err) {
    console.error('Delete error:', err);
    alert('Failed to delete course.');
  }
}

// ----- Helper: show a temporary success message -----
function showSuccessMessage(msg) {
  const successEl = document.getElementById('create-success');
  if (!successEl) return;
  successEl.textContent   = msg;
  successEl.style.display = 'block';
  setTimeout(() => { successEl.style.display = 'none'; }, 2500);
}

// Start
initDashboard();

// Setup Event Delegation
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    if (e.target.id === 'add-lesson-btn') {
      addLessonToList();
    } else if (e.target.id === 'create-btn') {
      createCourse();
    } else if (e.target.classList.contains('remove-btn')) {
      const index = parseInt(e.target.getAttribute('data-index'), 10);
      removeLesson(index);
    } else if (e.target.classList.contains('delete-course-btn')) {
      const courseId = e.target.getAttribute('data-course-id');
      deleteCourse(courseId);
    }
  });
});
