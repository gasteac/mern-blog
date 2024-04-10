import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { About, Dashboard, Home, Projects, SignIn, SignUp } from "./pages";
import { Header } from "./components/Header";

export const App = () => {
  return (
    <>
      <BrowserRouter>
      <Header />
        <Routes>
          {/*   si pongo una ruta mal me redirije a home con el *   */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
