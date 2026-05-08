export const LoadingSpinner = ({ message = "Cargando..." }: { message?: string }) => {
  return (
    <div className="flex justify-center items-center h-64 w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      <span className="ml-3 text-emerald-600 font-semibold">{message}</span>
    </div>
  );
};
