import React from 'react';

export default function Loading() {
  return (
    <div className="w-screen h-full flex justify-center items-center pt-6">
      <div className="px-4 py-4 flex flex-col mt-6 w-[96%] md:w-[70%] lg:w-[40%] gap-6 animate-pulse">
        {/* Form fields skeleton */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2 w-full">
            <div className="w-24 h-4 bg-zinc-800 rounded" />
            <div className="w-full h-10 bg-zinc-900/60 border border-zinc-800/80 rounded-sm" />
          </div>
        ))}

        {/* File upload skeleton */}
        <div className="flex flex-col gap-2 w-full">
          <div className="w-40 h-4 bg-zinc-800 rounded" />
          <div className="w-full h-10 bg-zinc-900/40 border border-dashed border-zinc-800 rounded-sm" />
        </div>

        {/* Submit button skeleton */}
        <div className="w-full h-10 bg-zinc-850 rounded-sm mt-4" />
      </div>
    </div>
  );
}
