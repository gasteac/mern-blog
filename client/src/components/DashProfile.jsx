import React from "react";
import { useSelector } from "react-redux";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";

export const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto w-full p-3">
      <h1 className="my-7 text-center font-semibold text-3xl">
        <span className="text-emerald-500">Hi </span>{currentUser.username}
      </h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer shadow-lg overflow-hidden rounded-full">
          <img
            src={currentUser.profilePic}
            alt="user"
            className="rounded-full w-full h-full border-8 object-cover border-[lightgray]"
          />
        </div>
        <TextInput
          type="text"
          label="Username"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          label="Email"
          id="email"
          placeholder="email@company.com"
          defaultValue={currentUser.email}
        />{" "}
        <TextInput
          type="password"
          label="Password"
          id="username"
          placeholder="********"
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          <span>Update</span>
        </Button>
      </form>
      <div className="text-red-500 justify-between flex mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};
