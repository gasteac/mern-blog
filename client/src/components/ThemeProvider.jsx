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
      <div className="min-h-screen bg-[rgb(234,234,234)] text-gray-800 dark:text-gray-200 dark:bg-[rgb(16,23,42)]">
        {children} {/* esta vendría siendo la app en si */}
      </div>
    </div>
  );
};
