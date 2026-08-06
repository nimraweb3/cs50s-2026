# CS50 Week 9: Flask

> Reference: https://cs50.harvard.edu/x/weeks/9/

The big idea of this week: **Week 8 was the frontend (what runs in the browser). This week is the backend — a Python framework (Flask) that runs on a server, decides what to send back when someone visits a URL, and connects your HTML/CSS/JS to a real database.** This is the piece that turns a static page into an actual web application.

---

## 1. Client-server model — the big picture

```
Browser (client)  --request-->  Server (Flask app)
Browser (client)  <--response--  Server (Flask app)
```

Every time you visit a URL, your browser sends a **request**, and the server sends back a **response** (usually an HTML page, but could be JSON, a redirect, etc). Flask's whole job is deciding what response to send for each possible request.

---

## 2. A minimal Flask app

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello, world"
```

- `@app.route("/")` — a **decorator** that says "when someone visits this URL, run the function below"
- The function's return value becomes what the browser displays

Run it with:
```
flask run
```

---

## 3. Routes — mapping URLs to functions

```python
@app.route("/")
def index():
    return "Home page"

@app.route("/about")
def about():
    return "About page"

@app.route("/trade/<symbol>")
def trade(symbol):
    return f"Showing trades for {symbol}"
```

The last one is a **dynamic route** — whatever comes after `/trade/` gets passed into the function as `symbol`. Visit `/trade/XAUUSD` and `symbol` becomes `"XAUUSD"`.

---

## 4. Templates — generating HTML from Python

Instead of returning raw strings, Flask uses **Jinja templates** — HTML files with Python-like logic mixed in, stored in a `templates/` folder.

```python
from flask import render_template

@app.route("/")
def index():
    trades = [{"symbol": "XAUUSD", "pnl": 145}, {"symbol": "NAS100", "pnl": -60}]
    return render_template("index.html", trades=trades)
```

```html
<!-- templates/index.html -->
<!DOCTYPE html>
<html>
<body>
    <h1>My Trades</h1>
    <ul>
        {% for trade in trades %}
            <li>{{ trade.symbol }}: {{ trade.pnl }}</li>
        {% endfor %}
    </ul>
</body>
</html>
```

- `{{ }}` — inserts a Python value into the HTML
- `{% %}` — runs logic (loops, conditionals) inside the template

This is the exact same idea as `.format()` or an f-string in Python, just applied to entire HTML files instead of single strings — it's how the backend generates a personalized page for each request.

---

## 5. GET vs POST — reading vs submitting data

```python
from flask import request

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        # check credentials, log the user in...
        return f"Welcome, {username}"
    else:
        return render_template("login.html")
```

- `GET` — just viewing a page (like loading the login form)
- `POST` — submitting data (like actually logging in)
- `request.form` — reads data submitted from an HTML `<form method="post">`
- `request.args` — reads data from the URL's query string (`?symbol=XAUUSD`), typically used with `GET`

---

## 6. Sessions — remembering a user between requests

HTTP is **stateless** — by default, the server doesn't remember who you are between one request and the next. Sessions solve this using a cookie stored in the browser.

```python
from flask import session

@app.route("/login", methods=["POST"])
def login():
    session["user_id"] = 7
    return "Logged in"

@app.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        return "Please log in first"
    return f"Welcome back, user {session['user_id']}"
```

This is exactly what's happening behind something like Google OAuth in TradeBook — after login, the server keeps track of who you are across every page you visit next, without you having to log in again on every single request.

---

## 7. Connecting to a database

Flask apps typically read/write from a database (like the SQL from Week 7) on every request that needs data.

```python
from cs50 import SQL

db = SQL("sqlite:///trades.db")

@app.route("/")
def index():
    trades = db.execute("SELECT * FROM trades WHERE user_id = ?", session["user_id"])
    return render_template("index.html", trades=trades)
```

Note the `?` placeholder again — same SQL injection protection from Week 7, still critical here since `request.form`/`request.args` values are direct user input.

---

## 8. Static files — CSS, JS, and images

Flask expects static assets in a `static/` folder, and you link to them like this:

```html
<link rel="stylesheet" href="{{ url_for('static', filename='styles.css') }}">
```

`url_for` builds the correct URL automatically, instead of you hardcoding a path — useful if the app's structure or domain changes later.

---

## 9. APIs — returning JSON instead of HTML

Sometimes a route isn't meant to render a page at all — it's meant to be called by JavaScript (or another program) and just return data.

```python
from flask import jsonify

@app.route("/api/trades")
def api_trades():
    trades = db.execute("SELECT * FROM trades WHERE user_id = ?", session["user_id"])
    return jsonify(trades)
```

This is the same shape as calling any external API — except now you're the one building the endpoint that something else calls. It's also the same underlying model as an MCP server or a smart contract's external calls: a defined endpoint, a request, a response.

---

## Quick Recap Cheatsheet (for revision)

- Flask maps URLs (`@app.route`) to Python functions that return a response
- Dynamic routes (`/trade/<symbol>`) capture parts of the URL as variables
- Templates (Jinja) let Python generate HTML dynamically using `{{ }}` and `{% %}`
- `GET` = viewing/reading, `POST` = submitting/changing data
- Sessions use cookies to remember a logged-in user across requests (HTTP itself is stateless)
- Always use `?` placeholders when querying the database with user input
- `jsonify` turns a route into an API endpoint that returns data instead of a rendered page

---
