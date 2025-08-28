import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Badge,
  Button,
  Checkbox,
  Progress,
  useToast,
} from "@chakra-ui/react";

import { Switch } from "@chakra-ui/react";
import { FaGamepad, FaRegEdit, FaUsers } from "react-icons/fa";
import { IoSettings, IoWallet } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { GiCard3Diamonds } from "react-icons/gi";
import { MdPendingActions } from "react-icons/md";
import { useSelector } from "react-redux";
import { FcViewDetails } from "react-icons/fc";
import { fetchGetRequest, sendPatchRequest, sendPostRequest } from "../api/api";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UpdatePriority from "../Modals/UpdatePriority";
import { checkPermission, parseData } from "../../utils/utils";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { RiFileList2Fill } from "react-icons/ri";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { RxUpdate } from "react-icons/rx";
import { FaTrash } from "react-icons/fa6";

const MoreProvider = ({
  apiProviderName,
  limit,
  search,
  statusQuery,
  setStatusQuery,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingProvider, setProviderLoading] = useState(true);
  const { iconColor, bg, border } = useSelector((state) => state.theme);
  const { t, i18n } = useTranslation();

  const [casinoProvider, setCasinoProvider] = useState([]);
  const toast = useToast();
  const [pagination, setPagination] = useState({});
  const [loaderActive, setLoaderActive] = useState();
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [prioritySort, setPrioritySort] = useState(null);
  const [providerSort, setProviderSort] = useState(null);
  const [updateNameLoading, setUpdateNameLoading] = useState(false);
  const [activeProviderID, setActiveProviderID] = useState(false);
  const totalPages = pagination?.totalPages;
  const [providerCounts, setProviderCount] = useState({
    activeCount: 0,
    inactiveCount: 0,
    totalCount: 0,
  });
  const [ selectedProviders, setSelectedProviders] = useState([])
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;

  const permissionDetails = user?.user?.permissions;

  let hasPermission = checkPermission(permissionDetails, "gameView");
  let check = !isOwnerAdmin ? hasPermission : true;

  let hasPermission1 = checkPermission(permissionDetails, "providerManage");
  let providerManage = !isOwnerAdmin ? hasPermission1 : true;

  const [status, setStatus] = useState("");
  const getAllCasinoProvider = async () => {
    setProviderLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/secondary-provider/get-provider?api_provider_name=${apiProviderName}&search=${search}&page=${currentPage}&limit=${limit}`;

    if (statusQuery == true || statusQuery === false) {
      url += `&status=${statusQuery}`;
    }

    url += `&provider_sort=${providerSort}`;
    url += `&priority_sort=${prioritySort}`;

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data;
      setCasinoProvider(receivedData);
      setPagination(response.pagination);
      setProviderCount(response.providerCounts);

      setProviderLoading(false);
    } catch (error) {
      toast({
        description: `${
          error?.data?.message || error?.response?.data?.message
        }`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setProviderLoading(false);
    }
  };

  const handleCasinoStatusUpdate = async (id) => {
    setCasinoProvider(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/secondary-provider/toggle-provider/${id}`;
    try {
      let response = await sendPatchRequest(url);
      const data = response.data;
      const updatedStatus = response.data.status;

      getAllCasinoProvider();
      toast({
        description: `${
          data.status ? "Provider activated" : "Provider diactivated"
        }`,
        status: `${data.status ? "success" : "warning"}`,
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setCasinoProvider(false);
    } catch (error) {
      toast({
        description: `${
          error?.message ||
          error?.response?.data?.message ||
          error?.data?.message
        }`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setCasinoProvider(false);
    }
  };
  useEffect(() => {
    let id;
    id = setTimeout(() => {
      getAllCasinoProvider();
    }, 100);

    return () => clearTimeout(id);
  }, [
    search,
    statusQuery,
    limit,
    currentPage,
    apiProviderName,
    providerSort,
    prioritySort,
  ]);
  const handleStatusChange = (e) => {
    const selectedValue = e.target.value;
    setCurrentPage(1);
    if (selectedValue == "") {
      setStatus("");
      return;
    }
    // Set status to true if selectedValue is "active", false if "inactive", null otherwise
    setStatus(
      selectedValue === "active"
        ? true
        : selectedValue === "inactive"
        ? false
        : null
    );
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSort = (key) => {
    if ("provider" == key) {
      setPrioritySort(null);
      setProviderSort((prev) => (prev == -1 ? 1 : -1));
    } else if ("priority" == key) {
      setProviderSort(null);
      setPrioritySort((prev) => (prev == -1 ? 1 : -1));
    }
  };

  const updateImg = async (imageUrl, providerID) => {
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/secondary-provider/update-image/${providerID}`;
    try {
      const payload = {
        image_url: imageUrl,
        gpid: providerID,
      };
      let response = await sendPatchRequest(url, payload);
      const data = response.data;
      getAllCasinoProvider();
      toast({
        description: `succesfully updated `,
        status: `success`,
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      // setGameLoading(false);
    } catch (error) {
      toast({
        description: `${
          error?.message ||
          error?.response?.data?.message ||
          error?.data?.message
        }`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      // setGameLoading(false);
    }
  };

  const handleImageUpload = async (file, providerID) => {
    setImageUploadLoading(true);
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
        updateImg(response.url, providerID);
        setImageUploadLoading(false);
      }
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({
        title: "Error uploading image",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setImageUploadLoading(false);
    }
  };

  const handleImageChange = async (event, index, providerID) => {
    setLoaderActive(index);
    const file = event.target.files[0];
    handleImageUpload(file, providerID);
  };
  const handleChangeProviderName = (_id, updatedName) => {
    // Update the provider name for the specific _id
    const updatedData = casinoProvider.map((item) =>
      item._id === _id ? { ...item, modified_provider_name: updatedName } : item
    );
    setCasinoProvider(updatedData);
    // You can also make an API call here to update the data on the server
  };

  const handleActiveProviderName = (providerID) => {
    setActiveProviderID(providerID);
  };
  const handleUpdateProviderName = async (providerID, providerName) => {
    setUpdateNameLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/secondary-provider/update-provider-name/${providerID}`;
    try {
      const payload = {
        name: providerName,
        gpid: providerID,
      };
      let response = await sendPatchRequest(url, payload);
      getAllCasinoProvider();
      toast({
        description: `succesfully updated `,
        status: `success`,
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setUpdateNameLoading(false);
    } catch (error) {
      setUpdateNameLoading(false);
      toast({
        description: `${
          error?.message ||
          error?.response?.data?.message ||
          error?.data?.message
        }`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }
  };
  const handleProviderSelection = (providerName) => {
    setSelectedProviders((prev) =>
      prev.includes(providerName)
        ? prev.filter((name) => name !== providerName)
        : [...prev, providerName]
    );
  };
  const handleDeleteProviders = async () => {
    if (selectedProviders.length === 0) {
      toast({
        description: "Please select at least one provider to delete",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      return;
    }
  
    setProviderLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/process-secondary-game/delete-provider-and-games`;
  
    try {
      let response = await sendPostRequest(url, {
        provider_names: selectedProviders,
      });
      getAllCasinoProvider();
      setSelectedProviders([]);
      setProviderLoading(false);
      toast({
        title: "Success",
        description: response?.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    } catch (error) {
      setProviderLoading(false);
    }
  };
  return (
    <div>
    {check && (
        <div className="flex mt-4 gap-2">
          <Button
            leftIcon={<FaTrash />}
            colorScheme="red"
            size="sm"
            onClick={handleDeleteProviders}
            isDisabled={selectedProviders?.length == 0}
          >
            Delete Selected ({selectedProviders?.length})
          </Button>
        </div>
      )}
      <div
        className={` bg-white pb-6 overflow-scroll w-[100wh] rounded-[12px]  `}
      >
        <div className="flex space-x-4  mt-4">
          <p
            onClick={() => setStatusQuery(true)}
            className={`px-6 py-3 text-sm cursor-pointer text-white font-semibold rounded-lg shadow-md bg-green-500 hover:bg-green-600 flex-1 text-center`}
          >
            {providerCounts?.activeCount} {t(`Active`)}
          </p>

          <p
            onClick={() => setStatusQuery(false)}
            className={`px-6 py-3 text-sm cursor-pointer text-white font-semibold rounded-lg shadow-md bg-red-500 hover:bg-red-600 flex-1 text-center`}
          >
            {providerCounts?.inactiveCount} {t(`Inactive`)}
          </p>
        </div>
        <div className="h-[100%] rounded-[16px] w-[100%]">
          <table className="w-full mt-5 border-collapse border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr
                style={{ backgroundColor: bg, color: "white" }}
                className=" text-gray-800 text-[12px] font-semibold"
              >
                <th className="px-4 py-3 text-left border-b pl-[1rem] flex-nowrap border-gray-300 w-[80px]">
                  {t("Sl No")}
                </th>
                <th className="px-4 py-3 text-left border-b  border-gray-300">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProviders(
                          casinoProvider.map((item) => item.provider_id)
                        );
                      } else {
                        setSelectedProviders([]);
                      }
                    }}
                    checked={
                      casinoProvider &&
                      selectedProviders?.length ===
                        (casinoProvider?.length || 0) &&
                      casinoProvider?.length > 0
                    }
                  />
                </th>
                <th className="px-4 py-3 text-left border-b  border-gray-300">
                  {t("Provider Image")}
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-300">
                  {t("ProviderID")}
                </th>
                <th className="px-4  py-3 text-left items-center border-gray-300">
                  {" "}
                  <span>{t("Provider Name (Modified)")}</span>
                </th>
                <th
                  onClick={() => handleSort("provider")}
                  className="px-4 flex py-3 text-left items-center border-gray-300"
                >
                  <span>{t("Provider Name")}</span>
                  {providerSort == 1 && (
                    <AiOutlineArrowUp className="ml-2 text-white" />
                  )}
                  {providerSort == -1 && (
                    <AiOutlineArrowDown className="ml-2 text-white" />
                  )}
                  {providerSort === null && (
                    <AiOutlineArrowUp className="ml-2 text-white" />
                  )}
                </th>

                <th className="px-4 py-3 text-left border-b border-gray-300">
                  {t("Total Games")}
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-300">
                  {t("Provider Type")}
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-300">
                  {t("Status")}
                </th>
                {providerManage && (
                  <th className="px-4 py-3 text-center border-b border-gray-300">
                    {t("Manage Status")}
                  </th>
                )}
                {providerManage && (
                  <th
                    onClick={() => handleSort("priority")}
                    className="px-4 py-3 text-center flex items-center"
                  >
                    <span>{t("Priority")}</span>
                    {prioritySort == 1 && (
                      <AiOutlineArrowUp className="ml-2 text-white" />
                    )}
                    {prioritySort == -1 && (
                      <AiOutlineArrowDown className="ml-2 text-white" />
                    )}
                    {prioritySort === null && (
                      <AiOutlineArrowUp className="ml-2 text-white" />
                    )}
                  </th>
                )}
                {check && (
                  <th className="px-4 py-3 text-center border-b border-gray-300">
                    {t("Manage Games")}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {casinoProvider.length > 0 &&
                casinoProvider.map((item, dex) => (
                  <tr
                    key={item?._id}
                    className="text-sm text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    <td className="px-1 py-1 border-b border-gray-300 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {(currentPage - 1) * limit + dex + 1}
                      </div>
                    </td>
                    <td className="px-1 py-1 border-b border-gray-300 text-center">
                      <input
                        type="checkbox"
                        checked={selectedProviders?.includes(item.provider_id)}
                        onChange={() => handleProviderSelection(item.provider_id)}
                      />
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300">
                      <div className="flex justify-center items-center gap-2">
                        {item?.image_url ? (
                          <img
                            className="w-24 h-16 bg-gray-100 p-2 rounded-lg border border-gray-200"
                            src={item?.image_url}
                            alt="Provider"
                          />
                        ) : (
                          <span className="text-xs text-gray-500 italic">
                            No Image
                          </span>
                        )}
                        {imageUploadLoading && loaderActive === dex && (
                          <div className="w-6">
                            <LoadingSpinner
                              color="green"
                              size="sm"
                              thickness="4px"
                            />
                          </div>
                        )}
                        <div
                          className="flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded bg-gray-50 cursor-pointer hover:border-blue-500"
                          onClick={() =>
                            document.getElementById(`image${dex}`).click()
                          }
                        >
                          <input
                            type="file"
                            accept="image/*"
                            name="image"
                            id={`image${dex}`}
                            className="hidden"
                            onChange={(e) =>
                              handleImageChange(
                                e,
                                dex,
                                item._id,
                                item.provider_id
                              )
                            }
                          />
                          <span className="text-xs text-gray-600">Upload</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300">
                      {item?.provider_id}
                    </td>
                    <td
                      onClick={() => handleActiveProviderName(item._id)}
                      className="px-4 py-3 border-b border-gray-300"
                    >
                      <div className="flex gap-2">
                        <input
                          value={
                            item?.modified_provider_name || item.provider_name
                          }
                          className="w-[100px] border rounded-md flex justify-center items-center p-1"
                          onChange={(e) =>
                            handleChangeProviderName(item?._id, e.target.value)
                          }
                        />
                        {activeProviderID == item._id && (
                          <button
                            disabled={updateNameLoading}
                            onClick={() =>
                              handleUpdateProviderName(
                                item._id,
                                item?.modified_provider_name ||
                                  item.provider_name
                              )
                            }
                            className="text-[12px] flex justify-center items-center  gap-2 bg-black text-white p-2 rounded-md"
                          >
                            <RxUpdate size={"14px"} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300">
                      {item?.provider_name || "-"}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300">
                      {item?.total_games || "-"}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300">
                      {item?.provider_type?.toUpperCase() || "-"}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-300">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item?.status
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {item?.status ? t("Active") : t("Inactive")}
                      </span>
                    </td>
                    {providerManage && (
                      <td className="px-4 py-3 border-b border-gray-300 text-center">
                        <Switch
                          onChange={() => handleCasinoStatusUpdate(item?._id)}
                          size="sm"
                          isChecked={item?.status}
                        />
                      </td>
                    )}
                    {providerManage && (
                      <td className="px-4 py-3 border-b border-gray-300 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-xs font-semibold">
                            {item?.priority}
                          </p>
                          <UpdatePriority
                            gpId={item?.provider_id}
                            getAllCasinoProvider={getAllCasinoProvider}
                            provider_url="secondary-provider"
                          />
                        </div>
                      </td>
                    )}
                    {check && (
                      <td className="px-4 py-3 border-b border-gray-300 text-center">
                        <Link
                          to={`/secondary-casino/${item?.api_provider_name}/${item?.provider_id}`}
                          className="flex justify-center items-center text-blue-500"
                        >
                          <FaGamepad
                            color={bg}
                            fontSize="34px"
                            cursor="pointer"
                          />
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        {casinoProvider?.length > 0 && (
          <p style={{ color: iconColor }} className="text-xs font-semibold ">
            {t(`Showing`)} 1 {t(`to`)} {limit} {t(`of`)}{" "}
            {providerCounts.activeCount + providerCounts.inactiveCount}{" "}
            {t(`Entries`)}
          </p>
        )}
        {casinoProvider && casinoProvider.length > 0 && (
          <div
            className={`text-[16px]   text-sm font-semibold flex  mt-5 mr-5 justify-end gap-3 align-middle items-center`}
          >
            <button
              type="button"
              style={{
                backgroundColor: bg,
                border: `1px solid ${border}60`,
                color: "white",
                fontSize: "12px",
              }}
              className={`ml-1 px-2 py-[4px] cursor-pointer  rounded-[5px] text-[20px]`}
              onClick={() => handlePrevPage()}
              disabled={currentPage == 1}
            >
              {"<"}
            </button>
            {t(`Page`)} <span>{currentPage}</span> {t(`of`)}
            <span>{pagination?.totalPages}</span>
            <button
              onClick={() => handleNextPage()}
              type="button"
              className={`ml-1 px-2 py-[4px] cursor-pointer rounded-[5px] text-[20px]`}
              style={{
                backgroundColor: bg,
                border: `1px solid ${border}60`,
                color: "white",
                fontSize: "12px",
              }}
              disabled={currentPage == pagination?.totalPages}
            >
              {">"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoreProvider;
