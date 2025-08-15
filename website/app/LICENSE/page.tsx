import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
  title: "License · maxheap",
  description: "MIT License for the maxheap library",
};

export default function LicensePage() {
  const importName = "maxheap";
  const installName = "maxheapx";
  const githubUrl = "https://github.com/timothyroch/maxheap/tree/main/library";
  const pypiUrl = `https://pypi.org/project/${installName}/`;

  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-radial" />

      <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="font-semibold tracking-tight text-xl">{importName} · License</div>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/10 transition"
          >
            Home
          </Link>
          <Link
            href="/docs"
            className="text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/10 transition"
          >
            Documentation
          </Link>
          <Link
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/10 transition"
          >
            GitHub
          </Link>
          <Link
            href={pypiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/10 transition"
          >
            PyPI
          </Link>
          <ThemeToggle />
        </nav>
      </header>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">MIT License</h1>

        <article className="rounded-2xl border p-6 bg-white/70 dark:bg-white/5 backdrop-blur">
          <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-6 text-gray-800 dark:text-gray-200">
{`MIT License

Copyright (c) 2025 Timothy Roch

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
          </pre>
        </article>

        <p className="mt-6 text-sm text-gray-500">
          © 2025 MaxHeap · Licensed under MIT
        </p>
      </section>

      <footer className="max-w-6xl mx-auto px-6 pb-16 text-sm text-gray-500 text-center">
        MIT License · Built for the Python community · © 2025 {importName}
      </footer>
    </main>
  );
}
