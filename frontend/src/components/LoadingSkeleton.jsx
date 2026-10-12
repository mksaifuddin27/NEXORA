import React from 'react';
export const ProviderCardSkeleton = () => {
    return (<div className="rounded-2xl bg-navy-900 border border-white/5 overflow-hidden animate-pulse">
      <div className="h-52 bg-navy-850"/>
      <div className="p-5 space-y-3">
        <div className="h-5 bg-navy-800 rounded-md w-3/4"/>
        <div className="h-3 bg-navy-800 rounded-md w-full"/>
        <div className="h-3 bg-navy-800 rounded-md w-2/3"/>
        <div className="pt-3 border-t border-white/5 flex justify-between">
          <div className="h-4 bg-navy-800 rounded w-1/3"/>
          <div className="h-4 bg-navy-800 rounded w-1/4"/>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="h-9 bg-navy-800 rounded-xl"/>
          <div className="h-9 bg-navy-800 rounded-xl"/>
        </div>
      </div>
    </div>);
};
