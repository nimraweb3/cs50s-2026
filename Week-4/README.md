# CS50 Week 4: Memory 

> Reference: https://cs50.harvard.edu/x/weeks/4/
> This is the week where we solved Volume, Filter (More), and Recover psets.

The whole point of this week is one idea: **when you create a variable, it gets stored somewhere in RAM, and you can directly access that location (its address).** Once this clicks, everything else (pointers, arrays, structs, file I/O) makes a lot more sense.

---

## 1. Hexadecimal — understand this first

Memory addresses aren't written in decimal, they're written in **hexadecimal (base 16)**. Digits go `0-9` then `a-f`.

- `0x` prefix means "this is a hex number"
- Each hex digit represents 4 bits
- So 1 byte (8 bits) = exactly 2 hex digits (e.g. `0xff` = 255)

This is also why RGB colors are written in hex (`0xff0000` = pure red) — 24 bits = 6 hex digits = 3 bytes (R, G, B).

---

## 2. Pointers — the core concept

Every variable lives somewhere in RAM. We can store its address in a special variable called a **pointer**.

```c
int n = 50;
int *p = &n;   // p now stores the address of n
```

Two new operators to remember:

| Operator | Name | What it does |
|---|---|---|
| `&x` | address-of | gives you the memory address of x |
| `*p` | dereference | gives you the value stored at the address p points to |

```c
int n = 50;
int *p = &n;

printf("%p\n", p);    // prints the address of n
printf("%i\n", *p);   // prints 50 (by dereferencing)
```

**Keep this in mind:** `*` means two different things depending on where it's used —
- In a declaration (`int *p`) — "this is a pointer"
- Anywhere else (`*p`) — "give me the value at this address"

---

## 3. Arrays and Pointers — how they're related

An array's name is itself a pointer — it points to the address of its first element.

```c
int arr[3] = {10, 20, 30};
// arr and &arr[0] are the same thing
```

**Pointer arithmetic:** `arr + 1` means "move to the next element" (the compiler automatically calculates the right number of bytes to skip, based on the type).

This is also why strings (`char *`) are pointers — the address of the first character, and you keep reading until you hit `\0`.

---

## 4. malloc and free — dynamic memory

Sometimes you don't know in advance how much memory you'll need (e.g. it depends on user input). That's when you use `malloc` to request memory from the heap.

```c
int *arr = malloc(3 * sizeof(int));  // ask for space for 3 ints
if (arr == NULL)
{
    // malloc can fail — always check!
    return 1;
}

arr[0] = 10;

free(arr);   // done using it, give the memory back
```

**Golden rule:** Whatever you `malloc`, you must `free`. Otherwise you get a **memory leak** — the program keeps running, but memory keeps getting wasted. This is exactly what `check50`/`valgrind` catch.

### Valgrind — the leak detector

```
valgrind ./program
```

It tells you: how much memory was allocated, how much was freed, and whether there was any **invalid read/write** (e.g. accessing an array out of bounds).

---

## 5. Memory Layout (mental picture)

While a program runs, memory is roughly divided into these layers (from high to low addresses):

```
High addresses
+----------------+
|   Stack         |  <- local variables, function calls (grows downward)
|      ↓          |
|                  |
|      ↑          |
|   Heap           |  <- memory from malloc (grows upward)
+----------------+
|   Globals        |
+----------------+
|   Code (text)    |
+----------------+
Low addresses
```

The stack and heap grow toward each other — if they ever meet, you get a **stack overflow** (which is also why infinite recursion crashes your program).

---

## 6. Common bugs from this week

| Bug | What happens |
|---|---|
| **Buffer overflow** | Reading or writing outside an array's bounds |
| **Memory leak** | You `malloc`'d something but forgot to `free` it |
| **Dangling pointer** | Using a pointer after the memory it points to has been freed |
| **Garbage values** | The value of an uninitialized variable — whatever was randomly sitting there before |
| **Segmentation fault** | Accessing memory that isn't yours (an illegal address) |

---

## 7. The swap problem — a classic pointer example

This is key to understanding that functions get a **copy** of values by default, not the originals. So to swap two variables, you need pointers:

```c
void swap(int *a, int *b)
{
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main(void)
{
    int x = 1, y = 2;
    swap(&x, &y);   // passing addresses, not values
}
```

If we hadn't used `&`, the function would only swap its own local copies — `x` and `y` in `main` would stay unchanged.

---

## 8. File I/O — what we actually used in the psets

```c
FILE *file = fopen("data.bin", "r");   // read mode
if (file == NULL) { /* handle error */ }

fread(buffer, size_of_each_item, count, file);   // read from file
fwrite(buffer, size_of_each_item, count, file);  // write to file

fclose(file);
```

- `fread`/`fwrite` work with raw bytes — that's exactly how we copied BMP headers, WAV samples, and JPEG blocks
- `fread` returns how many items it successfully read — that's how we know if the file has ended

---

## Now let's connect this to the psets I actually solved

### `volume.c` — basic pointers + fread/fwrite
- Passed `&buffer` to `fread`/`fwrite` — meaning "read into / write from this address"
- `uint8_t header[HEADER_SIZE]` — a fixed-size array, used to copy raw bytes exactly as they are
- `while (fread(...))` — the loop keeps going as long as there's data (fread returns 0 when the file ends, which stops the loop)

### `helpers.c` (filter) — 2D arrays, structs, and copying data
- `RGBTRIPLE image[height][width]` — a 2D array of structs, where each struct is one pixel
- In blur/edges, I made a **copy of the image** first — because if I modified the original image while still reading from it, the next pixel's calculation would use already-modified neighbors and give wrong results
- This is directly a memory-safety concept: preserving the source data for as long as you need it

### `recover.c` — the most memory concepts packed into one file
- `uint8_t buffer[512]` — a fixed block size, temporarily stored in memory
- The file pointer (`FILE *img`) is itself a pointer that tracks which file is currently open
- `sprintf(filename, "%03i.jpg", counter)` — building a string in memory
- Every `fopen` matched with an `fclose` — exactly the same discipline as `malloc`/`free`

---

## Quick Recap Cheatsheet (for revision)

- `&x` = get the address, `*p` = get the value (dereference)
- Array name = pointer to its first element
- If you `malloc`, you must `free`
- Stack = local variables/function calls, Heap = memory from malloc
- Functions receive copies of values — if you want to change the original, pass a pointer
- `fread`/`fwrite` work at the raw byte level — that's why understanding a file format's structure (BMP, WAV, JPEG headers) matters
- Always check with `valgrind` — it catches both leaks and invalid memory access

---

*These notes were made after solving three psets (Volume, Filter More, Recover), so I can come back to this file whenever I need to revise the concepts.*