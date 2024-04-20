import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  About,
  AllPosts,
  CreatePost,
  Dashboard,
  Home,
  PostPage,
  Projects,
  SignIn,
  SignUp,
  UpdatePost,
} from "./pages";
import { Header, PublicRoute, PrivateRoute } from "./components";
import { AdminRoute } from "./components/AdminRoute";
import { ScrollToTop } from "./components/ScrollToTop";

export const App = () => {
  return (
    <>
      <BrowserRouter>
      {/* Componente para que si nos movemos a otra ruta, la página se muestre desde arriba (osea sube el scroll arriba) */}
      <ScrollToTop/>
        {/* aca va el header, que es el único componente que se va a ver siempre */}
        <Header />
        <Routes>
          {/* si pongo una ruta mal me redirige a home con el *   */}
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/all-posts" element={<AllPosts />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
          {/* Solo puedo acceder al dashboard si ESTOY autenticado (PrivateRoute) */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} /> */}
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>
          {/* Solo puedo acceder a estas rutas si NO ESTOY autenticado (PublicRoute) */}
          <Route element={<PublicRoute />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};
