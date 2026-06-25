import React from 'react';

export default function Loading() {
  return (
    <div className="w-screen flex flex-col items-center pt-6">
      <div className="w-32 h-6 bg-zinc-900 rounded mb-4 animate-pulse" />
      <div className="flex flex-col gap-5 p-4 border border-zinc-800 rounded-sm w-[95vw] lg:w-[40vw] animate-pulse">
        {/* Title input skeleton */}
        <div className="flex flex-col gap-2 w-full">
          <div className="w-12 h-4 bg-zinc-800 rounded" />
          <div className="w-full h-8 bg-zinc-900 border border-zinc-850 rounded-sm" />
        </div>

        {/* Description input skeleton */}
        <div className="flex flex-col gap-2 w-full">
          <div className="w-20 h-4 bg-zinc-800 rounded" />
          <div className="w-full h-8 bg-zinc-900 border border-zinc-850 rounded-sm" />
        </div>

        {/* Submit button skeleton */}
        <div className="w-full h-8 bg-zinc-800 rounded-sm mt-2" />
      </div>
    </div>
  );
}
