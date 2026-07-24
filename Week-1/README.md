# CS50 Week 1: C 

> Reference: https://cs50.harvard.edu/x/weeks/1/

The big idea of this week: **C is a lower-level language than what you might be used to (like Python) — you have to be explicit about types, and your code gets compiled into machine instructions before it runs.** Everything else this week (variables, conditionals, loops, functions, compiling) builds the foundation for every pset that comes after.

---

## 1. From Scratch to C

CS50 usually starts with Scratch (drag-and-drop blocks) before C, to show that the same programming concepts apply everywhere — conditionals, loops, variables, functions. C just makes you write it all out in text, with strict rules.

---

## 2. Compiling — what actually happens when you run code

Unlike Python (interpreted line by line), C is a **compiled** language. Your `.c` file has to be translated into machine code before it can run.

```
$ make hello
$ ./hello
```

`make` runs the compiler (`clang`) behind the scenes, which does four steps:

| Step | What it does |
|---|---|
| Preprocessing | Handles lines starting with `#`, like `#include <stdio.h>` |
| Compiling | Converts your C code into assembly language |
| Assembling | Converts assembly into machine code (0s and 1s) |
| Linking | Combines your code with library code (like `printf`) into one final program |

If there's a mistake in your code, the compiler will refuse to build it and give you an error — that's actually helpful, since it catches problems before the program ever runs.

---

## 3. `main` — every C program's starting point

```c
#include <stdio.h>

int main(void)
{
    printf("Hello, world\n");
}
```

- `#include <stdio.h>` — brings in a library (here, for `printf`)
- `int main(void)` — every program starts running from here
- `printf` — prints text to the screen. `\n` means "start a new line"

---

## 4. Variables and Types

C requires you to declare the **type** of every variable up front — this is different from Python, where a variable can just hold anything.

| Type | Stores | Example |
|---|---|---|
| `int` | whole numbers | `int age = 23;` |
| `long` | bigger whole numbers | `long population = 240000000;` |
| `float` / `double` | decimal numbers | `float price = 9.99;` |
| `char` | a single character | `char grade = 'A';` |
| `bool` | true or false (needs `#include <cs50.h>` or `<stdbool.h>`) | `bool is_valid = true;` |
| `string` | text (CS50's own type, from `cs50.h`) | `string name = "Nimra";` |

**Getting input from the user** (CS50's helper functions, from `cs50.h`):

```c
#include <cs50.h>
#include <stdio.h>

int main(void)
{
    string name = get_string("Name: ");
    int age = get_int("Age: ");
    printf("Hi %s, you are %i\n", name, age);
}
```

---

## 5. Format codes for `printf`

| Code | Type |
|---|---|
| `%i` | int |
| `%li` | long |
| `%f` | float / double |
| `%c` | char |
| `%s` | string |

---

## 6. Operators

```c
int x = 5 + 3;   // addition
int y = 5 - 3;   // subtraction
int z = 5 * 3;   // multiplication
int a = 5 / 3;   // division — careful, this is integer division! result is 1, not 1.67
int b = 5 % 3;   // modulo — remainder after division, result is 2
```

**Watch out for integer division:** `5 / 3` in C gives `1`, not `1.666...`, because both are `int`. To get a decimal result, at least one value needs to be a `float`/`double`.

---

## 7. Conditionals

```c
if (age >= 18)
{
    printf("Adult\n");
}
else if (age >= 13)
{
    printf("Teenager\n");
}
else
{
    printf("Child\n");
}
```

Comparison operators: `==` (equal), `!=` (not equal), `<`, `>`, `<=`, `>=`
Logical operators: `&&` (and), `||` (or), `!` (not)

**Common beginner mistake:** using `=` (assignment) instead of `==` (comparison) inside an `if`.

---

## 8. Loops

### `for` loop — when you know how many times to repeat

```c
for (int i = 0; i < 5; i++)
{
    printf("%i\n", i);   // prints 0 1 2 3 4
}
```

Three parts: starting value (`int i = 0`), condition to keep going (`i < 5`), and what happens after each round (`i++`).

### `while` loop — repeat as long as a condition is true

```c
int i = 0;
while (i < 5)
{
    printf("%i\n", i);
    i++;
}
```

### `do while` loop — runs at least once, then checks the condition

```c
int n;
do
{
    n = get_int("Enter a positive number: ");
}
while (n < 1);
```

Useful for validating user input, since you need to ask at least once before you can check the answer.

---

## 9. Functions

Breaking a program into smaller, reusable pieces.

```c
#include <stdio.h>

int square(int n);   // prototype — tells the compiler this function exists

int main(void)
{
    int result = square(5);
    printf("%i\n", result);   // prints 25
}

int square(int n)   // actual function definition
{
    return n * n;
}
```

**Why you need a prototype:** C reads your file top to bottom. If `main` calls `square` before `square` is actually defined further down, the compiler doesn't know about it yet — the prototype tells it "trust me, this function exists, here's its signature."

---

## 10. Debugging — tools you'll actually use

- **`printf` debugging** — print variable values at different points to see what's happening
- **`debug50`** — CS50's step-by-step debugger, lets you pause and inspect variables line by line
- Reading **compiler errors carefully** — they usually point to the exact line and explain what's wrong, even if the wording feels cryptic at first

---

## Quick Recap Cheatsheet (for revision)

- C is compiled, not interpreted — `make` builds your program before you can run it
- Every program starts in `int main(void)`
- Variables need an explicit type (`int`, `float`, `char`, `bool`, `string`)
- Integer division truncates — `5 / 3` is `1`, not `1.67`
- `for` = fixed number of repeats, `while` = repeat until false, `do while` = runs at least once
- `==` for comparison, `=` for assignment — don't mix them up
- Functions need a **prototype** if they're defined after they're called
- `printf` debugging and `debug50` are your best friends when something's not working

---

