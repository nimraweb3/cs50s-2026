# CS50 Week 6: Python 

> Reference: https://cs50.harvard.edu/x/weeks/6/

The big idea of this week: **after five weeks of C, you switch to Python — a higher-level, interpreted language that handles a lot of the low-level stuff (memory, types) for you.** The core logic (loops, conditionals, functions) is the same as C — only the syntax and the safety net around it change.

---

## 1. C vs Python — what actually changes

| | C | Python |
|---|---|---|
| Compiled or interpreted | Compiled (needs `make`) | Interpreted (runs line by line) |
| Variable types | Must declare (`int`, `float`, etc.) | Inferred automatically |
| Semicolons / braces | Required | Not used — indentation defines blocks |
| Memory management | Manual (`malloc`/`free`) | Automatic (garbage collected) |
| Arrays | Fixed size | Lists — can grow/shrink freely |

None of the underlying logic changes — a loop is still a loop, a conditional is still a conditional. What changes is how much boilerplate you have to write, and how much the language protects you from bugs like memory leaks.

---

## 2. Syntax basics

```python
name = input("Name: ")
age = int(input("Age: "))

if age >= 18:
    print(f"Hi {name}, you're an adult")
else:
    print(f"Hi {name}, you're a minor")
```

Notice:
- No type declarations — `name` just becomes whatever you assign to it
- No curly braces — **indentation** defines which lines belong to the `if`/`else`
- No semicolons at the end of lines
- `f"..."` is an f-string — lets you drop variables directly into text with `{}`

---

## 3. Loops

```python
for i in range(5):
    print(i)          # prints 0 1 2 3 4

i = 0
while i < 5:
    print(i)
    i += 1
```

`range(5)` generates the numbers 0 through 4 — same effect as `for (int i = 0; i < 5; i++)` in C, just without manually writing the counter and condition.

---

## 4. Lists — Python's flexible arrays

```python
scores = [72, 88, 95]
scores.append(100)      # grows automatically, no malloc needed
scores.remove(72)       # removes a value directly
print(len(scores))      # get the length anytime
```

Unlike C arrays, lists resize themselves as you go — no fixed size, no manual memory management. This is the direct payoff of everything Week 4/5 taught about why manual memory handling is hard — Python just does it for you under the hood.

---

## 5. Functions

```python
def square(n):
    return n * n

result = square(5)
print(result)   # 25
```

No prototypes needed (Python doesn't require declaring a function before using it the way C does, since there's no separate compile step reading top to bottom the same way) — and no return type or parameter types to declare.

---

## 6. Exceptions — Python's version of error handling

Instead of checking return values manually (like checking if `malloc` returned `NULL`), Python uses **try/except** to catch errors when they happen.

```python
try:
    x = int(input("Number: "))
except ValueError:
    print("That wasn't a valid number")
```

If the user types something that isn't a number, `int()` would normally crash the program — `try/except` lets you catch that and handle it gracefully instead.

---

## 7. Libraries — Python's biggest strength

Python has a massive ecosystem of pre-built libraries you can just `import`, instead of writing everything from scratch.

```python
import statistics

scores = [72, 88, 95]
print(statistics.mean(scores))
```

This is the same idea as `#include <cs50.h>` in C, just with a much bigger universe of libraries available — things like `pandas` for data, `requests` for web calls, or `web3.py`, which is directly relevant to where you're headed with blockchain dev.

---

## 8. Unit testing

CS50 introduces testing your own functions properly this week, instead of just running the program and eyeballing the output.

```python
# test_square.py
from square import square

def test_positive():
    assert square(5) == 25

def test_zero():
    assert square(0) == 0

def test_negative():
    assert square(-5) == 25
```

Run with:
```
pytest test_square.py
```

**Why this matters going forward:** this is the exact same instinct as writing tests for smart contracts in Foundry — you write small, specific checks for each behavior instead of trusting that "it looked right when I ran it once."

---

## 9. Common gotchas coming from C

- **Indentation is not optional** — a wrong indent level changes what block of code a line belongs to, and Python will throw an error or silently do the wrong thing
- **No more `%i`/`%s` format codes** — use f-strings (`f"{value}"`) instead
- **Dynamic typing means fewer upfront errors, but more runtime surprises** — a bug that C's compiler would catch immediately (wrong type) might not show up in Python until that exact line actually runs

---

## Quick Recap Cheatsheet (for revision)

- Python is interpreted, not compiled — no `make` step
- Indentation replaces `{ }` for defining blocks
- Variables don't need declared types — Python infers them
- Lists replace arrays — they resize automatically, no manual memory management
- `try/except` replaces manually checking for errors (like checking for `NULL`)
- `import` gives you access to a huge range of pre-built libraries
- `pytest` lets you write proper tests for your functions instead of manually checking output

---

