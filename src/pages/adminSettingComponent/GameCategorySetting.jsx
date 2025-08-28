import React, { useEffect, useState } from "react";
import {
  fetchGetRequest,
  sendDeleteRequest,
  sendPatchRequest,
  sendPostRequest,
} from "../../api/api";
import { useToast, Switch } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../component/loading/LoadingSpinner";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useTranslation } from "react-i18next";
import AddGameCategory from "../../Modals/AddGameCategory";
import { checkPermission } from "../../../utils/utils";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const GameCategorySetting = () => {
  const {
    color,
    primaryBg,
    iconColor,
    secondaryBg,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);
  const { t, i18n } = useTranslation();

  const [gameCategory, setGameCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState("");
  const [btnId, setBtnId] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editpermission, setEditPermission] = useState(-1);
  const [togglingItemId, setTogglingItemId] = useState("");
  const toast = useToast();

  const getGameCategory = async () => {
    setCategoryLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/game-navigation/get-all-game-navigation`;
    try {
      let response = await fetchGetRequest(url);
      setGameCategory(response.data);
      setCategoryLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setCategoryLoading(false);
    }
  };

  const handleUpdateGameCategory = async (item, id) => {
    setBtnId(id);
    setUpdateLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/game-navigation/update-game-navigation/${id}`;

    try {
      let payload = {
        name: item.name,
        icon: selectedImage || item.icon,
        link: item.link,
      };
      let response = await sendPatchRequest(url, payload);
      toast({
        description: `Updated Successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setSelectedImage("");
      getGameCategory();
      setUpdateLoading(false);
      setEditPermission(-1);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setUpdateLoading(false);
    }
  };


  const handleDeleteIcon = async (id) => {
    setUpdateLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/game-navigation/update-game-navigation/${id}`;

    try {
      let payload = {
        icon: "",
      };
      let response = await sendPatchRequest(url, payload);
      toast({
        description: `Updated Successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      getGameCategory();
      setUpdateLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setUpdateLoading(false);
    }
  };

  const handleImageChange = (event, id) => {
    const file = event.target.files[0];
    setUpdatingItemId(id);
    handleImageUpload(file);
  };

  const handleImageUpload = async (file) => {
    setUploadImageLoading(true);
    const formData = new FormData();
    formData.append("post_img", file);
    try {
      const response = await sendPostRequest(
        `${import.meta.env.VITE_API_URL}/api/payment/image-url`,
        formData
      );
      if (response.url) {
        toast({
          title: "Image uploaded successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setSelectedImage(response.url);
        setUploadImageLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error uploading image",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setUploadImageLoading(false);
    }
  };

  const handleChangeCategoryTitle = (e, index, name) => {
    const { value } = e.target;
    const updatedGameCategory = [...gameCategory];
    updatedGameCategory[index] = {
      ...updatedGameCategory[index],
      [name]: value,
    };
    setGameCategory(updatedGameCategory);
  };

  const handleActiveEdit = (index) => {
    setEditPermission(index);
  };
const [toggleLoading,setToggleLoading]=useState(false)
  const handleToggleGameCategory = async (id, name) => {
    setToggleLoading(true);
    setTogglingItemId(id);
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/game-navigation/toggle-game-navigation/${id}`;

    try {
      let response = await sendPatchRequest(url, { name });
      toast({
        description: `Category toggled successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setGameCategory((prevCategories) =>
        prevCategories.map((category) =>
          category._id === id
            ? { ...category, [name]: !category[name] }
            : category
        )
      );
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }finally{
    setToggleLoading(false);
    }
    setTogglingItemId("");
  };

  const handleDeleteCategory = async (id) => {
    try {
      const url = `${
        import.meta.env.VITE_API_URL
      }/api/game-navigation/delete-game-navigation/${id}`;
      let response = await sendDeleteRequest(url);
      toast({
        description: response.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      getGameCategory();
    } catch (error) {
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.index === destination.index) return;

    const reorderedCategories = Array.from(gameCategory);
    const [removed] = reorderedCategories.splice(source.index, 1);
    reorderedCategories.splice(destination.index, 0, removed);

    setGameCategory(reorderedCategories);

    await updateCategoryPriorities(reorderedCategories);
  };

  const updateCategoryPriorities = async (categories) => {
    try {
      await Promise.all(
        categories.map((category, index) => {
          const url = `${
            import.meta.env.VITE_API_URL
          }/api/game-navigation/update-game-navigation/${category._id}`;
          return sendPatchRequest(url, { priority: index + 1 });
        })
      );
      toast({
        description: `Category priorities updated successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }
  };

  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;
  const permissionDetails = user?.user?.permissions;
  let hasPermission = checkPermission(
    permissionDetails,
    "gameNavigationManage"
  );
  let check = !isOwnerAdmin ? hasPermission : true;

  useEffect(() => {
    getGameCategory();
  }, []);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            className="bg-white shadow-md rounded px-3 lg:px-8 pt-6 pb-8 mb-4"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold mb-4">
                {t(`Game`)} {t(`Categories`)}
              </h2>
              <AddGameCategory getGameCategory={getGameCategory} />
            </div>

            {categoryLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2">#</th>
                      <th className="border border-gray-300 p-2 text-left">
                        {t("Category Name")}
                      </th>
                      <th className="border text-left border-gray-300 w-[140px] p-2">
                        {t("Icon")}
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        {t("Link")}
                      </th>
                      <th className="border border-gray-300 p-2">
                        {t("Sidebar View")}
                      </th>
                      <th className="border border-gray-300 p-2">
                        {t("Status")}
                      </th>
                      <th className="border border-gray-300 p-2 text-center">
                        {t("Action")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameCategory.map((category, index) => (
                      <Draggable
                        key={category._id}
                        draggableId={category._id}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            key={category._id}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <td className="border text-center border-gray-300 p-2">
                              {index + 1}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {editpermission === index ? (
                                <input
                                  className={`block border-2 border-gray-300 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 w-full bg-${primaryBg} border-${border} text-${text}`}
                                  type="text"
                                  value={category.name}
                                  onChange={(e) =>
                                    handleChangeCategoryTitle(e, index, "name")
                                  }
                                />
                              ) : (
                                category.name
                              )}
                            </td>

                            <td className="border border-gray-300 p-2">
                              {editpermission === index ? (
                                <div className=" w-full">
                                  <label className="cursor-pointer flex items-center justify-center w-full border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-100 px-2 py-1 text-center">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleImageChange(e, category._id)
                                      }
                                      className="hidden"
                                    />
                                    <span className="text-gray-700">
                                      Upload Image
                                    </span>
                                  </label>
                                </div>
                              ) : (
                              <div className="flex justify-between px-4 gap-1 items-center">
                                {category.icon ? (
                                  <img
                                    src={category.icon}
                                    alt="Category Icon"
                                    className="h-12"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center p-2 text-xs bg-gray-200 text-gray-600 rounded-md">
                                    No Icon
                                  </div>
                                )}
                                <MdDelete
                                  size="24"
                                  className="cursor-pointer text-red-600 hover:text-red-800"
                                  onClick={() => handleDeleteIcon(category._id)}
                                />
                              </div>
                              )}
                            </td>

                            <td className="border border-gray-300 p-2">
                              {editpermission === index ? (
                                <input
                                  className={`block border-2 border-gray-300 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 w-full bg-${primaryBg} border-${border} text-${text}`}
                                  type="text"
                                  value={category.link}
                                  onChange={(e) =>
                                    handleChangeCategoryTitle(e, index, "link")
                                  }
                                />
                              ) : (
                                category.link
                              )}
                            </td>

                            <td className="border border-gray-300 p-2 text-center">
                              <Switch
                                disabled={toggleLoading&&category._id===togglingItemId}
                                isChecked={category.sidebar_view}
                                onChange={() =>
                                  handleToggleGameCategory(
                                    category._id,
                                    "sidebar_view"
                                  )
                                }
                              />
                            </td>

                            <td className="border border-gray-300 p-2 text-center">
                              <Switch
                                disabled={toggleLoading&&category._id===togglingItemId}
                                isChecked={category.status}
                                onChange={() =>
                                  handleToggleGameCategory(
                                    category._id,
                                    "status"
                                  )
                                }
                              />
                            </td>

                            <td className="border border-gray-300 p-2 text-center">
                              {editpermission === index ? (
                                <button
                                  style={{ backgroundColor: bg }}
                                  className=" text-white font-bold py-2 px-4 rounded"
                                  onClick={() =>
                                    handleUpdateGameCategory(
                                      category,
                                      category._id
                                    )
                                  }
                                >
                                  {updateLoading && btnId === category._id ? (
                                    <LoadingSpinner />
                                  ) : (
                                    "Save"
                                  )}
                                </button>
                              ) : (
                                <div className="flex space-x-4 justify-center items-center">
                                  <FaEdit
                                    style={{ color: color }}
                                    className="cursor-pointer "
                                    onClick={() =>
                                      handleActiveEdit(index, category)
                                    }
                                  />
                                  <MdDelete
                                    className="cursor-pointer text-red-600"
                                    onClick={() =>
                                      handleDeleteCategory(category._id)
                                    }
                                  />
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default GameCategorySetting;
