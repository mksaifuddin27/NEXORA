import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Results Found',
  description = 'Try adjusting your search keywords, clearing filters, or changing your discovery radius.',
  actionLabel,
  onAction,
  icon: Icon = SearchX,
}) => {
  return (
    <div className="py-16 px-4 text-center max-w-md mx-auto flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-navy-850 border border-white/10 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <Icon className="w-8 h-8 text-brand-secondary" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-white text-xs font-semibold border border-white/10 transition shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
