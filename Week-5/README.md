# CS50 Week 5: Data Structures

> Reference: https://cs50.harvard.edu/x/weeks/5/

The big idea of this week: **arrays are great, but they're fixed in size and inserting into the middle is expensive. This week is about structures that can grow, shrink, and rearrange themselves in memory — using pointers to link pieces together.** Everything here builds directly on Week 4 (pointers, malloc) — this is where that stuff finally pays off.

---

## 1. Why arrays aren't always enough

Arrays are fast to access (`arr[i]` is instant) but:

- Fixed size — you commit to a size upfront
- Inserting/deleting in the middle means shifting every element after it
- Growing an array means allocating a whole new block and copying everything over

This week introduces structures that trade away that instant-access speed in exchange for flexibility.

---

## 2. Structs — grouping related data together

Before getting to linked structures, recall `struct` (from `<stdio.h>`/custom headers) — a way to bundle different pieces of data under one name.

```c
typedef struct
{
    string name;
    string number;
}
person;
```

This is the same idea as `RGBTRIPLE` in the filter pset, or `BITMAPFILEHEADER` — a struct groups fields that belong together.

---

## 3. Linked Lists

A linked list is a chain of nodes, where each node stores a value **and** a pointer to the next node.

```c
typedef struct node
{
    int number;
    struct node *next;
}
node;
```

**Why `struct node` inside itself?** A struct can't contain an instance of itself (infinite size), but it _can_ contain a pointer to another one — pointers are just addresses, so the size is fixed no matter what.

```
[5 | *]  ->  [10 | *]  ->  [15 | NULL]
```

Each node points to the next one. The last node's `next` is `NULL`, marking the end.

### Inserting a new node at the front

```c
node *n = malloc(sizeof(node));
if (n != NULL)
{
    n->number = 3;
    n->next = list;   // point to the old first node
    list = n;          // update list to start here
}
```

**Trade-off vs arrays:** inserting is now O(1) at the front (no shifting needed!), but finding a specific value is O(n) — you have to walk the list one node at a time, you can't jump straight to index 5 like you can in an array.

---

## 4. Trees — organizing data hierarchically

A **binary search tree (BST)** keeps values sorted in a tree shape: each node has up to two children, left child smaller, right child bigger.

```c
typedef struct node
{
    int number;
    struct node *left;
    struct node *right;
}
node;
```

```
        50
       /  \
     30    70
    /  \   /  \
  20   40 60   80
```

**Searching a BST:** start at the root, go left if your target is smaller, right if bigger, repeat. Because the tree is balanced, this gives you O(log n) search — same speed class as binary search, but now you can also insert/delete efficiently, which a plain sorted array can't do cheaply.

---

## 5. Hash Tables

An array of "buckets," where a **hash function** decides which bucket a value goes into. Handles the case where two keys hash to the same bucket ("collision") using a linked list per bucket — this is called **chaining**.

```c
typedef struct node
{
    string word;
    struct node *next;
}
node;

node *table[N];   // array of linked lists
```

To insert `"apple"`:

1. Run it through a hash function → get an index, say `3`
2. Add a new node to the front of `table[3]`'s linked list

**Why this is fast:** with a good hash function, most buckets have only 0 or 1 items, so lookup is close to O(1) on average — much better than a linked list's O(n), while still being flexible in size (unlike a plain array).

---

## 6. Tries — a tree shaped around your data itself

A trie is a tree where the _path_ you walk spells out the thing you're storing — each level represents one character (or digit) of the key.

```
root -> 'c' -> 'a' -> 't' (end of word: "cat")
            -> 'r' -> 't' (end of word: "cart")
```

Every node is typically an array of pointers (one per possible next character), so lookup for a word of length `k` takes exactly `k` steps — O(1) relative to the number of words stored, regardless of how many words are in the whole trie. The trade-off: it can use a lot more memory than a hash table, since many nodes may go unused.

---

## 7. Putting it side by side

| Structure   | Search               | Insert                   | Notes                                        |
| ----------- | -------------------- | ------------------------ | -------------------------------------------- |
| Array       | O(log n) if sorted   | O(n) — shifting required | Fixed size, fastest random access            |
| Linked list | O(n)                 | O(1) at front            | Flexible size, no random access              |
| BST         | O(log n) if balanced | O(log n) if balanced     | Sorted + flexible, but can become unbalanced |
| Hash table  | ~O(1) average        | ~O(1) average            | Fast, but depends on a good hash function    |
| Trie        | O(k), k = key length | O(k)                     | Fast lookup, but can use a lot of memory     |

---

## 8. The pointer discipline from Week 4 comes back here

Every one of these structures is built from nodes allocated with `malloc`. That means the Week 4 rules still apply, just at a bigger scale:

- Every `malloc`'d node eventually needs to be `free`'d — with a linked list or tree, that usually means writing a function that walks the whole structure, freeing each node one at a time, often recursively for trees
- Losing the pointer to a node before freeing it (or before re-linking around it) causes a memory leak — same failure mode as before, just easier to trip into now that there are more pointers flying around

---

## Quick Recap Cheatsheet (for revision)

- Arrays: fast access, fixed size, costly insert/delete
- Linked lists: flexible size, O(1) insert at front, O(n) search (no random access)
- BSTs: sorted + flexible, O(log n) search/insert if balanced
- Hash tables: array of buckets + hash function, ~O(1) average via chaining for collisions
- Tries: tree shaped by the key itself, O(k) lookup where k = key length, but memory-hungry
- Every node = a `malloc`'d struct with at least one pointer to another node
- Freeing these structures usually means walking through them node by node (often recursively)

---

