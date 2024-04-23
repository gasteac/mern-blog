import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  AllPosts,
  CreatePost,
  Dashboard,
  Home,
  PostPage,
  SignIn,
  SignUp,
  UpdatePost,
  Search,
} from "./pages";
import { Header, PublicRoute, PrivateRoute } from "./components";
import { AdminRoute } from "./components/AdminRoute";
import { ScrollToTop } from "./components/ScrollToTop";
import { Footer } from "flowbite-react";
import { FooterComponent } from "./components/Footer";

export const App = () => {
  return (
    <>
      <BrowserRouter>
        {/* Componente para que si nos movemos a otra ruta, la página se muestre desde arriba (osea sube el scroll arriba) */}
        <ScrollToTop />
        {/* aca va el header, que es el único componente que se va a ver siempre */}
        <Header/>
        <Routes>
          {/* si pongo una ruta mal me redirige a home con el *   */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Home />} />
          <Route path="/all-posts" element={<AllPosts />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
          <Route path="/search" element={<Search />} />

          {/* Solo puedo acceder al dashboard si ESTOY autenticado (PrivateRoute) */}
          <Route element={<PrivateRoute />}>
            <Route path="/userDashboard" element={<Dashboard />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
            {/* <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} /> */}
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          {/* Solo puedo acceder a estas rutas si NO ESTOY autenticado (PublicRoute) */}
          <Route element={<PublicRoute />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Route>
        </Routes>
        <FooterComponent/>
      </BrowserRouter>
    </>
  );
};
