import os

from cs50 import SQLs
from flask import Flask, redirect, render_template, request

app = Flask(__name__)

db = SQL("sqlite:///birthdays.db")

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # Access form data
        name = request.form.get("name")
        if not name:
            return redirect("/")

        month = request.form.get("month")
        if not month:
            return redirect("/")
        try:
            month = int(month)
        except ValueError:
            return redirect("/")
        if month < 1 or month > 12:
            return redirect("/")

        day = request.form.get("day")
        if not day:
            return redirect("/")
        try:
            day = int(day)
        except ValueError:
            return redirect("/")
        if day < 1 or day > 31:
            return redirect("/")

        # Insert data into database
        db.execute("INSERT INTO birthdays (name, month, day) VALUES(?, ?, ?)", name, month, day)

        return redirect("/")
    else:
        # Query for all birthdays
        birthdays = db.execute("SELECT * FROM birthdays")

        # Render birthdays page
        return render_template("index.html", birthdays=birthdays)