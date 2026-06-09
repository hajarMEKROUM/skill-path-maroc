-- HTML & CSS Fundamentals — sample course data
-- Run after migrations. Requires at least one user (instructor).

-- Clean existing course data (idempotent)
DELETE e FROM exercises e
INNER JOIN lessons l ON e.lesson_id = l.id
INNER JOIN courses c ON l.course_id = c.id
WHERE c.slug = 'html-css-fundamentals';

DELETE q FROM quizzes q
INNER JOIN lessons l ON q.lesson_id = l.id
INNER JOIN courses c ON l.course_id = c.id
WHERE c.slug = 'html-css-fundamentals';

DELETE l FROM lessons l
INNER JOIN courses c ON l.course_id = c.id
WHERE c.slug = 'html-css-fundamentals';

DELETE m FROM course_modules m
INNER JOIN courses c ON m.course_id = c.id
WHERE c.slug = 'html-css-fundamentals';

DELETE FROM courses WHERE slug = 'html-css-fundamentals';

-- Course
INSERT INTO courses (instructor_id, title, slug, description, price, level, status, thumbnail, created_at, updated_at)
SELECT u.id,
       'HTML & CSS Fundamentals',
       'html-css-fundamentals',
       'Master the foundations of web development with structured HTML and CSS lessons, hands-on exercises, and interactive quizzes.',
       0,
       'beginner',
       'published',
       NULL,
       NOW(),
       NOW()
FROM users u
WHERE u.role IN ('admin', 'user')
ORDER BY u.role = 'admin' DESC
LIMIT 1;

SET @course_id = (SELECT id FROM courses WHERE slug = 'html-css-fundamentals' LIMIT 1);

-- Module
INSERT INTO course_modules (course_id, title, description, sort_order, created_at, updated_at)
VALUES (@course_id, 'Core Lessons', 'HTML and CSS fundamentals', 1, NOW(), NOW());

SET @module_id = LAST_INSERT_ID();

-- Lesson 1: Introduction to HTML
INSERT INTO lessons (course_id, module_id, title, slug, content, content_type, video_url, duration_seconds, sort_order, is_preview, created_at, updated_at)
VALUES (
  @course_id,
  @module_id,
  'Introduction to HTML',
  'introduction-to-html',
  '# Introduction to HTML\n\n## Key Concepts\n\n- **HTML** (HyperText Markup Language) structures web content\n- Tags come in pairs: opening `<tag>` and closing `</tag>`\n- Browsers interpret HTML and render pages visually\n- Semantic tags (`<header>`, `<main>`, `<footer>`) improve accessibility\n\n## Explanation\n\nEvery website you visit is built with HTML. It defines headings, paragraphs, links, images, and forms. HTML is not a programming language — it is a markup language that describes content.\n\nWhen you write HTML, you nest elements inside each other to create a tree structure the browser can display.\n\n## Code Example\n\n```html\n<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <title>My First Page</title>\n  </head>\n  <body>\n    <h1>Welcome to HTML</h1>\n    <p>This is my first paragraph.</p>\n    <a href=\"https://example.com\">Visit Example</a>\n  </body>\n</html>\n```\n\n## Exercise\n\nCreate a simple HTML page with a heading and a paragraph about yourself.\n\n## Expected Result\n\nA browser tab showing a heading (large text) and a paragraph below it, with correct tag nesting.',
  'video',
  'https://www.youtube.com/embed/ok-plXXHlWw',
  720,
  1,
  1,
  NOW(),
  NOW()
);

SET @lesson_1 = LAST_INSERT_ID();

INSERT INTO exercises (lesson_id, title, content, sort_order, created_at, updated_at)
VALUES (
  @lesson_1,
  'Build your first HTML page',
  'Create an HTML file with `<!DOCTYPE html>`, a `<title>` in `<head>`, an `<h1>` saying **Hello Morocco**, and a `<p>` with one sentence about why you want to learn web development.',
  1,
  NOW(),
  NOW()
);

INSERT INTO quizzes (course_id, lesson_id, title, passing_score, questions, created_at, updated_at)
VALUES (
  @course_id,
  @lesson_1,
  'Introduction to HTML Quiz',
  70,
  JSON_ARRAY(
    JSON_OBJECT(
      'question', 'What does HTML stand for?',
      'options', JSON_ARRAY('HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink Text Management Language'),
      'answer', 'HyperText Markup Language'
    ),
    JSON_OBJECT(
      'question', 'Which tag defines the largest heading?',
      'options', JSON_ARRAY('<h6>', '<heading>', '<h1>', '<head>'),
      'answer', '<h1>'
    ),
    JSON_OBJECT(
      'question', 'Where does the visible page content go?',
      'options', JSON_ARRAY('<head>', '<meta>', '<body>', '<link>'),
      'answer', '<body>'
    )
  ),
  NOW(),
  NOW()
);

