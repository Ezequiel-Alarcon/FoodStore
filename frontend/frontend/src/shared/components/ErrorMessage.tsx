export const ErrorMessage = ({ 
  title = "¡Error!", 
  message = "Ocurrió un error inesperado." 
}: { 
  title?: string, 
  message?: string 
}) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-sm w-full">
      <strong className="font-bold">{title} </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};
