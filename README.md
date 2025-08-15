# MaxHeap 

This repo hosts:

* **`library/` — the star of the show**
  A max-heap package that mirrors Python’s `heapq` API but **max-first**, with a C accelerator and a pure-Python fallback. Published on PyPI as **`maxheapx`** (import name **`maxheap`**).

* **`website/` — the minimal docs & landing page**
  A Next.js site with usage examples, version history, and links back to PyPI/GitHub.

---

## What you probably want (the library)

* **Install (from PyPI):**

  ```bash
  pip install maxheapx
  ```

  Then:

  ```python
  import maxheap as heapq
  ```

* **Why this exists:**
  Python’s `heapq` is min-heap only; the common “max-heap via negation” trick is awkward (and breaks for non-numeric types). This library is **max-first** by design.

* **Performance (median vs `heapq`+negation, N=100k, repeat=10):**

  * `heappush`: \~**+19%**
  * `heapify`: \~**+28%**
  * `heapify + drain`: \~**+41%**
    (C accelerator enabled by default; seamless Python fallback.)

* **Docs & full details:**
   **[Library README](https://github.com/timothyroch/maxheap/tree/main/library#readme)**

---

## Repo layout

```
.
├── library/          # Python package (maxheap / maxheapx on PyPI)
│   ├── src/maxheap/  # _core.py (Python), _cmaxheap.c (C extension), __init__.py (fallback)
│   ├── benchmarks/   # Microbench harness (CSV output)
│   └── tests/        # Unit + property tests (pytest + hypothesis)
└── website/          # Next.js frontend (docs/landing)
    └── app/          # Pages (/, /docs, /license)
```

---

## Quick dev workflow

### Library

```bash
cd library
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -U pip
pip install -e .                                    # builds C ext in editable mode
pip install -q pytest hypothesis
pytest -q                                           # run tests

# Benchmarks
python benchmarks/bench_maxheap.py --n 100000 --repeat 10 --warmup 3 --seed 1 \
  --csv benchmarks/results.csv
```

### Website

```bash
cd website
npm install
npm run dev     # http://localhost:3000
```

More about the site:  **[Website README](https://github.com/timothyroch/maxheap/tree/main/website)**

---

## Links

* PyPI: [https://pypi.org/project/maxheapx/](https://pypi.org/project/maxheapx/)
* Source (library): [https://github.com/timothyroch/maxheap/tree/main/library](https://github.com/timothyroch/maxheap/tree/main/library)
* Site: deployed from `website/` (see its README)

---

## License

MIT © 2025 Timothy Roch. See [`LICENSE`](https://github.com/timothyroch/maxheap/blob/main/LICENSE) for details.
