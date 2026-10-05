export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <span className="inline-block rounded-full bg-aura-100 px-3 py-1 text-xs font-medium tracking-wide text-aura-800">
          Foundation Phase
        </span>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-aura-950">
          Aura Skincare
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          AI Voice Customer Support Agent
        </p>
        <p className="mt-6 text-xs text-stone-400">
          Project foundation initialized. Ready for Phase 2 UI implementation.
        </p>
      </div>
    </main>
  );
}
