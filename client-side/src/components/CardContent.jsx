import React, { useEffect } from "react";
import axios from "axios";
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
import { useSelector, useDispatch } from "react-redux";
import { authToken } from "../helpers/constant";
import { setContent, setLikes } from "../features/content/contentSlice";
import { useNavigate } from "react-router-dom";

function CardContent() {
  const navigate = useNavigate();
  const contents = useSelector((state) => state.content.contents);
  const likes = useSelector((state) => state.content.likes);
  const dispatch = useDispatch();
  const token = localStorage.getItem(authToken);

  const getAllContent = async () => {
    try {
      if (token) {
        let response = await axios.get(
          "http://localhost:2000/content/",

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(setContent(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getContentDetail = async () => {
    try {
      if (token) {
        let response = await axios.get(
          `http://localhost:2000/content/`,
          contents.uuid,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(setContent(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const likesContent = async (id) => {
    try {
      if (token) {
        let response = await axios.post(
          `http://localhost:2000/content/${id}/likes`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(setContent(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllContent();
  }, []);

  return (
    <div>
      {contents.map((content) => (
        <div className="my-11">
          <Card maxW="lg">
            <CardHeader>
              <Flex spacing="4">
                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                  <Avatar
                    name={content.username}
                    src={`${process.env.REACT_APP_API_BE}/${content.profile_picture}`}
                  />

                  <Box>
                    <Heading size="sm">{content.username}</Heading>
                  </Box>
                </Flex>
                <IconButton
                  variant="ghost"
                  colorScheme="gray"
                  aria-label="See menu"
                />
              </Flex>
            </CardHeader>
            <CardBody>
              <Text>{content.caption}</Text>
            </CardBody>
            <Image
              // objectFit="cover"
              className=""
              src={`${process.env.REACT_APP_API_BE}/${content.media}`}
              onClick={() => navigate(`/c/${content.uuid}`)}
            />

            <CardFooter
              justify="space-between"
              flexWrap="wrap"
              sx={{
                "& > button": {
                  minW: "136px",
                },
              }}
            >
              <Button
                flex="1"
                variant="ghost"
                onClick={(e) => {
                  likesContent(content.id_content);
                }}
              >
                Like
              </Button>
              <p flex="1" variant="ghost">
                {content.likes} likes
              </p>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default CardContent;
