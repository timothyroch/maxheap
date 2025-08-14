import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";
import ThemeToggle from "@/components/ThemeToggle";

export default function DocsPage() {
  // Distribution vs import names:
  // - pip install name: maxheapx
  // - Python import name: maxheap
  const installName = "maxheapx";
  const importName = "maxheap";
  const pypiUrl = `https://pypi.org/project/${installName}/`;
  const githubUrl = "https://github.com/timothyroch/maxheap/tree/main/library"; 

  const codeQuickstart = `import ${importName} as heapq

# functional API on a plain list
h = []
heapq.heappush(h, 10)
heapq.heappush(h, 3)
heapq.heappush(h, 42)

print(heapq.peek(h))     # 42
print(heapq.heappop(h))  # 42
print(h)                 # still a valid max-heap`;

  const codeOO = `from ${importName} import MaxHeap

h = MaxHeap([3, 1, 6, 5, 2, 4])
h.push(7)
print(h.peek())  # 7
print(h.pop())   # 7
print(len(h))    # 6`;

  const codeTuples = `import ${importName} as heapq

# (priority, value) — highest priority first
tasks = []
heapq.heappush(tasks, (10, "render"))
heapq.heappush(tasks, (5, "fetch"))
heapq.heappush(tasks, (42, "compile"))

while tasks:
    prio, name = heapq.heappop(tasks)
    print(prio, name)  # 42 compile, 10 render, 5 fetch`;

  const codeCustomType = `import ${importName} as heapq

# Custom objects must be totally ordered (define <, <=, >)
class Job:
    __slots__ = ("deadline", "name")
    def __init__(self, deadline: int, name: str):
        self.deadline = deadline
        self.name = name
    # "larger" deadline should come out first
    def __lt__(self, other): return self.deadline < other.deadline
    def __le__(self, other): return self.deadline <= other.deadline
    def __gt__(self, other): return self.deadline > other.deadline

h = []
heapq.heappush(h, Job(10, "A"))
heapq.heappush(h, Job(3, "B"))
heapq.heappush(h, Job(42, "C"))
print(heapq.heappop(h).name)  # C`;

  const codeTopK = `import ${importName} as heapq

def top_k(iterable, k):
    h = []
    for x in iterable:
        if len(h) < k:
            heapq.heappush(h, x)
        else:
            # Keep only the largest k overall
            if x > h[0]:
                heapq.heapreplace(h, x)
    # Drain as descending order
    return [heapq.heappop(h) for _ in range(len(h))]

print(top_k([7, 2, 9, 4, 1, 8], 3))  # [9, 8, 7]`;

  const codeKthLargest = `import ${importName} as heapq

def kth_largest(nums, k):
    nums = list(nums)
    heapq.heapify(nums)
    for _ in range(k - 1):
        heapq.heappop(nums)
    return heapq.heappop(nums)

print(kth_largest([3, 2, 1, 5, 6, 4], 2))  # 5`;

  const codeSlidingWindowMax = `import ${importName} as heapq

def max_sliding_window(nums, k):
    h = []
    res = []
    # seed
    for i in range(k):
        heapq.heappush(h, (nums[i], i))
    res.append(heapq.peek(h)[0])

    for i in range(k, len(nums)):
        heapq.heappush(h, (nums[i], i))
        # drop indices that left window
        while h and heapq.peek(h)[1] <= i - k:
            heapq.heappop(h)
        res.append(heapq.peek(h)[0])
    return res

print(max_sliding_window([1,3,-1,-3,5,3,6,7], 3))  # [3,3,5,5,6,7]`;

  const codeBenchHarness = `"""
Microbenchmarks comparing maxheap (max-first) vs heapq+negation baseline.
Run directly with: python bench_maxheap.py
"""
import time, random, statistics, platform
import ${importName} as mh
import heapq as q

def run(n=100_000, repeat=5, seed=1337):
    rnd = random.Random(seed)
    xs = [rnd.randint(0, 10**6) for _ in range(n)]

    def timeit(fn):
        ts = []
        for _ in range(repeat):
            t0 = time.perf_counter()
            fn()
            ts.append(time.perf_counter() - t0)
        return {"min": min(ts), "median": statistics.median(ts), "mean": statistics.fmean(ts)}

    # heappush
    r_push_mh = timeit(lambda: [mh.heappush([], x) for x in xs])
    r_push_qn = timeit(lambda: [q.heappush([], -x) for x in xs])

    # heapify
    r_hf_mh  = timeit(lambda: mh.heapify(list(xs)))
    r_hf_qn  = timeit(lambda: q.heapify([-x for x in xs]))

    # heapify+drain
    def drain_mh():
        h = list(xs); mh.heapify(h)
        for _ in range(len(h)):
            mh.heappop(h)
    def drain_qn():
        h = [-x for x in xs]; q.heapify(h)
        for _ in range(len(h)):
            q.heappop(h)
    r_dr_mh = timeit(drain_mh)
    r_dr_qn = timeit(drain_qn)

    def pct(better, baseline): return (baseline - better) / baseline * 100.0

    print(f"Python {platform.python_version()} on {platform.system()} {platform.machine()}\\n")
    print(f"{'operation':<22} {'median (mh)':>12}  {'median (hq+neg)':>16}  {'speedup':>9}")
    print("-" * 65)
    print(f"{'heappush':<22} {r_push_mh['median']:.6f}s  {r_push_qn['median']:.6f}s  {pct(r_push_mh['median'], r_push_qn['median']):+6.1f}%")
    print(f"{'heapify':<22} {r_hf_mh['median']:.6f}s   {r_hf_qn['median']:.6f}s   {pct(r_hf_mh['median'], r_hf_qn['median']):+6.1f}%")
    print(f"{'heapify+drain':<22} {r_dr_mh['median']:.6f}s  {r_dr_qn['median']:.6f}s  {pct(r_dr_mh['median'], r_dr_qn['median']):+6.1f}%")

if __name__ == "__main__":
    run()`;

  const codeDetectCExt = `import ${importName}, sys
print("C extension loaded:", getattr(${importName}, "_HAVE_CEXT", None))
print("heapify impl:", ${importName}.heapify.__module__)
print("python:", sys.version)`;

  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-radial" />

      <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="font-semibold tracking-tight text-xl">{importName} · Documentation</div>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/10 transition">Home</Link>
          <Link href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/10 transition">GitHub</Link>
          <Link href={pypiUrl} target="_blank" rel="noopener noreferrer" className="text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/10 transition">PyPI</Link>
          <ThemeToggle />
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-6 pb-10 md:pb-16">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          {importName} — a drop-in <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-indigo-500">max-heap</span> for Python
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
          Mirrors the stdlib <code>heapq</code> API, but max-first. <strong>Optional C accelerator</strong> with pure-Python fallback, fully typed (PEP&nbsp;561), rigorously tested, <strong>zero runtime dependencies</strong>. Supports Python 3.9–3.13.
        </p>
      </section>

      {/* Main content */}
      <section className="max-w-6xl mx-auto px-6 pb-4">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-10">
            {/* Installation */}
            <article id="installation" className="scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">Installation</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3">Install from PyPI:</p>
              <CodeBlock code={`pip install ${installName}`} />
              <p className="mt-3 text-sm text-gray-500">
                Import as <code>{importName}</code>:
              </p>
              <CodeBlock code={`import ${importName} as heapq`} />
            </article>

            {/* Quickstart */}
            <article id="quickstart" className="scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">Quickstart</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Use the functional API on a plain list, just like <code>heapq</code>.
              </p>
              <CodeBlock code={codeQuickstart} />
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Object-oriented wrapper</h3>
                <CodeBlock code={codeOO} />
              </div>
            </article>

            {/* Advanced usage */}
            <article id="advanced" className="scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">Advanced usage</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                  <div className="font-semibold">Tuples as priorities</div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Tuples compare lexicographically. Put the priority first to get highest-priority first.
                  </p>
                  <div className="mt-3"><CodeBlock code={codeTuples} /></div>
                </div>
                <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                  <div className="font-semibold">Custom comparable objects</div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Provide <code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code> so items are totally ordered.
                  </p>
                  <div className="mt-3"><CodeBlock code={codeCustomType} /></div>
                </div>
              </div>
            </article>

            {/* Recipes */}
            <article id="recipes" className="scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">Recipes</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">Top-K items</h3>
                  <CodeBlock code={codeTopK} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Kth largest element</h3>
                  <CodeBlock code={codeKthLargest} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Sliding window maximum</h3>
                  <CodeBlock code={codeSlidingWindowMax} />
                </div>
              </div>
            </article>

            {/* Benchmarks */}
            <article id="benchmarks" className="scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">Benchmarks</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Microbenchmarks comparing <code>{importName}</code> to the typical <code>heapq</code> “max-heap via negation” workaround show consistent wins for common operations on our machines.
                Results vary by hardware, Python version, and data distribution — measure on your workload.
              </p>
              <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm">
                <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                  <div className="font-semibold">heappush</div>
                  <div className="text-gray-600 dark:text-gray-300 mt-1">~19% faster vs heapq+negation (median, N=100k, repeat=10)</div>
                </div>
                <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                  <div className="font-semibold">heapify</div>
                  <div className="text-gray-600 dark:text-gray-300 mt-1">~28% faster (median, N=100k, repeat=10)</div>
                </div>
                <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                  <div className="font-semibold">heapify + drain</div>
                  <div className="text-gray-600 dark:text-gray-300 mt-1">~41% faster (median, N=100k, repeat=10)</div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Run the microbench harness yourself</h3>
                <CodeBlock code={codeBenchHarness} />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Tip: Pin CPU governor, close background apps, and use multiple repeats to reduce noise.
              </div>
            </article>

            {/* API reference */}
            <article id="api" className="scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">API Reference</h2>
              <div className="space-y-8">
                <section>
                  <h3 className="text-xl font-semibold">Functional API</h3>
                  <div className="mt-3 grid gap-4">
                    <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                      <div className="font-semibold">heapify(x: list[T]) -&gt; None</div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">Transform list <code>x</code> into a max-heap, in place. <span className="font-mono">O(n)</span>.</p>
                    </div>
                    <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                      <div className="font-semibold">heappush(heap: list[T], item: T) -&gt; None</div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">Push <code>item</code> onto <code>heap</code>. <span className="font-mono">O(log n)</span>.</p>
                    </div>
                    <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                      <div className="font-semibold">heappop(heap: list[T]) -&gt; T</div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">Pop and return the largest item. <span className="font-mono">O(log n)</span>. Raises <code>IndexError</code> on empty heaps.</p>
                    </div>
                    <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                      <div className="font-semibold">heappushpop(heap: list[T], item: T) -&gt; T</div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">Push then pop in one step. Returns the previous max if <code>item</code> is smaller; otherwise returns <code>item</code>. <span className="font-mono">O(log n)</span>.</p>
                    </div>
                    <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                      <div className="font-semibold">heapreplace(heap: list[T], item: T) -&gt; T</div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">Pop max then push <code>item</code> atomically. <span className="font-mono">O(log n)</span>. Raises <code>IndexError</code> on empty heaps.</p>
                    </div>
                    <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                      <div className="font-semibold">peek(heap: list[T]) -&gt; T</div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">Return the largest element without removing it. <span className="font-mono">O(1)</span>. Raises <code>IndexError</code> on empty heaps.</p>
                    </div>
                    <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                      <div className="font-semibold">is_heap(x: list[T]) -&gt; bool</div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">Validate the max-heap property (helpful for debugging/tests).</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold">Class API — <span className="font-mono">MaxHeap</span></h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">A convenience wrapper around the functional API.</p>
                  <CodeBlock
                    code={`from ${importName} import MaxHeap

h = MaxHeap([3, 1, 6, 5, 2, 4])
h.push(10)
top = h.pushpop(7)      # push, then pop and return the largest
old = h.replace(4)      # pop current max, push 4
print(top, old, h.peek())`}
                  />
                  <ul className="mt-3 list-disc list-inside text-gray-600 dark:text-gray-300">
                    <li><code>push(item)</code>, <code>pop()</code>, <code>peek()</code>, <code>replace(item)</code>, <code>pushpop(item)</code></li>
                    <li><code>heap()</code> returns the underlying list (mutating it affects the heap).</li>
                    <li><code>__len__</code> / <code>__bool__</code> behave as expected.</li>
                  </ul>
                </section>
              </div>
            </article>

            {/* Design & Semantics */}
            <article id="design" className="scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">Design & semantics</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                  <div className="font-semibold">Ordering</div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Items must be totally ordered (<code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code>). For complex types, implement rich comparisons or wrap values with a key object.
                  </p>
                </div>
                <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                  <div className="font-semibold">Complexity</div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    <code>heapify</code> is <span className="font-mono">O(n)</span>; push/pop/replace are <span className="font-mono">O(log n)</span>; <code>peek</code> is <span className="font-mono">O(1)</span>.
                  </p>
                </div>
                <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                  <div className="font-semibold">Errors</div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    <code>heappop</code>, <code>peek</code>, and <code>heapreplace</code> raise <code>IndexError</code> on empty heaps.
                  </p>
                </div>
                <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                  <div className="font-semibold">Implementation</div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Hot paths (<code>heapify</code>, <code>heappush</code>, <code>heappop</code>, <code>heappushpop</code>, <code>heapreplace</code>) are <strong>C-accelerated</strong> when available; otherwise a pure-Python fallback is used automatically.
                  </p>
                </div>
              </div>
            </article>

            {/* Environment / Diagnostics */}
            <article id="diagnostics" className="scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">Diagnostics</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Verify that the C extension is active:
              </p>
              <CodeBlock code={codeDetectCExt} />
            </article>

            {/* FAQ */}
            <article id="faq" className="scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">FAQ</h2>
              <div className="space-y-4">
                <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                  <div className="font-semibold">How is this different from <code>heapq</code>?</div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    <code>heapq</code> is a min-heap. You can simulate a max-heap by negating numbers, but that’s awkward for non-numeric types and adds overhead. <code>{importName}</code> is max-first by design, with a C accelerator for speed.
                  </p>
                </div>
                <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                  <div className="font-semibold">What Python versions are supported?</div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Python 3.9–3.13 (typed; zero runtime deps). The wheel bundles a compiled extension where available; otherwise it builds from sdist.
                  </p>
                </div>
                <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                  <div className="font-semibold">Can I still use the list directly?</div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Yes. The heap is just a Python list. Mutating it directly can break the invariant; use the API or call <code>heapify</code> after manual edits.
                  </p>
                </div>
              </div>
            </article>

            {/* Links */}
            <article id="links" className="scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">Links</h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                <li><Link className="underline" href={pypiUrl} target="_blank">PyPI — {installName}</Link></li>
                <li><Link className="underline" href={githubUrl} target="_blank">GitHub repository</Link></li>
                <li><Link className="underline" href="/LICENSE" target="_blank">License (MIT)</Link></li>
              </ul>
            </article>
          </div>

          {/* On-page nav */}
          <aside className="md:sticky md:top-6 h-fit md:col-span-1">
            <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
              <div className="font-semibold mb-2">On this page</div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li><a className="hover:underline" href="#installation">Installation</a></li>
                <li><a className="hover:underline" href="#quickstart">Quickstart</a></li>
                <li><a className="hover:underline" href="#advanced">Advanced usage</a></li>
                <li><a className="hover:underline" href="#recipes">Recipes</a></li>
                <li><a className="hover:underline" href="#benchmarks">Benchmarks</a></li>
                <li><a className="hover:underline" href="#api">API Reference</a></li>
                <li><a className="hover:underline" href="#design">Design & semantics</a></li>
                <li><a className="hover:underline" href="#diagnostics">Diagnostics</a></li>
                <li><a className="hover:underline" href="#faq">FAQ</a></li>
                <li><a className="hover:underline" href="#links">Links</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 pb-16 text-sm text-gray-500 text-center">
        MIT License · Built for the Python community · © 2025 {importName}
      </footer>
    </main>
  );
}
