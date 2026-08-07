# CS50 Week 7: SQL 

> Reference: https://cs50.harvard.edu/x/weeks/7/

The big idea of this week: **instead of storing data in memory (arrays, lists, dictionaries) that disappears when your program ends, you store it in a database — persistent, structured, and queryable with its own language, SQL.** This week is about tables, and a language designed specifically to ask questions of them.

---

## 1. Why databases instead of just... files?

You could store data in a CSV or a text file, but you'd have to write your own code to search, filter, sort, and update it every time. A database (like SQLite, which CS50 uses) does all of that for you, and does it fast — even with millions of rows.

**Key idea:** data lives in **tables** (rows and columns), and you interact with it using **SQL** (Structured Query Language) instead of writing loops yourself.

---

## 2. Creating a table

```sql
CREATE TABLE trades (
    id INTEGER,
    symbol TEXT NOT NULL,
    entry_price NUMERIC NOT NULL,
    exit_price NUMERIC,
    pnl NUMERIC,
    PRIMARY KEY(id)
);
```

Column types in SQLite:

| Type | Stores |
|---|---|
| `TEXT` | strings |
| `INTEGER` | whole numbers |
| `NUMERIC` | numbers, including decimals |
| `BLOB` | raw binary data |

`PRIMARY KEY` marks the column that uniquely identifies each row — like an ID that never repeats.

---

## 3. CRUD — the four things you do with data

**C**reate, **R**ead, **U**pdate, **D**elete. Every database interaction is one of these four.

### Create — `INSERT`

```sql
INSERT INTO trades (symbol, entry_price, exit_price, pnl)
VALUES ('XAUUSD', 2350.50, 2365.00, 145.00);
```

### Read — `SELECT`

```sql
SELECT * FROM trades;                          -- everything
SELECT symbol, pnl FROM trades;                 -- specific columns
SELECT * FROM trades WHERE pnl > 0;             -- filter rows
SELECT * FROM trades ORDER BY pnl DESC;         -- sort
SELECT * FROM trades LIMIT 10;                  -- cap the results
```

### Update — `UPDATE`

```sql
UPDATE trades
SET exit_price = 2370.00, pnl = 195.00
WHERE id = 3;
```

**Always use `WHERE`** with `UPDATE`/`DELETE` — without it, the change applies to every row in the table.

### Delete — `DELETE`

```sql
DELETE FROM trades WHERE id = 3;
```

---

## 4. Filtering with `WHERE`

```sql
SELECT * FROM trades WHERE symbol = 'XAUUSD';
SELECT * FROM trades WHERE pnl > 0 AND symbol = 'XAUUSD';
SELECT * FROM trades WHERE symbol IN ('XAUUSD', 'NAS100');
SELECT * FROM trades WHERE entry_price BETWEEN 2300 AND 2400;
SELECT * FROM trades WHERE symbol LIKE 'XAU%';   -- % is a wildcard
```

---

## 5. Aggregate functions — summarizing data

```sql
SELECT COUNT(*) FROM trades;                    -- how many rows
SELECT AVG(pnl) FROM trades;                     -- average
SELECT SUM(pnl) FROM trades;                     -- total
SELECT MAX(pnl) FROM trades;                     -- best trade
SELECT MIN(pnl) FROM trades;                     -- worst trade
```

Combine with `GROUP BY` to summarize per category:

```sql
SELECT symbol, AVG(pnl), COUNT(*)
FROM trades
GROUP BY symbol;
```

This gives you average P&L and trade count, per symbol, in one query — this is basically what a trading journal's stats page is doing behind the scenes.

---

## 6. Multiple tables and JOINs

Real databases split data across multiple tables to avoid repeating information. For example, instead of storing a full user's info on every single trade row, you'd store a `user_id` and link it to a separate `users` table.

```sql
CREATE TABLE users (
    id INTEGER,
    username TEXT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE trades (
    id INTEGER,
    user_id INTEGER,
    symbol TEXT NOT NULL,
    pnl NUMERIC,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);
```

A `FOREIGN KEY` links a column in one table to the primary key of another — this is how tables relate to each other ("relational" database).

To pull data across both tables at once, use `JOIN`:

```sql
SELECT users.username, trades.symbol, trades.pnl
FROM trades
JOIN users ON trades.user_id = users.id;
```

This is exactly the shape of what's happening under the hood in something like TradeBook with Supabase — a `trades` table linked to a `users` table by `user_id`.

---

## 7. Indexes — making queries faster

Without an index, SQLite has to scan every row to find a match (like linear search from Week 3). An index lets it jump straight to matching rows (closer to binary search speed).

```sql
CREATE INDEX symbol_index ON trades (symbol);
```

**Trade-off:** indexes speed up reads, but slightly slow down writes (since the index also needs updating on every `INSERT`/`UPDATE`). Worth it on columns you filter/search by often.

---

## 8. Two things that always come up: NULL and race conditions

- **`NULL`** means "no value," not zero or empty string. `exit_price` on an open trade would be `NULL` until the trade closes. Comparisons need `IS NULL` / `IS NOT NULL`, not `= NULL`.
- **Race conditions** — if two things try to read-then-write the same row at the same time (like two people trying to buy the last item in stock), you can get incorrect results unless you handle it carefully (e.g. using a transaction).

---

## 9. SQL injection — a security concept worth knowing

If you build SQL queries by directly pasting in user input as text, a malicious user could inject their own SQL and manipulate your database.

```python
# Dangerous — never do this
query = f"SELECT * FROM users WHERE username = '{username}'"
```

Instead, use placeholders so the database library escapes the input safely:

```python
db.execute("SELECT * FROM users WHERE username = ?", username)
```

This matters the moment you connect any real app (like TradeBook) to a database that takes user input.

---

## Quick Recap Cheatsheet (for revision)

- CRUD = Create (`INSERT`), Read (`SELECT`), Update (`UPDATE`), Delete (`DELETE`)
- Always pair `UPDATE`/`DELETE` with `WHERE`, or it affects every row
- Aggregate functions (`COUNT`, `AVG`, `SUM`, `MAX`, `MIN`) + `GROUP BY` = summary stats per category
- `FOREIGN KEY` links tables together; `JOIN` pulls related data across them
- Indexes speed up searches but slightly slow down writes
- `NULL` means "no value" — use `IS NULL`, not `= NULL`
- Never build queries with raw string concatenation of user input — always use placeholders to avoid SQL injection

---
