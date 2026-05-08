import { Link, Outlet } from "react-router-dom";

export const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* NAVBAR OPTIMIZADO */}
      <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-50 border-b border-blue-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            
            {/* Logo / Inicio */}
            <Link
              to="/"
              className="text-2xl font-black tracking-tight text-orange-400 hover:text-orange-300 hover:scale-105 transition-all duration-200 ease-out drop-shadow-sm"
            >
              Inicio
            </Link>

            {/* Enlaces principales */}
            <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
              {["categorias", "ingredientes", "productos"].map((item) => (
                <Link
                  key={item}
                  to={`/${item}`}
                  className="text-gray-300 hover:text-white transition-colors uppercase tracking-wider"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};