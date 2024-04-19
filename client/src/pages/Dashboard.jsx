import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DashProfile, DashSideBar } from "../components";
import { DashPosts } from "../components/DashPosts";

export const Dashboard = () => {
  //location nos devuelve un objeto con información de la URL actual y los parametros
  const location = useLocation();
  const [tab, setTab] = useState(null);
  //este useEffect se va a ejecutar siempre que cambie el search osea el ?tab=valor de la url
  //se va a utilizar para mostrar diferentes componentes dentro del mismo componente
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    //urlParams nos devuelve un objeto con los parámetros de la URL q coincidan con en este caso search que es ?tab=valor
    const tabFromUrl = urlParams.get("tab");
    // tabFromUrl nos devuelve el valor del parámetro tab, puede ser en nuestro caso profile por ejemplo
    setTab(tabFromUrl);
  }, [location.search]);
  return (
    <div className="flex flex-col md:flex-row h-screen ">
      <div className="md:w-56 ">
        <DashSideBar />
      </div>
      {/* posts */}
      {tab === "posts" ? <DashPosts /> : null}
      {/* perfil */}
      {tab === "profile" ? <DashProfile /> : null}
    </div>
  );
};
