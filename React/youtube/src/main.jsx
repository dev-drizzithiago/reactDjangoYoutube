import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import storageSession from "redux-persist/lib/storage/session";

import "./index.css";
import App from "./App.jsx";
import { store, persistor } from "./Componentes/store.jsx"; // importa o store que você configurou

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);