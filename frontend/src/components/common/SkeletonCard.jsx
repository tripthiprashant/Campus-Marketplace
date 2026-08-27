import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] bg-slate-200 w-full relative"></div>
      
      {/* Content Skeleton */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Category & Badge */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-slate-200 rounded-md w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded-full w-16"></div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <div className="h-5 bg-slate-200 rounded-md w-4/5"></div>
          <div className="h-4 bg-slate-100 rounded-md w-3/5"></div>
        </div>

        {/* Price & Seller */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="h-6 bg-slate-200 rounded-md w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
};

export default SkeletonCard;
