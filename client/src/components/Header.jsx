import React from "react";
import {
  Avatar,
  Button,
  Dropdown,
  Navbar,
  NavbarLink,
  NavbarToggle,
  TextInput,
} from "flowbite-react";
import { toggleTheme } from "../redux/theme/themeSlice";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../redux/user/userSlice";
import axios from "axios";

export const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  //Obtenemos el path actual mediante useLocation de react-router-dom
  //useLocation nos da un objeto con información sobre la ruta actual (URL)
  //Específicamente pathname devuelve lo que viene después del dominio (google.com/loquesea -> /loquesea)
  const path = useLocation().pathname;
  const handleSignOut = () => {
    try {
      axios.post("/api/user/logout");
      dispatch(logoutSuccess());
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Navbar className="border-b-4 w-full sticky top-0 z-50">
      <Link
        to="/"
        className="hidden lowEndPhone:inline text-sm sm:text-xl font-semibold  dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 rounded-xl hover:from-emerald-500 hover:via-emerald-600 hover:to-teal-500  text-white">
          FaceRook
        </span>
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search"
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {/* Si el tema es dark mostramos la luna, si no mostramos el sol */}
          {theme === "dark" ? <FaMoon /> : <FaSun />}
        </Button>
        {/* Si el usuario esta logueado mostramos un dropdown con su avatar, si no mostramos un botón para loguearse */}
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="avatar" img={currentUser.profilePic} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Dashboard</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          // Si no esta logueado mostramos el boton para ingresar
          <Link to="sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}

        <NavbarToggle></NavbarToggle>
      </div>
      <Navbar.Collapse>
        {/* path lo obtenemos de useLocation, es el path actual, lo que esta en la url */}

        {!currentUser ? (
          <>
            <NavbarLink active={path === "/"} as={"div"}>
              <Link to="/">Home</Link>
            </NavbarLink>
            <NavbarLink active={path === "/sign-in"} as={"div"}>
              <Link to="/sign-in">Sign In</Link>
            </NavbarLink>
            <NavbarLink active={path === "/sign-up"} as={"div"}>
              <Link to="/sign-up">Sign Up</Link>
            </NavbarLink>
          </>
        ) : (
          <>
            <NavbarLink active={path === "/dashboard"} as={"div"}>
              <Link to="/dashboard?tab=profile">Dashboard</Link>
            </NavbarLink>
            <NavbarLink active={path === "/about"} as={"div"}>
              <Link to="/about">About</Link>
            </NavbarLink>
            <NavbarLink active={path === "/projects"} as={"div"}>
              <Link to="/projects">Projects</Link>
            </NavbarLink>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};
