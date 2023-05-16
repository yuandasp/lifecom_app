import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authToken } from "../helpers/constant";
import { setContent, setContentDetail } from "../features/content/contentSlice";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Flex,
  Avatar,
  Box,
  Heading,
  Text,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

function PostDetails() {
  const navigate = useNavigate();
  const token = localStorage.getItem(authToken);
  const dispatch = useDispatch();
  const content = useSelector((state) => state.content.contentDetail);
  const params = useParams();

  const getDetailContent = async () => {
    try {
      if (token) {
        let response = await axios.get(
          `http://localhost:2000/content/${params.uuid}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(setContentDetail(response.data[0]));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDetailContent();
  }, []);

  return (
    <div className="bg-slate-50 w-screen flex justify-center">
      <div className="py-11">
        <Card maxW="lg">
          <p
            className="mx-4 my-4 text-blue-500 cursor-pointer"
            onClick={() => navigate("/")}
          >
            {"<"} Back to Home
          </p>
          <Image
            boxSize="300px"
            htmlHeight="200px"
            htmlWidth="300px"
            className="mx-auto my-4"
            src={`${process.env.REACT_APP_API_BE}/${content.media}`}
          />
          <div className="flex gap-4 mx-4">
            <p>{content.likes} likes</p>
            <p>5 Comments</p>
          </div>
          <p className="my-4 mx-8">{content.caption}</p>
          <hr className="mx-4" />
          <br />
          <p className="mt-6 mx-4 mb-4">Comments</p>
          <div className="flex gap-2 mb-2">
            <p className="font-bold mx-4">xese</p>
            <p className="mx-4">Hahahahahahahahaha</p>
          </div>
          <hr className="mx-4 " />
          <div className="flex gap-2 my-2">
            <p className="font-bold mx-4">zazaza</p>
            <p className="mr-2">
              Duis ullamcorper sem eget magna sollicitudin, ut rutrum ipsum
              venenatis. Nam at magna libero
            </p>
          </div>
          <hr className="mx-4" />
          <div className="flex gap-4 my-2">
            <p className="font-bold mx-4">davon</p>
            <p className="mr-2">Fusce mattis rhoncus rutrum</p>
          </div>
          <hr className="mx-4" />
          <div className="flex gap-2 my-2">
            <p className="font-bold mx-4">zilebe2</p>
            <p className="mr-2">
              Nam sodales purus vel eros aliquam, eu porta dui pretium
            </p>
          </div>
          <hr className="mx-4" />
          <div className="flex gap-2 my-2">
            <p className="font-bold mx-4">kenang</p>
            <p>Quisque aliquet mi tortor, et malesuada arcu tincidunt nec.</p>
          </div>
          <hr className="mx-4" />
          <div className="font-bold text-sm text-center my-4">
            View all comments
          </div>
        </Card>
      </div>
    </div>
  );
}

export default PostDetails;
