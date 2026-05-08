interface PaginationBarProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

export const PaginationBar = ({
  currentPage,
  totalItems,
  itemsPerPage = 20,
  onPageChange
}: PaginationBarProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  if (totalItems <= itemsPerPage) return null;

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200 mt-4">
      <div className="text-sm text-slate-600">
        Mostrando página <span className="font-bold text-slate-900">{currentPage}</span> de <span className="font-bold text-slate-900">{totalPages}</span>
        {' '} ({totalItems} registros totales)
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50 transition-colors font-medium text-sm text-slate-700"
        >
          Anterior
        </button>
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50 transition-colors font-medium text-sm text-slate-700"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
