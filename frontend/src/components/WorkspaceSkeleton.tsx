"use client";

export function WorkspaceSkeleton() {
  return (
    <div className="h-40 rounded-lg border animate-pulse bg-gray-200" aria-hidden>
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
      </div>
    </div>
  );
}