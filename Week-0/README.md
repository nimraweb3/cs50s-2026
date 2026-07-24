# CS50 Week 0: Scratch

> Reference: https://cs50.harvard.edu/x/weeks/0/

The big idea of this week: **before writing a single line of text-based code, you learn to think like a programmer using drag-and-drop blocks.** Scratch strips away syntax (semicolons, brackets, typos) so you can focus purely on the *logic* — sequence, conditionals, loops, variables, events. Every one of these ideas shows up again later in C, and honestly, in Solidity too.

---

## 1. What is Scratch, and why start here?

Scratch is a visual programming language made by MIT Media Lab. Instead of typing commands, you snap together colored blocks like puzzle pieces. No syntax errors possible — if a block fits, it's valid.

**Why CS50 starts here:** the hardest part of learning to code isn't memorizing syntax, it's learning to break a problem into logical steps. Scratch lets you practice that skill without fighting a compiler at the same time.

---

## 2. Core building blocks — and how they map to real trading/dev logic

### Sequence

Blocks run top to bottom, one after another — just like reading your trade checklist step by step before entering a position.

```
when green flag clicked
move 10 steps
turn 15 degrees
say "Hello!"
```

### Events

A script waits for something to happen before it runs — the "trigger."

```
when [space key] pressed
```

Think of this like a **price alert**: nothing happens until price hits your level, then the action fires. In Solidity later, this is basically the same idea as an event/trigger firing on-chain.

### Loops

Repeat a set of blocks instead of copy-pasting them.

```
repeat 10
    move 10 steps
    turn 36 degrees
```

Or `forever`, which repeats endlessly until stopped — like a script that keeps checking "has price hit my killzone yet?" over and over.

### Conditionals

"If this, then that" — decision-making.

```
if <touching edge?> then
    turn 180 degrees
```

This is exactly the logic of a trading rule: **if price sweeps liquidity and forms an FVG, then look for entry.** Same shape, different domain.

### Variables

A named box that stores a value that can change.

```
set [score] to 0
change [score] by 1
```

Think of a variable like your **account balance** or **risk per trade** — it starts at some value and updates as things happen.

### Boolean expressions

Questions with a yes/no (true/false) answer, used inside conditionals.

```
<touching [Sprite2]?>
<mouse x> > 0
```

Same as checking "is price above the 8-9am opening range high? yes/no."

---

## 3. Threads — things happening at the same time

Scratch projects usually have multiple sprites, each running their own scripts simultaneously. This is your first taste of **concurrency** — several things happening "at once," each independently reacting to events.

Good way to picture it: imagine running two EAs on MT5 at the same time, one watching XAUUSD and one watching NAS100 — each one is its own independent "thread," reacting to its own triggers, without waiting for the other.

---

## 4. Functions (in Scratch, called "custom blocks")

Instead of repeating the same group of blocks everywhere, you can package them into a reusable custom block — just like a function.

```
define [jump]
    change y by 10
    wait 0.5 seconds
    change y by -10
```

This is the same instinct as writing a reusable indicator or a reusable Pine Script function — build it once, call it from anywhere in your project.

---

## 5. Design thinking Scratch teaches

- **Break the problem down** before you start snapping blocks — what's the smallest first step?
- **Test early, test often** — run your script after every small change, don't build the whole thing blind and hope it works
- **Debug visually** — you can literally watch the sprite move wrong and see exactly which block misbehaved. (This is the training-wheels version of `printf` debugging and `debug50` you'll use starting Week 1.)

---

## Quick Recap Cheatsheet (for revision)

| Scratch concept | What it teaches | Real-world parallel for you |
|---|---|---|
| Sequence | Code runs top to bottom | Your trade execution checklist |
| Events | Wait for a trigger, then act | A price alert firing |
| Loops | Repeat instead of duplicating | An EA checking conditions every tick |
| Conditionals | If X, then Y | "If liquidity sweep + FVG, then entry" |
| Variables | A value that can change | Account balance, risk %, PnL |
| Boolean expressions | Yes/no questions | "Is price above the OR high?" |
| Threads | Multiple things happening at once | Two EAs running on two pairs simultaneously |
| Custom blocks | Reusable packaged logic | A reusable indicator/function |

The real takeaway from Week 0: **programming is just precisely describing a process you already understand intuitively.** You already think in "if this happens, then I do that" every time you trade — Scratch just makes you formalize it into blocks before C makes you formalize it into syntax.

---

