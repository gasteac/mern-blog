import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  signInFailure,
  signInInProcess,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { OAuth } from "../components";

export const SignIn = () => {
  // useDispatch es un hook que nos permite disparar acciones al store de Redux.
  const dispatch = useDispatch();
  // Obtengo error e isLoading del estado global de user
  const { error: credentialErrorMsg, isLoading } = useSelector(
    (state) => state.user
  );
  // navigate es una función que nos permite redirigir al usuario a otra ruta.
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Required!"),
      password: Yup.string()
        .required("Required!")
        .min(6, "Must be 6 characters or more"),
    }),
    onSubmit: async ({ email, password }) => {
      try {
        // Cuando el usuario envía el formulario, se dispara la acción SignInStart, que cambia el estado isLoading a true.
        dispatch(signInStart());
        // Hacemos una petición POST a la ruta /api/auth/signin con los datos del formulario. (trim saca los espacios en blanco al principio y al final de un string)
        const res = await axios.post("/api/auth/signin", {
          email: email.trim(),
          password: password.trim(),
        });
        const { data } = res;
        // Si la petición es exitosa, se dispara la acción SignInSuccess, que guarda el usuario en el estado global y redirige al usuario a la página principal.
        if (res.statusText === "OK") {
          navigate("/");
          //rest es un objeto con los datos del usuario
          dispatch(signInSuccess(data.rest));
        }
      } catch (error) {
        // Si hay un error en la petición, se dispara la acción SignInFailure, que guarda el mensaje de error en el estado global.
        const message = error.response.data.message;
        if (message.includes("Email") || message.includes("Password")) {
          dispatch(signInFailure(message));
        }
      }
    },
  });

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left side */}
        <div className="flex-1 self-center md:self-start md:mt-16">
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
            {credentialErrorMsg ? (
              <Alert className=" text-red-500 text-[0.8rem]  phone:text-[1rem] tablet:text-[1.2rem]">
                {credentialErrorMsg}
              </Alert>
            ) : null}
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
                onChange={(e) => {
                  formik.handleChange(e), dispatch(signInInProcess());
                }}
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
                placeholder="*********"
                id="password"
                name="password"
                onChange={(e) => {
                  formik.handleChange(e), dispatch(signInInProcess());
                }}
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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span className="ml-3">Loading..</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </Button>
            <OAuth></OAuth>
          </form>
          <div className="flex gap-2 justify-end px-1 text-sm mt-3">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
