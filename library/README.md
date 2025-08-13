# maxheap

A **max-heap** library with an API that mirrors Python’s `heapq`—but **max-first**.
It ships with a fast **C accelerator** (`maxheap._cmaxheap`) and a **pure-Python fallback**.

* Python: 3.9–3.13
* License: MIT
* Package name: `maxheap`

---

## Features

* Functional API: `heapify`, `heappush`, `heappop`, `heappushpop`, `heapreplace`, `peek`, `is_heap`
* OO wrapper: `MaxHeap` with `push/pop/peek/replace/pushpop`
* Optional C extension for speed; pure-Python fallback if unavailable
* Reproducible **microbenchmarks** with CSV output
* Test suite (`pytest`) including property tests

---

## Quickstart (from a fresh clone)

> **Run all commands from the project root** (the folder that contains `pyproject.toml`).

### macOS/Linux (bash/zsh)

```bash
# 0) Verify you're in the repo root
pwd
ls pyproject.toml

# 1) Create a clean virtualenv
python3 -m venv .venv

# 2) Activate it
source .venv/bin/activate

# 3) Confirm it's active & valid
echo "VIRTUAL_ENV=$VIRTUAL_ENV"
test -x .venv/bin/python && echo "venv OK" || echo "venv MISSING"
python -V

# 4) Install in editable mode (builds the C extension)
python -m pip install -U pip setuptools wheel
python -m pip install -e .

# 5) Sanity check the extension is loaded
python - <<'PY'
import maxheap, sys
print("HAVE_CEXT:", getattr(maxheap, "_HAVE_CEXT", None))
print("heapify impl:", maxheap.heapify.__module__)
print("python:", sys.version)
PY
```

Expected:

```
HAVE_CEXT: True
heapify impl: maxheap._cmaxheap
python: 3.13.x (...)
```

If `HAVE_CEXT` is `False`, you’re using the pure-Python fallback.

### Windows (PowerShell)

```powershell
# 0) Verify you're in the repo root
Get-ChildItem pyproject.toml

# 1) Create a venv
py -m venv .venv

# 2) Activate
. .\.venv\Scripts\Activate.ps1

# 3) Install (use -m to ensure the venv's Python)
python -m pip install -U pip setuptools wheel
python -m pip install -e .

# 4) Sanity
python - <<'PY'
import maxheap, sys
print("HAVE_CEXT:", getattr(maxheap, "_HAVE_CEXT", None))
print("heapify impl:", maxheap.heapify.__module__)
print("python:", sys.version)
PY
```

---

## Rebuilding after C changes

Any time you modify `src/maxheap/_cmaxheap.c`, rebuild:

```bash
# inside the activated venv
rm -rf build
python -m pip install -e .
```

---


## Usage

