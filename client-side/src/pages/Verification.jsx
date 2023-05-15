import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Verification() {
  let { token } = useParams();
  const navigate = useNavigate();

  const tokenVerification = async () => {
    try {
      if (token) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BE}/auth/verification`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: response.data.message,
            footer: "",
          });
          navigate("/login");
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    tokenVerification();
  }, []);

  return (
    <div>
      <p>Your account is being verified</p>
      <p>{token}</p>
      {/* pake useeffect untuk lempar ke backend */}
    </div>
  );
}

export default Verification;
