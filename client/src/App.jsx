import React from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { About, Dashboard, Home, Projects, SignIn, SignUp } from "./pages";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/*   si pongo una ruta mal me redirije a home con el *   */}
        <Route path="*" element={<Home />} /> 
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </BrowserRouter>
  );
};
