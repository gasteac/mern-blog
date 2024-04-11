import React from "react";
import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const DashSideBar = () => {
  //location nos devuelve un objeto con información de la URL actual y los parametros
  const location = useLocation();
  const [tab, setTab] = useState("");
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
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            active={tab === "profile"}
            icon={HiUser}
            label={"User"}
            labelColor="dark">
            <Link to="/dashboard?tab=profile">Profile</Link>
          </Sidebar.Item>
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};
