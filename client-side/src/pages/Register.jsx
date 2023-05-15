import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "@chakra-ui/react";

function Register() {
  const [isLoading, setIsLoading] = useState(false);

  const registerSchema = Yup.object().shape({
    username: Yup.string().required("This field is required"),
    email: Yup.string()
      .email("Wrong email format")
      .required("This field is required"),
    password: Yup.string()
      .required("This field is required")
      .min(8, "Password too short"),
    repeatPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Password must match"
    ),
  });

  const registerUser = async (value, actions) => {
    try {
      setIsLoading(true);
      let response = await axios.post(
        `${process.env.REACT_APP_API_BE}/auth/register`,
        value
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message,
        footer: "",
      });

      setIsLoading(false);
      actions.resetForm({
        username: "",
        email: "",
        password: "",
        repeatPassword: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data?.message || "Something went wrong!!",
      });
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          repeatPassword: "",
        }}
        validationSchema={registerSchema}
        onSubmit={(value, actions) => {
          registerUser(value, actions);
        }}
      >
        {(props) => {
          return (
            <>
              <div className="flex h-screen items-start justify-center px-4 py-8 sm:px-6 lg:px-8 bg-blue-900">
                <div className="w-full h-2/3 max-w-lg py-11 px-14 bg-slate-50 rounded-md box-shadow-register">
                  <div className="flex gap-2 items-end justify-center">
                    <p className="text-center text-2xl text-blue-900">
                      Sign up to
                    </p>
                    <p className="text-center text-4xl font-bold text-blue-900 tracking-tighter">
                      Lifecom App
                    </p>
                  </div>
                  <Form className="mt-8 space-y-6" action="#" method="POST">
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm">
                      <div className="my-4">
                        <label htmlFor="username" className="sr-only">
                          Username
                        </label>
                        <Field
                          id="username"
                          name="username"
                          type="text"
                          required
                          className="pl-4 relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-900 sm:text-sm sm:leading-6"
                          placeholder="Username"
                          autoComplete="username"
                        />
                        <ErrorMessage
                          component="div"
                          name="username"
                          style={{ color: "red", fontSize: "12px" }}
                        />
                      </div>
                      <div className="my-4">
                        <label
                          htmlFor="email-address"
                          className="sr-only block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Email address
                        </label>
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className="pl-4 relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-900 sm:text-sm sm:leading-6"
                          placeholder="Email"
                        />

                        <ErrorMessage
                          component="div"
                          name="email"
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
                          type="password"
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
                      <div className="my-4">
                        <label htmlFor="repeatPassword" className="sr-only">
                          Repeat Password
                        </label>
                        <Field
                          id="repeatPassword"
                          name="repeatPassword"
                          type="password"
                          required
                          className="pl-4 relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-900 sm:text-sm sm:leading-6"
                          placeholder="Repeat Password"
                        />
                        <ErrorMessage
                          component="div"
                          name="repeatPassword"
                          style={{ color: "red", fontSize: "12px" }}
                        />
                      </div>
                    </div>
                    <div>
                      <Button
                        isLoading={isLoading}
                        colorScheme="blue"
                        type="submit"
                        className="group relative flex w-full justify-center rounded-md bg-blue-900 px-3 py-2 text-lg font-semibold text-white hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        Sign up
                      </Button>

                      <div className="flex gap-2 items-end justify-end py-1">
                        <p className="text-blue-900 text-end text-xs my-2 ">
                          Already have an account?
                        </p>
                        <Link to={"/login"}>
                          <p className="text-blue-900 text-end font-bold text-sm my-2 hover:text-blue-600">
                            Log in
                          </p>
                        </Link>
                      </div>
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

export default Register;
