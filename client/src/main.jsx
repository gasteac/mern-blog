import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
//como ahora usamos redux-persist, traemos tmb el persistor de la store
import { store, persistor } from "./redux/store.js";
//y tambien tenes que importar el gate de persist que cubre TODO
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <App />
      </Provider>
    </PersistGate>
  </React.StrictMode>
);
