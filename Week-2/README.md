# CS50 Week 2: Arrays 

> Reference: https://cs50.harvard.edu/x/weeks/2/

The big idea of this week: **instead of creating separate variables for related data (like `score1`, `score2`, `score3`), you can store them together in one block of memory called an array.** This week also introduces strings (which are really just arrays of characters), command-line arguments, and cryptography as a real-world use of arrays.

---

## 1. What is an array?

An array is a collection of values, **all of the same type**, stored right next to each other in memory. Each value has an **index**, starting at 0.

```c
int scores[3];        // an array that can hold 3 ints
scores[0] = 72;
scores[1] = 88;
scores[2] = 95;
```

Or declare and fill it at once:

```c
int scores[3] = {72, 88, 95};
```

**Key facts:**
- Indexing starts at **0**, not 1. So `scores[0]` is the first element, `scores[2]` is the last one in a 3-element array.
- Arrays have a **fixed size** — once created, you can't grow or shrink them.
- Because elements sit next to each other in memory, the computer can jump straight to any index instantly — O(1) access, no searching needed.

---

## 2. Why arrays matter

Without arrays, storing 100 test scores would mean 100 separate variable names. With an array:

```c
int scores[100];

for (int i = 0; i < 100; i++)
{
    scores[i] = get_int("Score %i: ", i + 1);
}
```

One loop handles all 100 — this pattern (loop + array) is something you'll use constantly.

---

## 3. Strings are arrays of characters

In C, a string is really just an array of `char`, ending with a special character `\0` (called **NUL**), which marks "the string stops here."

```c
char name[5] = {'N', 'i', 'm', 'r', 'a'};   // no NUL — not a valid C string!
char name[6] = {'N', 'i', 'm', 'r', 'a', '\0'};   // this is a proper string

// or simply:
char *name = "Nimra";   // the compiler adds \0 automatically
```

**Why NUL matters:** functions like `printf` don't know how long your string is in advance — they just keep reading characters until they hit `\0`. If it's missing, the function keeps reading into random memory (a bug!).

You can access individual characters just like any array:

```c
char *name = "Nimra";
printf("%c\n", name[0]);   // prints N
printf("%c\n", name[4]);   // prints a
```

And you can loop through a string until you hit the NUL character:

```c
for (int i = 0; name[i] != '\0'; i++)
{
    printf("%c\n", name[i]);
}
```

Or use `strlen` from `<string.h>` to get the length directly, instead of counting manually.

---

## 4. Command-line arguments

So far, programs took input while running (`get_string`, `get_int`). This week introduces getting input **when you launch the program**, via `argc` and `argv`.

```c
int main(int argc, char *argv[])
{
    // argc = argument count (includes the program name itself)
    // argv = array of argument strings

    if (argc != 2)
    {
        printf("Usage: ./program input\n");
        return 1;
    }

    printf("Hello, %s\n", argv[1]);
}
```

If you run `./program hello`, then:
- `argc` is 2 (the program name + one argument)
- `argv[0]` is `"./program"`
- `argv[1]` is `"hello"`

This is exactly the pattern you already used in `volume.c` and `recover.c` (checking `argc` before doing anything, then reading from `argv`).

---

## 5. Cryptography — arrays in action

This week's real project (Caesar/Substitution ciphers) is a great example of why arrays matter. The core idea: **shift or substitute each character in a string, one at a time, using its position in an array as a lookup.**

### Caesar Cipher

Shift every letter forward by a fixed key.

```c
char plaintext[] = "HELLO";
int key = 3;

for (int i = 0; plaintext[i] != '\0'; i++)
{
    if (isupper(plaintext[i]))
    {
        char cipher = ((plaintext[i] - 'A') + key) % 26 + 'A';
        printf("%c", cipher);
    }
}
// prints: KHOOR
```

**How the math works:**
- `plaintext[i] - 'A'` converts the letter to a number from 0–25 (A=0, B=1, ... Z=25)
- Add the key, then `% 26` wraps back around if it goes past Z
- Add `'A'` back to convert it into a letter again

### Substitution Cipher

Instead of shifting by a fixed amount, you use a **key array** — a scrambled alphabet — and look up each letter's replacement by index.

```c
char key[26] = "ZYXWVUTSRQPONMLKJIHGFEDCBA";  // example scrambled alphabet

char plaintext_letter = 'A';
char cipher_letter = key[plaintext_letter - 'A'];   // look up the substitution
```

This is the same lookup pattern as arrays in general: **use the input as an index into another array to find its transformed value.**

---

## 6. Common patterns to remember from this week

| Pattern | Example |
|---|---|
| Loop through an array by index | `for (int i = 0; i < n; i++)` |
| Loop through a string until NUL | `for (int i = 0; str[i] != '\0'; i++)` |
| Convert a letter to 0–25 | `letter - 'A'` (or `- 'a'` for lowercase) |
| Convert 0–25 back to a letter | `number + 'A'` |
| Wrap around the alphabet | `% 26` |
| Check argument count before using it | `if (argc != 2) { ... }` |

---

## Quick Recap Cheatsheet (for revision)

- Arrays store same-type values together in memory, indexed from 0
- Array size is fixed once declared
- Strings are `char` arrays ending in `\0` (NUL) — this is how functions know where a string stops
- `argc`/`argv` let you pass input to a program at launch, instead of asking during runtime
- Caesar cipher = shift each letter by a fixed key, wrapping with `% 26`
- Substitution cipher = look up each letter's replacement in a key array
- The core skill of this week: **looping over an array/string one element at a time and doing something with each one**

---

