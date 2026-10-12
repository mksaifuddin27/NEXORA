import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Hotel, Stethoscope, Pill, Scissors, ArrowRight } from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Utensils,
  Hotel,
  Stethoscope,
  Pill,
  Scissors,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected }) => {
  const IconComponent = ICON_MAP[category.iconName] || Utensils;

  return (
    <Link
      to={`/services?category=${category.category_id}`}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 block ${
        isSelected
          ? 'border-brand-primary ring-2 ring-brand-primary/40 shadow-glow-indigo'
          : 'border-white/10 hover:border-brand-primary/50 hover:shadow-glow-indigo/50'
      }`}
    >
      {/* Background Image with dark gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={category.featured_image}
          alt={category.category_name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/85 to-navy-950/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-between h-56 sm:h-64">
        {/* Top Icon Pill */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-navy-900/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-brand-secondary shadow-lg group-hover:scale-105 group-hover:border-brand-secondary/40 transition">
            <IconComponent className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-slate-200 border border-white/10">
            {category.provider_count}+ Spots
          </span>
        </div>

        {/* Bottom Title & Description */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 flex items-center gap-2 group-hover:text-indigo-200 transition">
            {category.category_name}
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-secondary" />
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  );
};
