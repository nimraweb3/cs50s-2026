# CS50 Week 3: Algorithms 

> Reference: https://cs50.harvard.edu/x/weeks/3/

The big idea of this week: **an algorithm is just a step-by-step recipe for solving a problem, and different recipes can take wildly different amounts of time.** This week is about learning to measure and compare that time — and learning a few classic recipes (searching, sorting, recursion) that show up everywhere.

---

## 1. What is an algorithm, really?

An algorithm is a precise sequence of steps that takes an input and produces an output. Same problem can often be solved in more than one way — but not all ways are equally fast. This week's whole goal is: **how do we measure "fast"?**

---

## 2. Running time — measuring speed without a stopwatch

We don't measure algorithms in seconds (that depends on your computer's speed). Instead, we count **how the number of steps grows as the input grows**. This is called **Big O notation**.

| Notation | Meaning | Example |
|---|---|---|
| O(1) | constant — same number of steps no matter the input size | looking up an array element by index |
| O(log n) | grows very slowly as input grows | binary search |
| O(n) | grows in direct proportion to input size | linear search |
| O(n log n) | a bit worse than linear, common for good sorting algorithms | merge sort |
| O(n²) | grows as the square of input size — slow for large inputs | bubble sort, selection sort |

Think of `n` as "how many items you're working with." As `n` gets huge, the difference between O(n) and O(n²) becomes massive.

- **Big O** = worst case (upper bound) — "it will never be slower than this"
- **Big Omega (Ω)** = best case (lower bound) — "it will never be faster than this"
- **Big Theta (Θ)** = when best case and worst case are the same — "this is exactly how it behaves"

---

## 3. Searching algorithms

### Linear Search — O(n)

Check every element one by one until you find what you're looking for (or run out of elements).

```c
int linear_search(int arr[], int n, int target)
{
    for (int i = 0; i < n; i++)
    {
        if (arr[i] == target)
        {
            return i;
        }
    }
    return -1;  // not found
}
```

Works on any array, sorted or not. But slow for large arrays.

### Binary Search — O(log n)

Only works on a **sorted** array. Repeatedly check the middle element, and eliminate half the remaining elements each time.

```c
int binary_search(int arr[], int low, int high, int target)
{
    if (low > high)
    {
        return -1;  // not found
    }

    int mid = (low + high) / 2;

    if (arr[mid] == target)
    {
        return mid;
    }
    else if (arr[mid] < target)
    {
        return binary_search(arr, mid + 1, high, target);
    }
    else
    {
        return binary_search(arr, low, mid - 1, target);
    }
}
```

**Why it's fast:** Every comparison cuts the search space in half. A million elements? You only need about 20 comparisons (log₂ 1,000,000 ≈ 20).

---

## 4. Sorting algorithms

### Bubble Sort — O(n²)

Repeatedly compare adjacent pairs and swap them if they're out of order. After each full pass, the largest unsorted element "bubbles up" to its correct spot.

```c
void bubble_sort(int arr[], int n)
{
    for (int i = 0; i < n - 1; i++)
    {
        for (int j = 0; j < n - i - 1; j++)
        {
            if (arr[j] > arr[j + 1])
            {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}
```

Simple to understand, but slow for large lists.

### Selection Sort — O(n²)

Find the smallest element in the unsorted part, swap it to the front. Repeat for the rest.

```c
void selection_sort(int arr[], int n)
{
    for (int i = 0; i < n - 1; i++)
    {
        int min_index = i;
        for (int j = i + 1; j < n; j++)
        {
            if (arr[j] < arr[min_index])
            {
                min_index = j;
            }
        }
        int temp = arr[i];
        arr[i] = arr[min_index];
        arr[min_index] = temp;
    }
}
```

### Merge Sort — O(n log n)

A **divide and conquer** algorithm — much faster than the two above for large inputs.

1. Split the array in half
2. Recursively sort each half
3. Merge the two sorted halves back together

```c
void merge_sort(int arr[], int left, int right)
{
    if (left < right)
    {
        int mid = (left + right) / 2;
        merge_sort(arr, left, mid);
        merge_sort(arr, mid + 1, right);
        merge(arr, left, mid, right);  // combine the two sorted halves
    }
}
```

**Why it's faster:** Splitting the problem in half each time (log n levels), and merging takes n steps at each level, giving n log n total.

---

## 5. Recursion — functions that call themselves

A recursive function solves a problem by breaking it into a smaller version of the same problem, until it hits a **base case** (the point where it stops).

```c
int factorial(int n)
{
    if (n == 0)          // base case — stops the recursion
    {
        return 1;
    }
    return n * factorial(n - 1);   // recursive case — smaller version of the problem
}
```

Both **binary search** and **merge sort** above are recursive — that's the pattern to notice this week.

**Two things every recursive function needs:**
- A **base case** that stops the recursion (otherwise: infinite recursion → stack overflow, connects back to what we learned about the stack in Week 4)
- A **recursive case** that moves closer to the base case with each call

---

## 6. Putting it together — how to pick an algorithm

| Situation | Good choice |
|---|---|
| Array isn't sorted, one-time search | Linear search |
| Array is sorted, searching often | Binary search |
| Small list, simplicity matters more than speed | Bubble/Selection sort |
| Large list, speed matters | Merge sort |

The general lesson: **sorting first can make searching much faster later** — sorting costs O(n log n) once, but then every search only costs O(log n) instead of O(n).

---

## Quick Recap Cheatsheet (for revision)

- Big O = worst case, Big Omega = best case, Big Theta = both are equal
- Linear search: O(n), works on unsorted data
- Binary search: O(log n), needs sorted data, cuts search space in half each time
- Bubble/Selection sort: O(n²), simple but slow
- Merge sort: O(n log n), divide and conquer, much faster for large inputs
- Recursion needs a base case + a recursive case that moves toward it
- Sorting once often makes many future searches cheaper overall

---

