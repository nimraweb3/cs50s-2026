# CS50 Week 8: HTML, CSS, JavaScript 

> Reference: https://cs50.harvard.edu/x/weeks/8/

The big idea of this week: **web pages are built from three separate layers working together — HTML for structure, CSS for style, JavaScript for behavior.** This is the first week that moves from "programs that run in a terminal" to "programs that run in a browser," and it's the foundation for everything you've been doing in your freeCodeCamp labs and Lovable projects.

---

## 1. The three layers

| Layer | Job | Example |
|---|---|---|
| HTML | Structure — what's on the page | headings, paragraphs, forms, buttons |
| CSS | Style — how it looks | colors, spacing, layout, fonts |
| JavaScript | Behavior — how it responds | click handlers, validation, dynamic updates |

Think of HTML as the skeleton, CSS as the skin/clothes, and JavaScript as the muscles that make things move.

---

## 2. HTML — structure

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>My Page</title>
    </head>
    <body>
        <h1>Welcome</h1>
        <p>This is a paragraph.</p>
        <a href="https://example.com">A link</a>
    </body>
</html>
```

- `<!DOCTYPE html>` tells the browser "this is HTML5"
- `<head>` holds metadata (title, linked CSS/JS files) — nothing in here is visible on the page itself
- `<body>` holds everything the user actually sees
- Tags nest inside each other, and most need a closing tag (`<p>...</p>`)

### Forms — how you collect input on the web

```html
<form action="/submit" method="post">
    <input type="text" name="username" placeholder="Username">
    <input type="password" name="password" placeholder="Password">
    <button type="submit">Log in</button>
</form>
```

`method="post"` sends the data in the request body (used for anything sensitive or that changes data) vs `method="get"` which appends it to the URL (used for things like search).

---

## 3. CSS — style

Three ways to apply CSS, from least to most reusable:

```html
<!-- Inline -->
<h1 style="color: blue;">Hello</h1>

<!-- Internal, inside <head> -->
<style>
    h1 { color: blue; }
</style>

<!-- External — best practice -->
<link rel="stylesheet" href="styles.css">
```

### Selectors — targeting what to style

```css
h1 { color: blue; }                /* every h1 */
.card { border-radius: 8px; }      /* every element with class="card" */
#header { background: black; }     /* the one element with id="header" */
```

`.class` can be reused on many elements. `#id` should be unique to one element on the page.

### The Box Model — how spacing works

Every HTML element is a box, made of four layers, from inside out:

```
margin (outside space)
  border
    padding (inside space)
      content
```

```css
.card {
    padding: 16px;
    border: 1px solid #ccc;
    margin: 20px;
}
```

This is the exact concept behind the glassmorphism styling you did in your Book Inventory App — layering `padding`, `border-radius`, and `background` (often with transparency + `backdrop-filter: blur()`) to get that frosted-glass look.

### Flexbox and Grid — layout

```css
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

Flexbox arranges elements in a single row or column and handles spacing/alignment automatically — much easier than the old approach of manually positioning everything with floats.

### Responsive design — media queries

```css
@media (max-width: 600px) {
    .container {
        flex-direction: column;
    }
}
```

This is how a page adapts between desktop and mobile — apply different CSS rules depending on screen size.

---

## 4. JavaScript — behavior

Unlike C and Python (which run top to bottom and finish), JavaScript in the browser is mostly **event-driven** — code waits for something to happen (a click, a page load, a keypress) and reacts.

```html
<button id="myButton">Click me</button>

<script>
    document.querySelector('#myButton').addEventListener('click', function () {
        alert('Button clicked!');
    });
</script>
```

### The DOM — Document Object Model

The browser represents your HTML as a tree of objects that JavaScript can read and modify **live**, without reloading the page.

```javascript
document.querySelector('h1').textContent = 'New heading!';
document.querySelector('.card').style.backgroundColor = 'lightblue';
```

This is how a page updates dynamically — like a live P&L number changing color when it crosses from negative to positive, without refreshing the page.

### Variables and functions in JS

```javascript
let score = 0;          // can be reassigned
const name = "Nimra";   // cannot be reassigned

function addPoint() {
    score += 1;
    console.log(score);
}
```

Same logic as C/Python functions — just different keywords (`function` instead of `def`, `let`/`const` instead of declaring a type).

### Form validation with JS

```javascript
document.querySelector('form').addEventListener('submit', function (event) {
    const username = document.querySelector('#username').value;
    if (username === "") {
        event.preventDefault();   // stop the form from submitting
        alert("Username can't be empty");
    }
});
```

---

## 5. How the three layers actually connect

```html
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <button id="toggle">Toggle theme</button>
        <script src="script.js"></script>
    </body>
</html>
```

HTML provides the elements, CSS styles them by class/id, and JS reaches into the DOM using those same selectors to change things live. This exact pattern — HTML skeleton, CSS classes for styling, JS listening for clicks — is what's happening under the hood every time you work on a Lovable project or a freeCodeCamp lab.

---

## Quick Recap Cheatsheet (for revision)

- HTML = structure, CSS = style, JavaScript = behavior — three separate layers working together
- CSS selectors: `element`, `.class` (reusable), `#id` (unique)
- Box model, inside out: content → padding → border → margin
- Flexbox/Grid handle layout without manual positioning
- Media queries make a page responsive across screen sizes
- JavaScript is event-driven — code reacts to clicks, input, page loads
- The DOM is how JS reads/modifies the live page without a reload
- `let`/`const` for variables, `function` for functions — same logic as C/Python, different syntax

---

