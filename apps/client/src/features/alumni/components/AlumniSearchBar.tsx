import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface AlumniSearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export default function AlumniSearchBar({
  onSearch,
  placeholder = "Search alumni...",
}: AlumniSearchBarProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(value.trim()), 300);
    return () => clearTimeout(timeout);
  }, [value, onSearch]);

  return (
    <div className="relative w-full sm:w-64">
      <Search
        size={14}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="input-base w-48 lg:w-64 py-2! pl-8 text-xs"
      />
    </div>
  );
}
