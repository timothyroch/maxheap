import ThemeToggle from '@/components/ThemeToggle';
import CodeBlock from '@/components/CodeBlock';
import DownloadCard, { placeholderAsset_010 } from '@/components/DownloadCard';
import release from './data/releases.json';
import Link from 'next/link';
export default function Page() {
  const code = `import maxheap as heapq

h = []
heapq.heappush(h, 10)
heapq.heappush(h, 3)
heapq.heappush(h, 42)
print(heapq.heappop(h))  # 42`;

  // install name on (Test)PyPI vs import name
  const installName = 'maxheapx';
  const importName = 'maxheap';

  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-radial" />
      <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="font-semibold tracking-tight text-xl">{importName}</div>
        <nav className="flex items-center gap-6">
          <Link
            href="/docs"
            className="text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/10 transition"
          >
            Documentation
          </Link>
          <Link
            href="https://github.com/timothyroch/maxheap/tree/main/library" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/10 transition"
          >
            GitHub
          </Link>
          <Link
            href={`https://pypi.org/project/${installName}/`} // TestPyPI link while in testing: https://test.pypi.org/project/maxheapx/
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/10 transition"
          >
            PyPI
          </Link>
          <ThemeToggle />
        </nav>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-10 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              A drop-in <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-indigo-500">max-heap</span> for Python
            </h1>
            <p className="mt-5 text-lg text-gray-600 dark:text-gray-300">
              Mirrors Python&apos;s standard <code>heapq</code> — but max-first. Optional C accelerator with pure-Python fallback, fully typed, rigorously tested, zero runtime dependencies.
            </p>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Quick Install</h2>
              <CodeBlock code={`pip install ${installName}`} />
              <p className="mt-2 text-sm text-gray-500">
                Then <code>import maxheap</code> in your code.
              </p>
            </div>

            <div className="mt-8 grid gap-4">
              <h2 className="text-xl font-semibold mb-4">Downloads</h2>
              {release.assets.map((a) => (<DownloadCard asset={placeholderAsset_010} disabled />))}
              <div className="mt-2 text-sm text-gray-500">
                Version {release.version} · Released on August 14 2025
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
            <CodeBlock code={code} />

            <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                <div className="font-semibold">heapq-Compatible API</div>
                <div className="text-gray-600 dark:text-gray-300 mt-1">Same function names; max-first by default.</div>
              </div>
              <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                <div className="font-semibold">C Accelerator</div>
                <div className="text-gray-600 dark:text-gray-300 mt-1">Fast path in C; falls back to Python if unavailable.</div>
              </div>
              <div className="rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                <div className="font-semibold">Fully Typed</div>
                <div className="text-gray-600 dark:text-gray-300 mt-1">PEP 561 <code>py.typed</code> for great IDEs.</div>
              </div>
            </div>
          <div className="mt-6 rounded-2xl border p-4 bg-white/60 dark:bg-white/5 backdrop-blur text-sm">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Performance highlights</div>
              <span className="rounded-md border px-2 py-0.5 text-[11px] text-gray-600 dark:text-gray-300">
                median speedup vs <code>heapq</code>+negation
              </span>
            </div>

            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Faster than the common “negate values” workaround for max-heaps:
            </p>

            <dl className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border p-3 bg-white/70 dark:bg-white/5">
                <dt className="text-gray-600 dark:text-gray-300">heappush</dt>
                <dd className="text-lg font-semibold leading-tight">~+19%</dd>
                <p className="text-xs text-gray-500 mt-1">Insert N items</p>
              </div>
              <div className="rounded-xl border p-3 bg-white/70 dark:bg-white/5">
                <dt className="text-gray-600 dark:text-gray-300">heapify</dt>
                <dd className="text-lg font-semibold leading-tight">~+28%</dd>
                <p className="text-xs text-gray-500 mt-1">Build from list</p>
              </div>
              <div className="rounded-xl border p-3 bg-white/70 dark:bg-white/5">
                <dt className="text-gray-600 dark:text-gray-300">heapify + drain</dt>
                <dd className="text-lg font-semibold leading-tight">~+41%</dd>
                <p className="text-xs text-gray-500 mt-1">Build then pop all</p>
              </div>
            </dl>

            <div className="mt-3 text-xs text-gray-500">
              Methodology: N=100k random integers, repeat=10, warmup=3; results report the <em>median</em>.
              Environment: Python 3.13.x on x86_64. Your results may vary by CPU, Python, and data distribution.
              <br />
              Want to reproduce? See <a href="/docs#benchmarks" className="underline hover:no-underline">Benchmarks</a> for a ready-to-run microbench harness.
            </div>
          </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 md:py-20 border-t">
        <h2 className="text-3xl font-bold mb-8 text-center">Why {importName}?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur">
            <h3 className="font-semibold text-lg mb-2">Max-First Priority</h3>
            <p className="text-gray-600 dark:text-gray-300">Python&apos;s <code>heapq</code> is min-heap only. {importName} is max-first without negating values.</p>
          </div>
          <div className="p-6 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur">
            <h3 className="font-semibold text-lg mb-2">Zero Runtime Deps</h3>
            <p className="text-gray-600 dark:text-gray-300">Optional C extension; pure-Python fallback ensures portability.</p>
          </div>
          <div className="p-6 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur">
            <h3 className="font-semibold text-lg mb-2">Open Source</h3>
            <p className="text-gray-600 dark:text-gray-300">MIT-licensed and tested (unit + property-based).</p>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 pb-16 text-sm text-gray-500 text-center">
        MIT License · Built for the Python community · © 2025 {importName}
      </footer>
    </main>
  );
}
