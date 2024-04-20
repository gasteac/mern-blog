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
        className="lowEndPhone:inline text-sm font-semibold  dark:text-white"
      >
        <span className="hidden sm:block px-2 py-1 hiText font-bold text-2xl sm:text-3xl ">
          FaceRook
        </span>
        <span className="sm:hidden px-2 py-1 hiText font-bold text-2xl sm:text-3xl ">
          FR
        </span>
      </Link>
      {/* <form>
        <TextInput
          type="text"
          placeholder="Search"
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button> */}
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
            label={
              <img
                src={currentUser.profilePic}
                alt="avatar"
                className="h-10 w-10 object-cover rounded-full"
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item as="div">Dashboard</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          // Si no esta logueado mostramos el boton para ingresar
          <Link to="signin">
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
            <NavbarLink
              active={path === "/"}
              as="div"
              className={`
    rounded-xl w-full
    ${
      path === "/"
        ? "bg-gradient-to-br from-purple-500 to-blue-500 md:text-white font-semibold"
        : "dark:text-white light:text-black"
    }
  `}
            >
              <Link to="/" className="w-full flex md:p-2 ">
                Home
              </Link>
            </NavbarLink>
            <NavbarLink
              active={path === "/all-posts"}
              as="div"
              className={`
    rounded-xl w-full
    ${
      path === "/all-posts"
        ? "bg-gradient-to-br from-purple-500 to-blue-500 md:text-white font-semibold"
        : "dark:text-white light:text-black"
    }
  `}
            >
              <Link to="/all-posts" className="w-full flex md:p-2">
                All Posts
              </Link>
            </NavbarLink>
            <NavbarLink
              active={path === "/create-post"}
              as="div"
              className={`
    rounded-xl w-full
    ${
      path === "/create-post"
        ? "bg-gradient-to-br from-purple-500 to-blue-500 md:text-white font-semibold"
        : "dark:text-white light:text-black"
    }
  `}
            >
              <Link to="/create-post" className="w-full flex md:p-2">
                Create Post
              </Link>
            </NavbarLink>
          </>
        ) : (
          <>
            <NavbarLink
              active={path === "/dashboard"}
              as="div"
              className={`
    rounded-xl w-full 
    ${
      path === "/dashboard"
        ? "bg-gradient-to-br from-purple-500 to-blue-500 md:text-white font-semibold"
        : "dark:text-white light:text-black"
    }
  `}
            >
              <Link to="/dashboard?tab=profile" className="w-full flex md:p-2">
                Dashboard
              </Link>
            </NavbarLink>
            <NavbarLink
              active={path === "/all-posts"}
              as="div"
              className={`
    rounded-xl w-full
    ${
      path === "/all-posts"
        ? "bg-gradient-to-br from-purple-500 to-blue-500 md:text-white font-semibold"
        : "dark:text-white light:text-black"
    }
  `}
            >
              <Link to="/all-posts" className="w-full flex md:p-2">
                All Posts
              </Link>
            </NavbarLink>
            <NavbarLink
              active={path === "/create-post"}
              as="div"
              className={`
    rounded-xl w-full
    ${
      path === "/create-post"
        ? "bg-gradient-to-br from-purple-500 to-blue-500 md:text-white font-semibold"
        : "dark:text-white light:text-black"
    }
  `}
            >
              <Link to="/create-post" className="w-full flex md:p-2">
                Create Post
              </Link>
            </NavbarLink>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};
