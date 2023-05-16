import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { authToken } from "../helpers/constant";
import { setUser, setContentUser } from "../features/user/userSlice";
import { setContent } from "../features/content/contentSlice";
import { Image, Button, useDisclosure, Input } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Avatar,
  Box,
  Heading,
  Text,
  IconButton,
} from "@chakra-ui/react";
import Swal from "sweetalert2";

function Profile() {
  const token = localStorage.getItem(authToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataUser = useSelector((state) => state.user.user);
  const idUser = dataUser.id_user;
  const contents = useSelector((state) => state.user.contentUser);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState({ fullname: "", username: "", bio: "" });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formEdit, setFormEdit] = useState({ caption: "", id_content: "" });
  const [modalEditContent, setModalEditContent] = useState(false);

  const onFileChange = (event) => {
    console.log(event);
    // setFile(event.target.files[0]);
    let preview = document.getElementById("imagepreview");
    preview.src = URL.createObjectURL(event.target.files[0]);
    console.log(preview);
    uploadImage(event.target.files[0]);
  };

  const uploadImage = async (file) => {
    setIsLoading(true);
    try {
      if (file) {
        let formData = new FormData();
        formData.append("file", file);

        let response = await axios.post(
          `${process.env.REACT_APP_API_BE}/profile/upload`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.error) {
          alert("Upload berhasil");
        }
        localStorage.setItem("profilePict", response.data.filepath);
        navigate("/profile");
      } else {
        alert("select image first");
      }
      setIsLoading(false);
    } catch (error) {
      alert("error");
    }
  };

  const editProfile = async (event) => {
    // console.log(event.preventDefault());
    // console.log(event.target.value);
    try {
      event.preventDefault();
      const { fullname, username, bio } = form;

      if (token) {
        let response = await axios.patch(
          `http://localhost:2000/profile/`,
          { fullname, username, bio },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // console.log(response.data[0]);
        dispatch(setUser(response.data[0]));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      if (token) {
        let response = await axios.get(`http://localhost:2000/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setUser(response.data[0]));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getContentByIdUser = async () => {
    try {
      if (token) {
        let response = await axios.get(`http://localhost:2000/content/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setContentUser(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    // console.log(event.target.value);
    const key = event.target.name;
    setForm({ ...form, [key]: event.target.value });
  };

  const handleDelete = async (event) => {
    try {
      const id = event.target.value;
      console.log("id", id);
      if (token) {
        let response = await axios.delete(
          `http://localhost:2000/content/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        getContentByIdUser();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editContent = async (event) => {
    try {
      event.preventDefault();

      const { caption, id_content } = formEdit;

      if (token) {
        let response = await axios.patch(
          `http://localhost:2000/content/${id_content}`,
          { caption },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setModalEditContent(false);
        console.log(response.data);
        dispatch(setContentUser(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeEdit = async (event) => {
    const key = event.target.name;
    setFormEdit({ ...formEdit, [key]: event.target.value });
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (idUser) {
      getContentByIdUser();
    }
  }, [idUser]);

  useEffect(() => {
    if (dataUser.id_user) {
      setForm({
        fullname: dataUser.fullname,
        username: dataUser.username,
        bio: dataUser.bio,
      });
    }
  }, [dataUser.id_user]);

  return (
    <div className="w-screen h-screen flex justify-between bg-slate-50">
      <div className="">
        <Sidebar />
      </div>
      <div className="w-3/4 px-40 my-8">
        <div className="">
          <div className="flex justify-center gap-11 flex-wrap">
            <div>
              <Image
                borderRadius="full"
                boxSize="150px"
                src={`${process.env.REACT_APP_API_BE}/${dataUser.profile_picture}`}
                alt={dataUser.fullname}
                id="imagepreview"
              />
              <br />
              <input
                type="file"
                id="actual-btn"
                hidden
                onChange={(event) => onFileChange(event)}
              />
              <label
                for="actual-btn"
                className="text-sm bg-slate-200 text-black border border-black ml-4"
              >
                Change Picture
              </label>
            </div>
            <div className="flex gap-4">
              <div className="ml-8">
                <p className="font-bold text-4xl mb-2">{dataUser.fullname}</p>
                <p>@{dataUser.username}</p>
                <p className="mt-2">{dataUser.bio}</p>
              </div>
              <div className="mt-2">
                <Button size="sm" colorScheme="blue" onClick={onOpen}>
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-9">
          <hr />
          <div className="flex gap-6 my-11 flex-wrap">
            {contents.map((content) => (
              <div className="">
                <div className="my-11">
                  <Card maxW="lg">
                    <Image
                      boxSize="300px"
                      htmlHeight="200px"
                      htmlWidth="300px"
                      className=""
                      src={`${process.env.REACT_APP_API_BE}/${content.media}`}
                    />
                    <p className="m-4">{content.caption}</p>
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
                        onClick={handleDelete}
                        value={content.id_content}
                      >
                        Delete
                      </Button>
                      <Button
                        flex="1"
                        variant="ghost"
                        onClick={() => {
                          console.log({ content });
                          setFormEdit({
                            caption: content.caption,
                            id_content: content.id_content,
                          });
                          setModalEditContent(true);
                        }}
                      >
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <form onSubmit={editProfile}>
                <ModalHeader>Edit Profile</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                  <div className="my-6">
                    <label htmlFor="fullname" className="sr-only" />
                    Fullname :
                    <Input
                      id="fullname"
                      name="fullname"
                      type="text"
                      value={form.fullname}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="my-6">
                    <label htmlFor="username" className="sr-only" />
                    Username :
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={form.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="my-6">
                    <label htmlFor="bio" className="sr-only" />
                    Bio :
                    <br />
                    <textarea
                      id="bio"
                      name="bio"
                      rows="4"
                      cols="61"
                      className="border rounded-md"
                      value={form.bio}
                      onChange={handleChange}
                    />
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    type="submit"
                    onClick={onClose}
                  >
                    Save
                  </Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        </div>
        <div>
          <Modal
            isOpen={modalEditContent}
            onClose={() => setModalEditContent(false)}
          >
            <ModalOverlay />
            <ModalContent>
              <form onSubmit={editContent}>
                <ModalHeader>Edit Post</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <div className="my-6">
                    <label htmlFor="caption" className="sr-only" />
                    Caption :
                    <Input
                      id="caption"
                      name="caption"
                      type="text"
                      value={formEdit.caption}
                      onChange={handleChangeEdit}
                    />
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    // onClick={}
                    type="submit"
                  >
                    Save
                  </Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Profile;
