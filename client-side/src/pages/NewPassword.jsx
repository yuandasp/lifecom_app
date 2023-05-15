import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { setUser } from "../features/user/userSlice";
import { useDispatch } from "react-redux";
import { authToken } from "../helpers/constant";
import { Button } from "@chakra-ui/react";

function NewPassword() {
  let { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const newPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .required("This field is required")
      .min(8, "Password too short"),
    repeatPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Password must match"
    ),
  });

  const resetPassword = async (value, actions) => {
    try {
      setIsLoading(true);
      let response = await axios.post(
        `${process.env.REACT_APP_API_BE}/auth/change-password`,
        value,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message,
        footer: "",
      });
      setIsLoading(false);

      navigate("/login");
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
          password: "",
        }}
        validationSchema={newPasswordSchema}
        onSubmit={(value, actions) => {
          resetPassword(value);
        }}
      >
        {(props) => {
          return (
            <>
              <div className="flex h-screen items-start justify-center px-4 sm:px-6 lg:px-8 bg-slate-50">
                <div className="w-full h-2/5 max-w-lg my-auto px-14 py-4 bg-white border rounded-md box-shadow-register">
                  <div className="flex gap-2 items-end justify-center">
                    <p className="text-center text-2xl text-purple-900">
                      Reset Password
                    </p>
                  </div>
                  <Form className="mt-8 space-y-6" action="#" method="POST">
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm">
                      <div className="my-4">
                        <label
                          htmlFor="password"
                          className="sr-only block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Password
                        </label>
                        <Field
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="password"
                          required
                          className="pl-4 relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-purple-900 sm:text-sm sm:leading-6"
                          placeholder="New password"
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
                        className="group relative flex w-full justify-center rounded-md bg-purple-900 px-3 py-2 text-lg font-semibold text-white hover:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        Save password
                      </Button>

                      <Link to={"/login"}>
                        <div className="flex gap-2 items-end justify-end py-1">
                          <p className="text-purple-900 text-end text-xs my-2 ">
                            Back to login
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

export default NewPassword;
