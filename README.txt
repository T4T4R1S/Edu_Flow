=====================================
   EduFlow — Online Learning Platform
   Web Client-Side Programming Project
=====================================

APP IDEA:
---------
EduFlow is an online course platform where students can browse, enroll, and
track their progress through courses — and instructors can create and manage
their own courses. Everything runs entirely in the browser using localStorage
and cookies — no backend or server required.

TEAM: [Your Team Number Here]
GITHUB: [Your GitHub Repository Link Here]


FEATURES (8–10 distinct features):
------------------------------------
1.  User Registration & Login — Register as a student or instructor. 
    Credentials stored in localStorage. Login validates email/password.

2.  Role-based Dashboards — Students see enrolled courses + progress.
    Instructors see stats, a course builder, and their published courses.

3.  Course Browsing — Homepage lists all courses (6 pre-seeded + any created
    by instructors) with a live search that filters in real time.

4.  Course Enrollment — Students can enroll in any course from the course
    detail page. Enrollment is saved and persists after refresh.

5.  Lesson Progress Tracking — Enrolled students can mark lessons complete/
    incomplete. A progress bar updates in real time showing % done.

6.  Shopping Cart — Students can add courses to a cart, view the cart page,
    remove items, and enroll in all cart courses at once.

7.  Instructor Course Builder — Instructors can create courses with a title,
    description, thumbnail, and a list of lessons they build before saving.

8.  Course Deletion — Instructors can delete their own courses.

9.  Theme Switcher — Dark/Light mode toggle. The chosen theme is saved in a
    cookie so it persists across sessions and page reloads.

10. Live Stats & Counters — Dashboard shows live counts of enrolled/completed
    courses. Homepage shows a live counter of how many courses are visible.


THE 10 OUTLINES — WHERE TO FIND THEM IN THE CODE:
---------------------------------------------------
Outline 1: Objects & Classes
  → data.js — User, Course, and Lesson ES6 classes
    Example: "class Course { constructor(...) { ... } }"

Outline 2: Arrays & Array Methods
  → data.js, dashboard.js, cart.js — push(), filter(), map(), find(), forEach(), reduce()
    Example: courses.filter(c => c.instructorId === user.id)

Outline 3: DOM Manipulation
  → main.js, course.js, dashboard.js — createElement(), appendChild(), innerHTML, style
    Example: const card = document.createElement('div'); grid.appendChild(card);

Outline 4: Event Listeners
  → main.js — addEventListener('input'), addEventListener('keydown'), addEventListener('click')
    Example: searchInput.addEventListener('input', function() { loadCourses(this.value); });

Outline 5: Functions
  → All JS files — named functions each with one responsibility
    Examples: loadCourses(), enrollCourse(), createCourse(), toggleLesson(), loadProgress()

Outline 6: localStorage
  → data.js — saveToStorage() / loadFromStorage() with JSON.stringify / JSON.parse
    Example: localStorage.setItem(key, JSON.stringify(data));

Outline 7: Cookies
  → auth.js — setCookie(), getCookie(), deleteCookie()
    Used for: saving the theme preference (dark/light) and username
    Example: setCookie('eduflow_theme', theme, 30);

Outline 8: Conditional Logic & Validation
  → auth.js register() / login() — checks all fields, validates email format, password length
  → dashboard.js createCourse() — validates title and description before saving
    Example: if (!email.includes('@')) return showError('Invalid email');

Outline 9: Error Handling
  → auth.js, course.js, dashboard.js, cart.js — try...catch blocks everywhere
    Example: try { saveCourse(...) } catch(err) { console.error(err); alert(...) }

Outline 10: Dynamic UI & User Feedback
  → main.js — live course counter updates as you search
  → course.js — progress bar updates instantly when you mark a lesson complete
  → dashboard.js — stats update after creating/deleting a course
  → cart.js — cart badge animates and updates in real time


FILES:
-------
index.html      — Homepage with course grid and search
login.html      — Login page
register.html   — Registration page
course.html     — Course detail page with lessons and progress
dashboard.html  — Student/Instructor dashboard
cart.html       — Shopping cart page
style.css       — All styles (dark/light theme support)
data.js         — Data layer: Classes, localStorage functions, seed data
auth.js         — Authentication, cookies, theme, session management
main.js         — Homepage logic
course.js       — Course detail page logic
dashboard.js    — Dashboard logic
cart.js         — Cart page logic


HOW TO RUN:
-----------
Just open index.html in any modern browser. No server needed!
(If you see issues with file paths, use VS Code Live Server or similar)
