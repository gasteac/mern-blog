import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button, Modal, Table } from "flowbite-react";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {FaCheck, FaTimes} from "react-icons/fa";
export const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdtoDelete, setUserIdtoDelete] = useState("");
  const [usertoDelete, setUsertoDelete] = useState("");
  const [imageToDelete, setImageToDelete] = useState(null);
  const [userPic, setUserPic] = useState(null)
  const storage = getStorage();

  const handleShowMore = async () => {
    const startIndex = users?.length;
    try {
      const res = await axios.get(`api/user/getusers?startIndex=${startIndex}`);
      if (res.statusText === "OK") {
        setTimeout(() => {
          setUsers([...users, ...res?.data?.users]);
        }, 200);
        if (res.data.users.length < 500) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //   const handleDelete = async () => {
  //     try {
  //       const response = await axios.delete(
  //         `api/user/deleteuser/${userIdtoDelete}`
  //       );

  //       if (response.status === 200) {
  //         setUsers(users.filter((user) => user._id !== userIdtoDelete));
  //         // Crear una referencia no raíz utilizando child
  //         const fileRef = ref(storage, imageToDelete);
  //         if (imageToDelete === null) {
  //           return;
  //         } else {
  //           // Eliminar el archivo utilizando la referencia no raíz
  //           await deleteObject(fileRef);
  //         }
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       // Manejar el error de forma adecuada
  //     }
  //   };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`api/user/getusers`);

        const { data } = res;
        if (res.status === 200) {
          setUsers(data.users);
          if (data.users.length < 5) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  return (
    <div className="p-4 table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-transparent dark:scrollbar-thumb-transparent">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="bg-white dark:bg-slate-800 rounded-xl">
            <Table.Head>
              <Table.HeadCell className="text-nowrap">
                date created
              </Table.HeadCell>
              <Table.HeadCell className="text-nowrap">
                user image
              </Table.HeadCell>
              <Table.HeadCell className="text-nowrap">username</Table.HeadCell>
              <Table.HeadCell className="text-nowrap">email</Table.HeadCell>
              <Table.HeadCell>admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users?.map((user) => (
              <Table.Body key={user._id} className="divide-y-2">
                <Table.Row>
                  <Table.Cell as="div">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePic}
                      alt={user.username}
                      className="min-w-20 w-32 h-auto object-cover rounded-lg"
                    />
                  </Table.Cell>
                  <Table.Cell className="font-medium ">
                    {user.username}
                  </Table.Cell>
                  <Table.Cell className="font-medium">{user.email}</Table.Cell>
                  <Table.Cell className="font-medium">
                    {user.isAdmin ? (
                      <FaCheck className="text-emerald-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdtoDelete(user._id);
                        setUsertoDelete(user.username);
                        setUserPic(user.profilePic);
                        setImageToDelete(
                          user.profilePic.includes(
                            "video-tutoriales-sobre-email-marketing"
                          )
                            ? null
                            : user.image
                        );
                      }}
                      className="cursor-pointer text-red-500 font-medium hover:underline"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full my-5 self-center font-bold "
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <div className="w-full h-full">There are no users yet</div>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body className="flex items-center justify-center flex-col gap-3">
          <img
            src={userPic}
            className="min-w-20 w-24 h-auto object-cover rounded-lg"
          />
          <h1 className="text-center text-2xl font-semibold">
            Delete "{usertoDelete}" ?
          </h1>
          <div className="flex justify-between gap-5">
            <Button
              color="failure"
              onClick={() => {
                handleDelete();
                setShowModal(false);
              }}
            >
              delete it
            </Button>
            <Button
              onClick={() => setShowModal(false)}
              gradientDuoTone="greenToBlue"
            >
              cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};