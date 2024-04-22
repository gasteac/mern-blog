import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
//como ahora usamos redux-persist, traemos tmb el persistor de la store
import { store, persistor } from "./redux/store.js";
//y tambien tenes que importar el gate de persist que cubre TODO con el persistor (persiste en el navegador)
import { PersistGate } from "redux-persist/integration/react";
//esto es para el tema, pero hay formas mas faciles de hacerlo, por ejemplo con daisyUI
import { ThemeProvider } from "./components";
import { Flowbite } from "flowbite-react";
ReactDOM.createRoot(document.getElementById("root")).render(
  // {/* PersistGate: envuelve a todo el árbol de componentes de la aplicación que
  // dependan del estado persistido. Al pasarle el persistor, PersistGate se
  // encarga de manejar la lógica relacionada con la carga del estado persistido
  // antes de que la aplicación se renderice. */}
  <PersistGate persistor={persistor}>
    {/* Provider: envuelve a la aplicación y le proporciona acceso a la store de Redux. */}
    <Provider store={store}>
      {/* ThemeProvider es un componente que envuelve a la aplicación y le proporciona acceso al tema. */}
        <Flowbite>
      <ThemeProvider>
          <App />
      </ThemeProvider>
        </Flowbite>
    </Provider>
  </PersistGate>
);