The API mirrors Python’s built-in [`heapq`](https://docs.python.org/3/library/heapq.html) — but instead of a min-heap that requires negating keys for max-first behavior, **`maxheap` stores the largest element at index `0`** and operates directly without the negation overhead.

You can choose between a **functional API** (works on plain lists) and an **OO wrapper** (`MaxHeap` class).

---

### Functional API

```python
import maxheap as heapq  # same API names as heapq

# Start with an empty list
h = []

# Push elements
heapq.heappush(h, 3)
heapq.heappush(h, 10)
heapq.heappush(h, 5)

# Peek at the largest without removing it
heapq.peek(h)             # -> 10

# Pop the largest
heapq.heappop(h)          # -> 10
heapq.peek(h)             # -> 5

# Replace the largest atomically
heapq.heapreplace(h, 4)   # pops max (5), pushes 4 -> returns 5

# Push an element and pop the largest in a single step
heapq.heappushpop(h, 7)   # pushes 7, pops max -> returns 7

# Turn any list into a valid max-heap in place
data = [1, 8, 3, 2]
heapq.heapify(data)       # data is now a valid max-heap
```

**When to use:**

* You want to use the `heapq`-style API but without the min-heap + negation hack.
* You don’t need to subclass or wrap the heap in your own object.

---

### OO wrapper

```python
from maxheap import MaxHeap

# Initialize from iterable
h = MaxHeap([3, 1, 6, 5, 2, 4])

# Push and pop
h.push(10)
h.peek()   # -> 10
h.pop()    # -> 10

# Length and iteration
len(h)     # -> 6
list(h)    # Pops all items in descending order

# Check if a list is a valid max-heap
MaxHeap.is_heap([10, 5, 6, 2])   # True
```

**When to use:**

* You want an object that *owns* its heap data.
* You want utility methods (`peek`, `is_heap`, iteration) with clean semantics.

---

**Tip:** All hot-path operations (`heapify`, `heappush`, `heappop`, `heappushpop`, `heapreplace`) are C-accelerated — so you get **max-heap behavior faster than `heapq` with negation**.

---

## Running the tests

```bash
# ensure venv is active and package is installed
source .venv/bin/activate  # Windows: .venv\Scripts\activate
python -m pip install -e .
python -m pip install -q pytest hypothesis
python -m pytest -q
```

You should see all tests green (`tests/test_maxheap.py`, `tests/test_properties.py`).

---

## Benchmarks

The benchmark compares `maxheap` with a **baseline** using stdlib `heapq` as a max-heap via negation (`-x`).

### Quick run

```bash
python benchmarks/bench_maxheap.py
```

### Larger run + CSV output

```bash
mkdir -p benchmarks
python benchmarks/bench_maxheap.py --n 100000 --repeat 10 --warmup 3 --seed 1 \
  --csv benchmarks/results.csv
head benchmarks/results.csv
```

**CLI flags**

* `--n` (default `10000`) — number of items
* `--repeat` (default `5`) — measured iterations per case
* `--warmup` (default `1`) — warmup runs
* `--seed` (default `1337`) — RNG seed
* `--csv` — write a results CSV

**Benchmarks covered**

* `heappush`
* `heapify`
* `heapify+drain` (heapify then pop all)
* `heappushpop`
* `heapreplace`

**Interpreting output**

Each line prints `min / median / mean`. When a baseline exists (the negation variant), a `%` indicates **median** speedup (positive = faster than baseline).

---

## A/B: Force the pure-Python fallback (optional)

If you want to compare C vs Python on your machine, temporarily let the package respect an env var:

```python
# top of src/maxheap/__init__.py
import os
try:
    if os.getenv("MAXHEAP_PURE"):
        raise ImportError
    from ._cmaxheap import heapify, heappush, heappop, heappushpop, heapreplace  # type: ignore
    _HAVE_CEXT = True
except Exception:
    from ._core import heapify, heappush, heappop, heappushpop, heapreplace
    _HAVE_CEXT = False
```

Then:

```bash
python -m pip install -e .
python benchmarks/bench_maxheap.py --csv benchmarks/results_cext.csv

MAXHEAP_PURE=1 python benchmarks/bench_maxheap.py --csv benchmarks/results_pure.csv
```

---

## Packaging (optional)

```bash
rm -rf dist
python -m build            # pip install build, if needed
python -m pip install -U twine
twine upload --repository testpypi dist/*
```

Fresh-venv verification:

```bash
python -m venv /tmp/venv && source /tmp/venv/bin/activate
python -m pip install -i https://test.pypi.org/simple/ maxheap
python - <<'PY'
import maxheap
print(maxheap._HAVE_CEXT, maxheap.heapify.__module__)
PY
```

---

## Project layout

```
.
├── benchmarks/
│   └── bench_maxheap.py     # microbenchmarks (CSV capable)
├── src/
│   └── maxheap/
│       ├── _cmaxheap.c      # C accelerator (optional)
│       ├── _core.py         # pure-Python implementation
│       └── __init__.py      # optional import of C ext, fallback to Python
├── tests/
│   ├── test_maxheap.py      # unit tests
│   └── test_properties.py   # property-based tests
├── pyproject.toml
└── README.md
```

---

## Troubleshooting

### “`.venv/bin/python: No such file or directory`” or prompt shows `(.venv)` but it’s broken

You’re in a shell with a **stale** venv path. Fix:

```bash
deactivate 2>/dev/null || true
rm -rf .venv build *.egg-info src/*.egg-info
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -U pip setuptools wheel
python -m pip install -e .
```

Check:

```bash
echo "$VIRTUAL_ENV"           # should point to .../maxheap/library/.venv
which python                  # should be .../maxheap/library/.venv/bin/python
```

### “`ModuleNotFoundError: No module named 'maxheap'`”

* Ensure you ran `python -m pip install -e .` in the **repo root**.
* Ensure tests are run with the **same venv**:

  ```bash
  python -m pytest -q
  ```
* Confirm where `maxheap` is imported from:

  ```bash
  python - <<'PY'
  ```

import maxheap, os
print(os.path.dirname(maxheap.**file**))
PY

````

### Rebuild didn’t pick up code changes

Remove build artifacts and reinstall:

```bash
rm -rf build
python -m pip install -e .
````

---

## API reference (quick)

```python
# functional API
heapify(x: List[T]) -> None
heappush(heap: List[T], item: T) -> None
heappop(heap: List[T]) -> T
heappushpop(heap: List[T], item: T) -> T
heapreplace(heap: List[T], item: T) -> T
peek(heap: List[T]) -> T
is_heap(x: List[T]) -> bool

# OO wrapper
class MaxHeap(Generic[T]):
    def __init__(self, iterable: Optional[Iterable[T]] = None) -> None: ...
    def push(self, item: T) -> None: ...
    def pop(self) -> T: ...
    def peek(self) -> T: ...
    def replace(self, item: T) -> T: ...
    def pushpop(self, item: T) -> T: ...
    def heap(self) -> List[T]: ...
    def __len__(self) -> int: ...
```

---


## Notes on performance

* The accelerator focuses on the hot operations that do comparisons and pointer moves (`heapify`, `heappush`, `heappop`, `heappushpop`, `heapreplace`).
* `peek`, `is_heap`, and the `MaxHeap` wrapper remain in Python—these aren’t hot in typical workloads, and keeping them in Python preserves readability.

### Benchmark highlights

| operation               | median time (s) | speedup vs `heapq`+negation |
| ----------------------- | --------------- | --------------------------- |
| heappush (maxheap)      | 0.00535         | \~19% faster                |
| heapify (maxheap)       | 0.00349         | \~28% faster                |
| heapify+drain (maxheap) | 0.04043         | \~41% faster                |

**Result:** Max-first heap without the negation hack, and *still* beating the pants off `heapq`.

---


## Contributing

* Format/lint: `ruff` (see `pyproject.toml`)
* Types: `mypy` (strict options)
* Tests: `pytest`, property tests via `hypothesis`

PRs and issues welcome!
