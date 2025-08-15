# maxheap • Website

Tiny companion site for the **maxheapx** Python package.
Built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. It’s intentionally lightweight, just enough to showcase install instructions, usage, performance notes, version history, and documentation links.

> The library itself (the star of the show) lives in [`/library`](https://github.com/timothyroch/maxheap/tree/main/library). This site is just the brochure. 

---

## Quick start

```bash
# inside /website
npm i                  # or: npm install 
npm run dev            # http://localhost:3000
```

---

## What’s here

* **Landing page** (`app/page.tsx`)
  Hero, quick install, usage snippet, performance highlights, and **Version History**.
* **Docs** (`app/docs/page.tsx`)
  API overview and examples.
* **License** (`app/license/page.tsx`)
  MIT license page.
* **Components**

  * `ThemeToggle` – dark/light mode.
  * `CodeBlock` – pretty code with a **Copy** button.
  * `VersionHistory` – renders the release timeline from `data/releases.ts`.

---

## Data: version history

Releases are defined in a typed TS module:

`app/data/releases.ts`

```ts
import type { Release } from '@/components/VersionHistory';

const releases: Release[] = [
  {
    version: '0.1.1',
    date: '2025-08-13',
    status: 'latest',
    highlights: [
      'Linux wheels for CPython 3.9–3.14 (manylinux & musllinux).',
      'C accelerator enabled by default with Python fallback.',
      'Benchmarks: heappush ~+19%, heapify ~+28%, heapify+drain ~+41% vs heapq+negation (N=100k, repeat=10).',
    ],
    files: [
      { filename: 'maxheapx-0.1.1-…-manylinux_x86_64.whl', platform: 'manylinux', size: 13312 },
      { filename: 'maxheapx-0.1.1-…-musllinux_x86_64.whl', platform: 'musllinux', size: 13312 },
    ],
  },
  {
    version: '0.1.0',
    date: '2025-08-13',
    status: 'yanked',
    highlights: ['Initial release (Linux-only wheel). Superseded by 0.1.1.'],
  },
];

export default releases;
```

**To add a new release**: append an object at the top with `status: 'latest'` and update the previous latest as needed (e.g., remove its `latest` or mark it yanked if appropriate).

---

## Project structure

```
website/
├─ app/
│  ├─ data/releases.ts   # version history (typed)
│  ├─ docs/page.tsx      # docs
│  ├─ license/page.tsx   # MIT license page
│  ├─ layout.tsx         # Layout of website 
|  |─ globals.css        # Tailwind layers
│  └─ page.tsx           # home
├─ components/
│  ├─ CodeBlock.tsx      # code + Copy button
│  ├─ ThemeToggle.tsx
│  └─ VersionHistory.tsx
├─ public/               # static assets (favicons, og image, etc.)
├─ tailwind.config.ts
├─ postcss.config.js
├─ package.json
└─ tsconfig.json
```

---


## Contributing

* Keep the site small and fast.
* Prefer TS for data (`releases.ts`) for type safety.
* PRs that improve clarity, examples, or accessibility are welcome.

---

## License

MIT — see the license page at [`license`](https://github.com/timothyroch/maxheap/blob/main/LICENSE).
