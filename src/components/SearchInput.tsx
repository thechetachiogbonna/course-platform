"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  wrapperClassName?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  inputClassName = "",
  wrapperClassName = "",
}: SearchInputProps) {
  return (
    <div className={`relative w-full ${className} ${wrapperClassName}`}>
      <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#c9c8ab] shrink-0">
        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-[#1a1a1a] border border-[#252525] rounded-xl pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm text-white placeholder-[#c9c8ab]/40 focus:outline-none focus:border-brand-yellow transition-all ${inputClassName}`}
      />
    </div>
  );
}
