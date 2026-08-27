import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Laptop,
  Shirt,
  Sparkles,
  FileText,
  Dumbbell,
  Armchair,
  Layers,
  GraduationCap,
  Calculator,
} from 'lucide-react';

// Get appropriate icon for category name
export const getCategoryIcon = (categoryName = '') => {
  const name = categoryName.toLowerCase();
  if (name.includes('book') || name.includes('textbook')) return BookOpen;
  if (name.includes('electronic') || name.includes('gadget') || name.includes('laptop')) return Laptop;
  if (name.includes('cloth') || name.includes('fashion') || name.includes('wear')) return Shirt;
  if (name.includes('sport') || name.includes('gym') || name.includes('fitness')) return Dumbbell;
  if (name.includes('furnitur') || name.includes('dorm') || name.includes('chair')) return Armchair;
  if (name.includes('note') || name.includes('stationery') || name.includes('study')) return FileText;
  if (name.includes('calc') || name.includes('math')) return Calculator;
  if (name.includes('academic') || name.includes('course')) return GraduationCap;
  return Layers;
};

export const CategoryCard = ({ category, isSelected = false, onClick }) => {
  if (!category) return null;
  const Icon = getCategoryIcon(category.name);

  if (onClick) {
    return (
      <button
        onClick={() => onClick(category.id)}
        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all text-center group ${
          isSelected
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80 hover:border-indigo-200 shadow-sm'
        }`}
      >
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
            isSelected
              ? 'bg-white/20 text-white'
              : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 group-hover:scale-105'
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-xs font-semibold tracking-tight truncate w-full">
          {category.name}
        </span>
      </button>
    );
  }

  return (
    <Link
      to={`/products?category=${category.id}`}
      className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all text-center group"
    >
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 flex items-center justify-center text-indigo-600 group-hover:text-white mb-3 shadow-inner group-hover:scale-110 transition-all duration-300">
        <Icon className="w-7 h-7" />
      </div>
      <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
        {category.name}
      </span>
      {category.description && (
        <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
          {category.description}
        </span>
      )}
    </Link>
  );
};

export default CategoryCard;
