import React, { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export const SignUp = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Required!"),
      email: Yup.string().required("Required!"),
      password: Yup.string()
        .required("Required!")
        .min(6, "Must be 6 characters or more"),
    }),
    onSubmit: async ({ username, email, password }) => {
      try {
        const res = await axios.post("/api/auth/signup", {
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
        });
        formik.resetForm();
      } catch (error) {
        if (error.response.data.message.includes("duplicate")) {
          setErrorMsg("Email already in use");
        }
      }
    },
  });

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left side */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-emerald-500 via-emerald-800 to-teal-800 rounded-lg text-white">
              MANADA
            </span>
          </Link>
          <p className="text-sm mt-5">Stay quiet, manada is coming.</p>
        </div>
        {/* right side */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
            <div className="group">
              <Label
                value="Username"
                className="group-focus-within:text-green-700"
              ></Label>
              <TextInput
                type="text"
                placeholder="username"
                id="username"
                name="username"
                onChange={formik.handleChange}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username ? (
                <h6 className="ml-2 text-red-300 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
                  {formik.errors.username}
                </h6>
              ) : null}
            </div>
            <div className="group">
              <Label
                value="Email"
                className="group-focus-within:text-green-700"
              ></Label>
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <h6 className="ml-2 text-red-300 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
                  {formik.errors.email}
                </h6>
              ) : null}
            </div>
            <div className="group">
              <Label
                value="Password"
                className="group-focus-within:text-green-700"
              ></Label>
              <TextInput
                type="password"
                placeholder="password"
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <h6 className="ml-2 text-red-300 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
                  {formik.errors.password}
                </h6>
              ) : null}
            </div>
            <Button
              className="bg-gradient-to-r from-emerald-500 via-emerald-800 to-teal-800"
              type="submit"
            >
              Sign Up
            </Button>
          </form>
          <div className="flex gap-2 justify-end px-1 text-sm mt-3">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
