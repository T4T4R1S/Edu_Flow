// ============================================================
// data.js — App Data Layer
// Outline 1: Objects & Classes
// Outline 2: Arrays & Array Methods
// Outline 6: localStorage
// ============================================================

// ----- Outline 1: ES6 Classes to model data -----

class User {
  constructor(id, username, email, password, role) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;      // In a real app, never store plain passwords!
    this.role = role;              // 'student' or 'instructor'
  }
}

class Course {
  constructor(id, title, description, thumbnail, instructorId, instructorName) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.thumbnail = thumbnail;
    this.instructorId = instructorId;
    this.instructorName = instructorName;
    this.lessons = [];             // Array of lesson objects
    this.enrolledStudents = [];    // Array of user IDs
    this.createdAt = new Date().toISOString();
  }
}

class Lesson {
  constructor(id, title, courseId) {
    this.id = id;
    this.title = title;
    this.courseId = courseId;
    this.locked = false;
  }
}

// ----- Outline 6: localStorage helper functions -----

// Save any data to localStorage
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Load any data from localStorage
function loadFromStorage(key) {
  // Outline 9: Error Handling with try...catch
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Failed to load from storage:', err);
    return null;
  }
}

// ----- Users storage -----

function getAllUsers() {
  return loadFromStorage('eduflow_users') || [];
}

function saveAllUsers(users) {
  saveToStorage('eduflow_users', users);
}

function findUserByEmail(email) {
  const users = getAllUsers();
  // Outline 2: Array method — find()
  return users.find(u => u.email === email) || null;
}

function findUserById(id) {
  const users = getAllUsers();
  return users.find(u => u.id === id) || null;
}

function addUser(user) {
  const users = getAllUsers();
  users.push(user);   // Outline 2: push()
  saveAllUsers(users);
}

// ----- Courses storage -----

function getAllCourses() {
  return loadFromStorage('eduflow_courses') || [];
}

function saveAllCourses(courses) {
  saveToStorage('eduflow_courses', courses);
}

function findCourseById(id) {
  const courses = getAllCourses();
  return courses.find(c => c.id === id) || null;
}

function saveCourse(course) {
  const courses = getAllCourses();
  const index = courses.findIndex(c => c.id === course.id);
  if (index === -1) {
    courses.push(course);
  } else {
    courses[index] = course;  // Update existing
  }
  saveAllCourses(courses);
}

// ----- Progress storage -----
// Progress is stored as: { userId_courseId_lessonId: true/false }

function getProgressKey(userId, courseId, lessonId) {
  return `progress_${userId}_${courseId}_${lessonId}`;
}

function markLessonDone(userId, courseId, lessonId, done) {
  const key = getProgressKey(userId, courseId, lessonId);
  saveToStorage(key, done);
}

function isLessonDone(userId, courseId, lessonId) {
  const key = getProgressKey(userId, courseId, lessonId);
  return loadFromStorage(key) === true;
}

function getCourseProgress(userId, courseId) {
  const course = findCourseById(courseId);
  if (!course || course.lessons.length === 0) return { percentage: 0, done: 0, total: 0 };

  // Outline 2: filter() to count completed lessons
  const completed = course.lessons.filter(lesson => isLessonDone(userId, courseId, lesson.id));
  const percentage = Math.round((completed.length / course.lessons.length) * 100);

  return {
    percentage,
    done: completed.length,
    total: course.lessons.length
  };
}

// ----- Cart storage -----

function getCart() {
  return loadFromStorage('eduflow_cart') || [];
}

function saveCart(cart) {
  saveToStorage('eduflow_cart', cart);
}

function addToCartStorage(courseId) {
  const cart = getCart();
  // Outline 2: find() to avoid duplicates
  if (!cart.find(id => id === courseId)) {
    cart.push(courseId);
    saveCart(cart);
    return true;
  }
  return false; // Already in cart
}

function removeFromCartStorage(courseId) {
  // Outline 2: filter() to remove item
  const cart = getCart().filter(id => id !== courseId);
  saveCart(cart);
}

function clearCartStorage() {
  saveCart([]);
}

// ----- Seed default courses if empty -----

