export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-white antialiased px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6 w-full">
        <div className="border-b border-zinc-900 pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-pulse">
          <div className="space-y-2 flex-1">
            <div className="h-5 w-28 sm:w-32 rounded bg-zinc-900 border border-zinc-800/50" />
            <div className="h-6 sm:h-9 w-3/5 sm:w-80 rounded bg-zinc-900" />
            <div className="h-3 sm:h-3.5 w-full sm:w-[500px] rounded bg-zinc-900/60" />
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto mt-1 sm:mt-0">
            <div className="h-8 sm:h-9 flex-1 sm:flex-none sm:w-28 rounded-lg bg-zinc-900 border border-zinc-800" />
            <div className="h-8 sm:h-9 flex-1 sm:flex-none sm:w-32 rounded-lg bg-zinc-800" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 w-full">
              <div className="relative rounded-xl sm:rounded-2xl border border-zinc-900 bg-[#0C0C0E] p-4 sm:p-6 shadow-sm overflow-hidden animate-pulse">
                <div className="flex flex-row items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 shrink-0" />

                  <div className="space-y-1.5 sm:space-y-2 flex-1 w-full min-w-0">
                    <div className="h-3.5 sm:h-4.5 w-1/3 rounded bg-zinc-900" />
                    <div className="h-3 sm:h-3.5 w-2/3 rounded bg-zinc-900/60" />
                    <div className="h-2.5 sm:h-3 w-1/2 rounded bg-zinc-900/40" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-zinc-900 bg-[#0C0C0E]/50 animate-pulse gap-3 sm:gap-4"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-zinc-900 border border-zinc-800 shrink-0" />

                      <div className="min-w-0 flex-1 space-y-1 sm:space-y-1.5">
                        <div className="h-3 sm:h-3.5 w-2/5 rounded bg-zinc-900" />
                        <div className="h-2.5 sm:h-3 w-3/5 rounded bg-zinc-900/50" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="hidden sm:block h-5 w-16 rounded bg-zinc-900/60 border border-zinc-800/40" />
                      <div className="h-6 sm:h-7 w-12 sm:w-14 rounded bg-zinc-900 border border-zinc-800" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 w-full">
              <div className="h-3 w-28 rounded bg-zinc-900/80 animate-pulse tracking-widest uppercase mb-1" />

              <div className="rounded-xl border border-zinc-900 bg-[#0C0C0E] p-4 sm:p-4.5 space-y-3 sm:space-y-3.5 shadow-sm animate-pulse">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                  <div className="h-3.5 w-24 rounded bg-zinc-900" />
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-zinc-900" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-zinc-900/60" />
                  <div className="h-3 w-11/12 rounded bg-zinc-900/60" />
                  <div className="h-3 w-4/5 rounded bg-zinc-900/40" />
                </div>
              </div>

              <div className="rounded-xl border border-zinc-900 bg-[#0C0C0E] p-4 sm:p-4.5 space-y-2.5 sm:space-y-3 shadow-sm animate-pulse">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-zinc-900" />
                  <div className="h-3.5 w-32 rounded bg-zinc-900" />
                </div>
                <div className="h-7 sm:h-8 w-full rounded-lg bg-zinc-900/40 mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
