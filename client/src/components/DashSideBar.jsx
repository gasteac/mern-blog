import React from "react";
import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { logoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export const DashSideBar = () => {
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
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {/* Si tab es igual a profile mostramos el item con el icono de HiUser y el label User */}
          <Sidebar.Item
            active={tab === "profile"}
            icon={HiUser}
            label={"User"}
            labelColor="dark"
            as="div"
          >
            <Link to="/dashboard?tab=profile">Profile</Link>
          </Sidebar.Item>
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};
