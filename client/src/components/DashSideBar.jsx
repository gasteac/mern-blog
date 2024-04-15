import React from "react";
import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight, HiDocumentText } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { logoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export const DashSideBar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  //Obtenemos el path actual mediante useLocation de react-router-dom
  //useLocation nos da un objeto con información sobre la ruta actual (URL)
  //Específicamente pathname devuelve lo que viene después del dominio (google.com/loquesea -> /loquesea)
  const location = useLocation();
  //En tab guardamos el valor del parámetro search de la URL, osea "?tab=valor" seria = 'valor'
  const [tab, setTab] = useState("");
  //este useEffect se va a ejecutar siempre que cambie el search osea el ?tab=valor de la url
  //se va a utilizar para mostrar diferentes componentes dentro del mismo componente
  //Cualquier componente que se muestre aca es valido dependiendo si esta era una ruta publica o privada
  useEffect(() => {
    //URLSearchParams nos devuelve un objeto con todos los parámetros de la URL
    //En este caso nos devuelve un objeto con el parámetro tab y su valor
    //search porque es el nombre del parámetro que queremos obtener
    //search = ?tab=valor
    const urlParams = new URLSearchParams(location.search);
    // urlParams.get("tab") nos devuelve el valor del parámetro tab, osea 'valor'
    const tabFromUrl = urlParams.get("tab");
    //seteamos el valor de tab con el valor del parámetro tab de la URL
    setTab(tabFromUrl);
    //y esto se va a hacer cada vez que cambie el search, osea el valor de ?tab=valor
  }, [location.search]);
  const handleSignOut = () => {
    try {
      axios.post("/api/user/logout");
      dispatch(logoutSuccess());
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Sidebar className="w-full h-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col">
          {/* Si tab es igual a profile mostramos el item con el icono de HiUser y el label User */}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                labelColor="dark"
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}

          <Link to="/signin">
            <Sidebar.Item
              icon={HiArrowSmRight}
              onClick={handleSignOut}
              as="div"
            >
              Sign Out
            </Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};
