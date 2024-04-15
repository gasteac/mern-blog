import React from "react";
import { useSelector } from "react-redux";

//ThemeProvider es un componente que se encarga de cambiar el tema de la app
//Recibe a la app en si, como children, y le agrega la clase del tema actual
export const ThemeProvider = ({ children }) => {
  //Traemos el tema actual de la store
  const { theme } = useSelector((state) => state.theme);
  return (
    //Agregamos la clase del tema actual al div que contiene a la app
    <div className={theme}>
      {/* Aca le pasamos las clases dependiendo si es dark o light */}
      <div className="min-h-screen flex flex-col text-gray-800 dark:text-gray-200 ">
        <div className="fixed inset-0 z-0">
          {/* El fondo, que se mantiene fijo en la pantalla */}
          <div className="h-full w-full bg-[rgb(234,234,234)] dark:bg-[rgb(16,23,42)]"></div>
        </div>
        <div className="relative z-10">
          {/* El contenido de la aplicación, que se superpone al fondo */}
          {children}
        </div>
      </div>
    </div>
  );
};
