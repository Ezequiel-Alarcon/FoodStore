import type { ReactNode } from "react";

interface GenericTableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T) => ReactNode;
  emptyMessage?: string;
}

export function GenericTable<T>({ 
  headers, 
  data, 
  renderRow, 
  emptyMessage = "No hay registros disponibles." 
}: GenericTableProps<T>) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {headers.map((header, index) => (
                <th 
                  key={index} 
                  className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={headers.length} 
                  className="px-6 py-8 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => renderRow(item))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
