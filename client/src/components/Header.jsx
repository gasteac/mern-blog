import React from "react";
import { Button, Navbar, NavbarLink, NavbarToggle, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

export const Header = () => {
  const path = useLocation().pathname
  return (
    <Navbar className="border-b-4">
      <Link
        to="/"
        className="text-sm sm:text-xl font-semibold  dark:text-white  uppercase"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-emerald-500 via-emerald-800 to-teal-800 rounded-lg text-white">
          MaNaDa
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
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaMoon />
        </Button>
        <Link to="sign-in">
          <Button gradientDuoTone="purpleToBlue" outline>Sign In</Button>
        </Link>
        <NavbarToggle></NavbarToggle>
      </div>
      <Navbar.Collapse>
        <NavbarLink active={path === "/"} as={'div'}>
          <Link to="/">Home</Link>
        </NavbarLink>
        <NavbarLink active={path === "/about"} as={'div'}>
          <Link to="/about">About</Link>
        </NavbarLink>
        <NavbarLink active={path === "/projects"} as={'div'}>
          <Link to="/projects">Projects</Link>
        </NavbarLink>
      </Navbar.Collapse>
    </Navbar>
  );
};
