export default function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="rounded-2xl bg-gray-900 text-gray-50 p-5 overflow-auto text-sm font-mono shadow-lg">
      <code>{code}</code>
    </pre>
  );
}