import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { About, Dashboard, Home, Projects, SignIn, SignUp } from "./pages";
import { Header } from "./components/Header";
import { PrivateRoute } from "./components/PrivateRoute";
import { PublicRoute } from "./components/PublicRoute";

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          {/*   si pongo una ruta mal me redirige a home con el *   */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Home />} />

          {/* Solo puedo acceder al dashboard si estoy autenticado (PrivateRoute) */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
          </Route>
          <Route element={<PublicRoute />}>
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};
