// ============================================================
// main.js — Homepage Logic
// Outline 3: DOM Manipulation
// Outline 4: Event Listeners
// Outline 5: Functions
// Outline 10: Dynamic UI
// ============================================================

// Update navbar when page loads
updateNavAuth();
updateCartBadge();

// ----- Outline 3: DOM Manipulation — render course cards -----

function renderCourseCard(course) {
  const students = course.enrolledStudents ? course.enrolledStudents.length : 0;
  const thumbnail = course.thumbnail || 'https://via.placeholder.com/400x200/0f172a/06b6d4?text=Course';

  // Create card element dynamically (DOM manipulation)
  const card = document.createElement('div');
  card.className = 'course-card';

  // Outline 4: addEventListener for click
  card.addEventListener('click', () => {
    window.location.href = `course.html?id=${course.id}`;
  });

  card.innerHTML = `
    <img src="${thumbnail}" alt="${course.title}" onerror="this.src='https://via.placeholder.com/400x200/0f172a/06b6d4?text=Course'" />
    <div class="course-card-body">
      <h3 class="course-card-title">${course.title}</h3>
      <p class="course-card-instructor">by ${course.instructorName || 'Unknown'}</p>
      <p class="course-card-desc">${course.description}</p>
      <div class="course-card-footer">
        <span class="students-badge">👥 ${students} students</span>
        <span class="free-badge">Free</span>
      </div>
    </div>
  `;

  return card;
}

// ----- Outline 5: loadCourses function -----

function loadCourses(query = '') {
  const grid     = document.getElementById('courses-grid');
  const emptyMsg = document.getElementById('empty-msg');
  const counter  = document.getElementById('course-counter');

  if (!grid) return;

  let courses = getAllCourses();

  // Outline 2: filter() to search courses
  if (query) {
    courses = courses.filter(course =>
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Outline 3: Clear and rebuild the DOM
  grid.innerHTML = '';

  if (courses.length === 0) {
    emptyMsg.style.display = 'block';
    grid.style.display = 'none';
    if (counter) counter.textContent = 'No courses found.';
    return;
  }

  emptyMsg.style.display = 'none';
  grid.style.display = 'grid';

  // Outline 10: Live counter showing how many courses are shown
  if (counter) counter.textContent = `Showing ${courses.length} course${courses.length !== 1 ? 's' : ''}`;

  // Outline 2: forEach() to render each course
  courses.forEach(course => {
    const card = renderCourseCard(course);
    grid.appendChild(card);
  });
}

// ----- Outline 4: Event listener for search input -----
const searchInput = document.getElementById('search-input');
if (searchInput) {
  searchInput.addEventListener('input', function () {
    loadCourses(this.value);
  });

  // Also listen for keydown Enter
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') loadCourses(this.value);
  });
}

// Initial load
loadCourses();
