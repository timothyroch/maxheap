'use client';

type FileInfo = {
  filename: string;    // e.g. "maxheapx-0.1.1-cp311-...whl"
  size?: number;       // bytes (optional)
  platform?: string;   // e.g. "manylinux", "musllinux", "macOS", "Windows"
};

export type Release = {
  version: string;                 // "0.1.1"
  date: string;                    // ISO date "2025-08-12"
  highlights?: string[];           // bullet points
  status?: 'yanked' | 'latest';    // optional labels
  files?: FileInfo[];              // optional file list (no links)
};

function formatBytes(bytes?: number) {
  if (!bytes && bytes !== 0) return '';
  if (bytes === 0) return '0 B';
  const k = 1024, sizes = ['B','KB','MB','GB','TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function VersionHistory({ releases }: { releases: Release[] }) {
  // newest first
  const sorted = [...releases].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Version history</h2>
      <div className="space-y-4">
        {sorted.map((r) => (
          <div
            key={r.version}
            className="rounded-2xl border p-4 bg-white/70 dark:bg-white/5 backdrop-blur"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-lg font-semibold">v{r.version}</div>
              <div className="text-sm text-gray-500">
                {r.date}
              </div>
              {r.status === 'latest' && (
                <span className="text-xs rounded-full border px-2 py-0.5">Latest</span>
              )}
              {r.status === 'yanked' && (
                <span className="text-xs rounded-full border px-2 py-0.5 text-red-600 border-red-300">
                  Yanked
                </span>
              )}
            </div>

            {r.highlights?.length ? (
              <ul className="list-disc ml-5 mt-2 text-sm text-gray-700 dark:text-gray-300">
                {r.highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            ) : null}

            {r.files?.length ? (
              <div className="mt-3 grid gap-2 text-sm">
                {r.files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-mono">{f.filename}</div>
                      <div className="text-xs text-gray-500">
                        {[f.platform, formatBytes(f.size)].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
