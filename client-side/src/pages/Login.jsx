import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { setUser } from "../features/user/userSlice";
import { useDispatch } from "react-redux";
import { authToken } from "../helpers/constant";
import {
  Button,
  Checkbox,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

  const loginSchema = Yup.object().shape({
    input: Yup.string().required("This field is required"),
    password: Yup.string()
      .required("This field is required")
      .min(8, "Password too short"),
  });

  const loginUser = async (value, actions) => {
    try {
      setIsLoading(true);
      let response = await axios.post(
        "http://localhost:2000/auth/login",
        value
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message,
        footer: "",
      });
      setIsLoading(false);

      if (response.data?.token) {
        localStorage.setItem(authToken, response.data?.token);
        dispatch(setUser(response.data.data));
        navigate("/");
      }
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data?.message || "Something went wrong!!",
      });
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          input: "",
          password: "",
        }}
        validationSchema={loginSchema}
        onSubmit={(value, actions) => {
          loginUser(value);
        }}
      >
        {(props) => {
          return (
            <>
              <div className="flex h-screen items-start justify-center px-4 sm:px-6 lg:px-8 bg-blue-900">
                <div className="w-full h-2/5 max-w-lg my-auto px-14 py-4 bg-white border rounded-md box-shadow-register">
                  <div className="flex gap-2 items-end justify-center">
                    <p className="text-center text-2xl text-blue-900">
                      Login to
                    </p>
                    <p className="text-center text-4xl font-bold text-blue-900 tracking-tighter">
                      Cashier App
                    </p>
                  </div>
                  <Form className="mt-8 space-y-6" action="#" method="POST">
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm">
                      <div className="my-4">
                        <label
                          htmlFor="input"
                          className="sr-only block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Email address
                        </label>
                        <Field
                          id="input"
                          name="input"
                          type="text"
                          autoComplete="input"
                          required
                          className="pl-4 relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-900 sm:text-sm sm:leading-6"
                          placeholder="Email or username"
                        />

                        <ErrorMessage
                          component="div"
                          name="input"
                          style={{ color: "red", fontSize: "12px" }}
                        />
                      </div>
                      <div className="my-4">
                        <label htmlFor="password" className="sr-only">
                          Password
                        </label>
                        <Field
                          id="password"
                          name="password"
                          type={show ? "text" : "password"}
                          required
                          className="pl-4 relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-900 sm:text-sm sm:leading-6"
                          placeholder="Password"
                          autoComplete="new-password"
                        />
                        <ErrorMessage
                          component="div"
                          name="password"
                          style={{ color: "red", fontSize: "12px" }}
                        />
                      </div>
                    </div>
                    <Checkbox
                      style={{
                        background: "transparent",
                        color: "black",
                        marginTop: "0px",
                      }}
                      onChange={(event) => setShow(event.target.checked)}
                    >
                      <p style={{ fontSize: "14px" }}>Show Password</p>
                    </Checkbox>
                    <div>
                      <Button
                        isLoading={isLoading}
                        colorScheme="blue"
                        type="submit"
                        className="group relative flex w-full justify-center rounded-md bg-blue-900 px-3 py-2 text-lg font-semibold text-white hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        Log in
                      </Button>

                      <div className="flex gap-2 items-end justify-end py-1">
                        <p className="text-blue-900 text-end text-xs my-2 ">
                          Don't have an account?
                        </p>
                        <Link to={"/register"}>
                          <p className="text-blue-900 text-end font-bold text-sm my-2 hover:text-blue-600">
                            Sign up
                          </p>
                        </Link>
                      </div>
                      <Link to={"/reset-password"}>
                        <div className="flex gap-2 items-end justify-end py-1">
                          <p className="text-blue-900 text-end text-xs my-2 ">
                            Forgot Password
                          </p>
                        </div>
                      </Link>
                    </div>
                  </Form>
                </div>
              </div>
            </>
          );
        }}
      </Formik>
    </div>
  );
}

export default Login;
