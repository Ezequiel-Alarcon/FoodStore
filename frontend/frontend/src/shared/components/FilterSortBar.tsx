export interface SortOption {
  value: string;
  label: string;
}

interface FilterSortBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  sortOption: string;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];
}

export const FilterSortBar = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  sortOption,
  onSortChange,
  sortOptions
}: FilterSortBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <div className="w-full sm:w-1/2">
        <input 
          type="text" 
          placeholder={searchPlaceholder}
          className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-auto flex items-center gap-2">
        <label className="text-sm font-medium text-slate-600 whitespace-nowrap">Ordenar por:</label>
        <select 
          className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
