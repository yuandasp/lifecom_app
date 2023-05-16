import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authToken } from "../helpers/constant";
import { setContent } from "../features/content/contentSlice";
import Swal from "sweetalert2";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  Image,
} from "@chakra-ui/react";

function Sidebar() {
  const contents = useSelector((state) => state.content.contents);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const token = localStorage.getItem(authToken);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formContent, setFormContent] = useState({ caption: "", media: "" });

  const handleChange = (event) => {
    // console.log(event.target.name);
    // console.log(event.target.value);
    const key = event.target.name;
    setFormContent({ ...formContent, [key]: event.target.value });
  };

  const onFileChange = (event) => {
    // console.log("AAAAAA");
    // console.log(event.target.file[0]);
    let preview = document.getElementById("imagepreview-add-content");
    preview.src = URL.createObjectURL(event.target.files[0]);
    // // console.log(preview);
    // // uploadImage(event.target.files[0]);
    // // const key = event.target.name;
    setFormContent({ ...setFormContent, media: event.target.files[0] });
    // addContent(event.target.files[0]);
  };

  const addContent = async () => {
    // console.log(event.preventDefault());
    // console.log(event.target.value);
    try {
      if (formContent.media) {
        const { caption } = formContent;
        let formData = new FormData();
        formData.append("file", formContent.media);
        formData.append("caption", caption);

        console.log("formdata", formData);
        // event.preventDefault();

        let response = await axios.post(
          `http://localhost:2000/content/`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data[0]);
        dispatch(setContent(response.data));
        if (!response.error) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: response.data.message,
            footer: "",
          });
        }
        // localStorage.setItem("profilePict", response.data.filepath);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform  w-1/4 dark:bg-gray-800 border-r-2 bg-white">
      <div className="">
        <div>
          <p className="font-bold text-4xl mx-16 mt-8">LifeCom</p>
        </div>
        <div className="flex flex-col gap-11 text-2xl ml-16 my-16">
          <div
            className="flex gap-6 hover:cursor-pointer items-center"
            onClick={() => navigate("/")}
          >
            <div className="w-7">
              <svg
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                ></path>
              </svg>
            </div>
            <p>Home</p>
          </div>
          <div
            className="flex gap-6 hover:cursor-pointer items-center "
            onClick={() => navigate("/profile")}
          >
            <div className="w-7">
              <svg
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                ></path>
              </svg>
            </div>
            <p>Profile</p>
          </div>
          <div
            className="flex gap-6 hover:cursor-pointer items-center"
            onClick={onOpen}
          >
            <div className="w-7">
              <svg
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <p>Create</p>
            <div>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <form onSubmit={addContent}>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <div>
                        <Image
                          boxSize="150px"
                          src={`${process.env.REACT_APP_API_BE}/${setFormContent.media}`}
                          id="imagepreview-add-content"
                        />
                        <br />
                        <input
                          type="file"
                          id="create-content"
                          hidden
                          onChange={(event) => onFileChange(event)}
                        />
                        <label
                          for="create-content"
                          className="text-sm bg-slate-200 text-black border border-black ml-4"
                        >
                          Choose Media
                        </label>
                      </div>
                      <div className="my-6">
                        <label htmlFor="caption" className="sr-only" />
                        Caption :
                        <Input
                          id="caption"
                          name="caption"
                          type="text"
                          value={formContent.caption}
                          onChange={handleChange}
                        />
                      </div>
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={onClose}
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
      </div>
    </div>
  );
}

export default Sidebar;
