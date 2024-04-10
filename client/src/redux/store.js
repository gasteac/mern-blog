import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { userSlice } from "./user/userSlice";
//de aca para abajo es todo para utilizar redux persist, una especie de local storage
//nos guarda basicamente toda la store en memoria
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import { themeSlice } from "./theme/themeSlice";

//creamos un combinador de reducers para dsp pasarle a la store como 1 solo reducer
const rootReducer = combineReducers({
  user: userSlice.reducer,
  theme: themeSlice.reducer
});

//creamos la configuracion del persist, la key seria con el nombre que se guarda en el navegador
const persistConfig = {
  key: "root",
  storage, //storage es de la librería de redux persist
  version: 1,
};

//y aca al persistReducer (que va a perseverar en el tiempo de ahi su nombre)
//le pasamos lo q configuramos antes, la conf, y el rootReducer q combina todos los reducers
const persistedReducer = persistReducer(
  persistConfig,
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer, //aca le pasamos el reducer que engloba todos los reducers

  //requerimos este middleware para prevenir errores utilizando react toolkit
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

//exportamos el persistor que contiene a la store.
export const persistor = persistStore(store)
