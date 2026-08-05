import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, lookup, usd

app = Flask(__name__)
app.secret_key = os.urandom(24)

app.jinja_env.filters["usd"] = usd

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

db = SQL("sqlite:///finance.db")


@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    user_id = session["user_id"]

    holdings = db.execute(
        "SELECT symbol, SUM(shares) AS shares FROM transactions WHERE user_id = ? GROUP BY symbol HAVING SUM(shares) > 0",
        user_id,
    )

    portfolio = []
    stocks_total = 0

    for holding in holdings:
        quote = lookup(holding["symbol"])
        total = quote["price"] * holding["shares"]
        stocks_total += total
        portfolio.append({
            "symbol": holding["symbol"],
            "name": quote["name"],
            "shares": holding["shares"],
            "price": quote["price"],
            "total": total,
        })

    cash = db.execute("SELECT cash FROM users WHERE id = ?", user_id)[0]["cash"]
    grand_total = cash + stocks_total

    return render_template("index.html", portfolio=portfolio, cash=cash, grand_total=grand_total)


@app.route("/buy", methods=["GET", "POST"])
@login_required
def buy():
    if request.method == "POST":
        symbol = request.form.get("symbol")
        if not symbol:
            return apology("must provide symbol", 400)

        quote = lookup(symbol)
        if quote is None:
            return apology("invalid symbol", 400)

        shares = request.form.get("shares")
        if not shares:
            return apology("must provide number of shares", 400)
        try:
            shares = int(shares)
        except ValueError:
            return apology("shares must be a positive integer", 400)
        if shares < 1:
            return apology("shares must be a positive integer", 400)

        user_id = session["user_id"]
        cash = db.execute("SELECT cash FROM users WHERE id = ?", user_id)[0]["cash"]

        cost = quote["price"] * shares
        if cost > cash:
            return apology("can't afford", 400)

        db.execute("UPDATE users SET cash = cash - ? WHERE id = ?", cost, user_id)
        db.execute(
            "INSERT INTO transactions (user_id, symbol, shares, price) VALUES (?, ?, ?, ?)",
            user_id, quote["symbol"], shares, quote["price"],
        )

        flash("Bought!")
        return redirect("/")
    else:
        return render_template("buy.html")


@app.route("/history")
@login_required
def history():
    user_id = session["user_id"]
    transactions = db.execute(
        "SELECT symbol, shares, price, transacted FROM transactions WHERE user_id = ? ORDER BY transacted DESC",
        user_id,
    )
    return render_template("history.html", transactions=transactions)


@app.route("/login", methods=["GET", "POST"])
def login():
    session.clear()

    if request.method == "POST":
        if not request.form.get("username"):
            return apology("must provide username", 403)
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", 403)

        session["user_id"] = rows[0]["id"]
        return redirect("/")
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


@app.route("/quote", methods=["GET", "POST"])
@login_required
def quote():
    if request.method == "POST":
        symbol = request.form.get("symbol")
        if not symbol:
            return apology("must provide symbol", 400)

        stock = lookup(symbol)
        if stock is None:
            return apology("invalid symbol", 400)

        return render_template("quoted.html", quote=stock)
    else:
        return render_template("quote.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

        if not username:
            return apology("must provide username", 400)
        elif not password:
            return apology("must provide password", 400)
        elif not confirmation:
            return apology("must confirm password", 400)
        elif password != confirmation:
            return apology("passwords must match", 400)

        hash = generate_password_hash(password)

        try:
            new_user_id = db.execute(
                "INSERT INTO users (username, hash) VALUES (?, ?)", username, hash
            )
        except ValueError:
            return apology("username already exists", 400)

        session["user_id"] = new_user_id
        return redirect("/")
    else:
        return render_template("register.html")


@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    user_id = session["user_id"]

    if request.method == "POST":
        symbol = request.form.get("symbol")
        if not symbol:
            return apology("must select a stock", 400)

        shares = request.form.get("shares")
        if not shares:
            return apology("must provide number of shares", 400)
        try:
            shares = int(shares)
        except ValueError:
            return apology("shares must be a positive integer", 400)
        if shares < 1:
            return apology("shares must be a positive integer", 400)

        owned = db.execute(
            "SELECT SUM(shares) AS total_shares FROM transactions WHERE user_id = ? AND symbol = ? GROUP BY symbol",
            user_id, symbol,
        )
        if not owned or owned[0]["total_shares"] < shares:
            return apology("too many shares", 400)

        quote = lookup(symbol)
        if quote is None:
            return apology("invalid symbol", 400)

        proceeds = quote["price"] * shares

        db.execute("UPDATE users SET cash = cash + ? WHERE id = ?", proceeds, user_id)
        db.execute(
            "INSERT INTO transactions (user_id, symbol, shares, price) VALUES (?, ?, ?, ?)",
            user_id, symbol, -shares, quote["price"],
        )

        flash("Sold!")
        return redirect("/")
    else:
        rows = db.execute(
            "SELECT symbol FROM transactions WHERE user_id = ? GROUP BY symbol HAVING SUM(shares) > 0",
            user_id,
        )
        symbols = [row["symbol"] for row in rows]
        return render_template("sell.html", symbols=symbols)


@app.route("/password", methods=["GET", "POST"])
@login_required
def password():
    """Personal touch: allow users to change their password."""
    if request.method == "POST":
        current = request.form.get("current_password")
        new = request.form.get("new_password")
        confirmation = request.form.get("confirmation")

        if not current or not new or not confirmation:
            return apology("must fill out all fields", 400)

        user_id = session["user_id"]
        rows = db.execute("SELECT hash FROM users WHERE id = ?", user_id)

        if not check_password_hash(rows[0]["hash"], current):
            return apology("incorrect current password", 400)

        if new != confirmation:
            return apology("new passwords must match", 400)

        db.execute(
            "UPDATE users SET hash = ? WHERE id = ?", generate_password_hash(new), user_id
        )

        flash("Password changed!")
        return redirect("/")
    else:
        return render_template("password.html")