function seedDefaultCourses() {
  const existing = getAllCourses();
  if (existing.length > 0) return; // Already seeded

  const defaultCourses = [
    {
      id: 'course_1',
      title: 'Complete JavaScript Bootcamp',
      description: 'Learn JavaScript from zero to hero. Covers variables, functions, DOM, APIs and more.',
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=200&fit=crop',
      instructorId: 'system',
      instructorName: 'EduFlow Team',
      lessons: [
        { id: 'l1', title: 'Introduction & Setup', courseId: 'course_1', locked: false },
        { id: 'l2', title: 'Variables & Data Types', courseId: 'course_1', locked: false },
        { id: 'l3', title: 'Functions & Scope', courseId: 'course_1', locked: false },
        { id: 'l4', title: 'DOM Manipulation', courseId: 'course_1', locked: false },
        { id: 'l5', title: 'Events & Callbacks', courseId: 'course_1', locked: false },
      ],
      enrolledStudents: [],
      createdAt: '2025-01-01T00:00:00.000Z'
    },
    {
      id: 'course_2',
      title: 'HTML & CSS Fundamentals',
      description: 'Build beautiful websites from scratch. Learn semantic HTML and modern CSS techniques.',
      thumbnail: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400&h=200&fit=crop',
      instructorId: 'system',
      instructorName: 'EduFlow Team',
      lessons: [
        { id: 'l6', title: 'HTML Basics', courseId: 'course_2', locked: false },
        { id: 'l7', title: 'CSS Selectors', courseId: 'course_2', locked: false },
        { id: 'l8', title: 'Flexbox Layout', courseId: 'course_2', locked: false },
        { id: 'l9', title: 'Responsive Design', courseId: 'course_2', locked: false },
      ],
      enrolledStudents: [],
      createdAt: '2025-01-02T00:00:00.000Z'
    },
    {
      id: 'course_3',
      title: 'Python for Beginners',
      description: 'Start your programming journey with Python. Simple, readable, and powerful.',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=200&fit=crop',
      instructorId: 'system',
      instructorName: 'EduFlow Team',
      lessons: [
        { id: 'l10', title: 'Python Setup', courseId: 'course_3', locked: false },
        { id: 'l11', title: 'Variables & Types', courseId: 'course_3', locked: false },
        { id: 'l12', title: 'Loops & Conditionals', courseId: 'course_3', locked: false },
        { id: 'l13', title: 'Functions', courseId: 'course_3', locked: false },
        { id: 'l14', title: 'Lists & Dictionaries', courseId: 'course_3', locked: false },
        { id: 'l15', title: 'File Handling', courseId: 'course_3', locked: false },
      ],
      enrolledStudents: [],
      createdAt: '2025-01-03T00:00:00.000Z'
    },
    {
      id: 'course_4',
      title: 'React.js Crash Course',
      description: 'Build modern user interfaces with React. Components, hooks, and state management.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop',
      instructorId: 'system',
      instructorName: 'EduFlow Team',
      lessons: [
        { id: 'l16', title: 'What is React?', courseId: 'course_4', locked: false },
        { id: 'l17', title: 'Components & Props', courseId: 'course_4', locked: false },
        { id: 'l18', title: 'State & useState', courseId: 'course_4', locked: false },
        { id: 'l19', title: 'useEffect Hook', courseId: 'course_4', locked: false },
      ],
      enrolledStudents: [],
      createdAt: '2025-01-04T00:00:00.000Z'
    },
    {
      id: 'course_5',
      title: 'Git & GitHub for Beginners',
      description: 'Master version control with Git. Learn branching, merging, pull requests, and collaboration.',
      thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=200&fit=crop',
      instructorId: 'system',
      instructorName: 'EduFlow Team',
      lessons: [
        { id: 'l20', title: 'What is Version Control?', courseId: 'course_5', locked: false },
        { id: 'l21', title: 'Git Basics', courseId: 'course_5', locked: false },
        { id: 'l22', title: 'Branching & Merging', courseId: 'course_5', locked: false },
      ],
      enrolledStudents: [],
      createdAt: '2025-01-05T00:00:00.000Z'
    },
    {
      id: 'course_6',
      title: 'UI/UX Design Principles',
      description: 'Learn the fundamentals of good design. Typography, color theory, and user experience.',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop',
      instructorId: 'system',
      instructorName: 'EduFlow Team',
      lessons: [
        { id: 'l23', title: 'Design Thinking', courseId: 'course_6', locked: false },
        { id: 'l24', title: 'Color Theory', courseId: 'course_6', locked: false },
        { id: 'l25', title: 'Typography Basics', courseId: 'course_6', locked: false },
        { id: 'l26', title: 'Wireframing', courseId: 'course_6', locked: false },
      ],
      enrolledStudents: [],
      createdAt: '2025-01-06T00:00:00.000Z'
    }
  ];

  saveAllCourses(defaultCourses);
}

// Run seed on every page load
seedDefaultCourses();