-- Lesson 2: HTML Structure
INSERT INTO lessons (course_id, module_id, title, slug, content, content_type, video_url, duration_seconds, sort_order, is_preview, created_at, updated_at)
VALUES (
  @course_id,
  @module_id,
  'HTML Structure',
  'html-structure',
  '# HTML Structure\n\n## Key Concepts\n\n- A valid HTML document has a standard skeleton\n- `<!DOCTYPE html>` tells the browser to use HTML5\n- `<head>` holds metadata; `<body>` holds visible content\n- Semantic layout tags organize content meaningfully\n\n## Explanation\n\nA well-structured page separates metadata from content. The `<head>` includes the title, charset, and linked resources. The `<body>` contains everything users see.\n\nSemantic elements like `<header>`, `<nav>`, `<main>`, `<section>`, and `<footer>` help screen readers and search engines understand your page.\n\n## Code Example\n\n```html\n<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Portfolio</title>\n  </head>\n  <body>\n    <header>\n      <h1>My Portfolio</h1>\n      <nav><a href=\"#about\">About</a></nav>\n    </header>\n    <main>\n      <section id=\"about\">\n        <h2>About Me</h2>\n        <p>I am learning web development.</p>\n      </section>\n    </main>\n    <footer><p>&copy; 2026</p></footer>\n  </body>\n</html>\n```\n\n## Exercise\n\nBuild a portfolio page using `<header>`, `<main>`, `<section>`, and `<footer>`.\n\n## Expected Result\n\nA structured page with a header, one main section with a subheading, and a footer — all using semantic HTML tags.',
  'video',
  'https://www.youtube.com/embed/qz0aGYrrlhU',
  600,
  2,
  0,
  NOW(),
  NOW()
);

SET @lesson_2 = LAST_INSERT_ID();

INSERT INTO exercises (lesson_id, title, content, sort_order, created_at, updated_at)
VALUES (
  @lesson_2,
  'Create a semantic page layout',
  'Build an HTML page with `<header>` (site title), `<nav>` (2 links), `<main>` with one `<section>`, and `<footer>` (copyright text). Use proper nesting.',
  1,
  NOW(),
  NOW()
);

INSERT INTO quizzes (course_id, lesson_id, title, passing_score, questions, created_at, updated_at)
VALUES (
  @course_id,
  @lesson_2,
  'HTML Structure Quiz',
  70,
  JSON_ARRAY(
    JSON_OBJECT(
      'question', 'Which element wraps all visible content?',
      'options', JSON_ARRAY('<head>', '<body>', '<html>', '<meta>'),
      'answer', '<body>'
    ),
    JSON_OBJECT(
      'question', 'Which tag is used for the main navigation links?',
      'options', JSON_ARRAY('<nav>', '<menu>', '<links>', '<header>'),
      'answer', '<nav>'
    ),
    JSON_OBJECT(
      'question', 'What does <!DOCTYPE html> declare?',
      'options', JSON_ARRAY('CSS version', 'JavaScript mode', 'HTML5 document type', 'Character encoding'),
      'answer', 'HTML5 document type'
    )
  ),
  NOW(),
  NOW()
);

-- Lesson 3: Basic CSS
INSERT INTO lessons (course_id, module_id, title, slug, content, content_type, video_url, duration_seconds, sort_order, is_preview, created_at, updated_at)
VALUES (
  @course_id,
  @module_id,
  'Basic CSS',
  'basic-css',
  '# Basic CSS\n\n## Key Concepts\n\n- **CSS** (Cascading Style Sheets) controls presentation\n- Selectors target HTML elements to apply styles\n- Properties like `color`, `font-size`, and `margin` change appearance\n- External CSS files keep style separate from structure\n\n## Explanation\n\nCSS works by matching selectors to HTML elements. You can style all headings, a specific class, or a unique ID. Rules cascade — more specific selectors override general ones.\n\nLink an external stylesheet with `<link rel=\"stylesheet\" href=\"styles.css\">` in the `<head>`.\n\n## Code Example\n\n```html\n<head>\n  <link rel=\"stylesheet\" href=\"styles.css\" />\n</head>\n<body>\n  <h1 class=\"title\">Hello CSS</h1>\n</body>\n```\n\n```css\nbody {\n  font-family: Arial, sans-serif;\n  background-color: #f8fafc;\n  margin: 0;\n}\n\n.title {\n  color: #2563eb;\n  font-size: 2rem;\n  text-align: center;\n}\n```\n\n## Exercise\n\nStyle a page: blue headings, centered text, light gray background.\n\n## Expected Result\n\nA page with a light gray background, centered blue heading, and readable body text styled via CSS.',
  'video',
  'https://www.youtube.com/embed/1Rs2ND1ryYc',
  660,
  3,
  0,
  NOW(),
  NOW()
);

SET @lesson_3 = LAST_INSERT_ID();

INSERT INTO exercises (lesson_id, title, content, sort_order, created_at, updated_at)
VALUES (
  @lesson_3,
  'Style a page with CSS',
  'Write a `styles.css` file that sets `body` background to `#f8fafc`, centers text, and makes all `h1` elements blue (`#2563eb`) with `font-size: 2rem`. Link it to an HTML page.',
  1,
  NOW(),
  NOW()
);

INSERT INTO quizzes (course_id, lesson_id, title, passing_score, questions, created_at, updated_at)
VALUES (
  @course_id,
  @lesson_3,
  'Basic CSS Quiz',
  70,
  JSON_ARRAY(
    JSON_OBJECT(
      'question', 'Which property changes text color?',
      'options', JSON_ARRAY('font-weight', 'color', 'background', 'border'),
      'answer', 'color'
    ),
    JSON_OBJECT(
      'question', 'How do you select an element with class \"card\"?',
      'options', JSON_ARRAY('#card', '.card', 'card', '*card'),
      'answer', '.card'
    ),
    JSON_OBJECT(
      'question', 'Where should you link an external CSS file?',
      'options', JSON_ARRAY('Inside <body>', 'Inside <head>', 'After </html>', 'Inside <footer>'),
      'answer', 'Inside <head>'
    )
  ),
  NOW(),
  NOW()
);
