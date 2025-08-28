import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Badge,
  Button,
  Progress,
  Spinner,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { FaRegCreditCard, FaTrash } from "react-icons/fa6";
import { BsCalendarDateFill } from "react-icons/bs";
import { FaWallet } from "react-icons/fa6";
import { HiCurrencyDollar } from "react-icons/hi2";
import { MdOutlineAccountBalance } from "react-icons/md";
import { GiCardKingClubs, GiWallet } from "react-icons/gi";
import { VscGraphLine } from "react-icons/vsc";
import { Switch } from "@chakra-ui/react";
import { FaRegEdit, FaUsers } from "react-icons/fa";
import { IoSettings, IoWallet } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { GiCard3Diamonds } from "react-icons/gi";
import { MdPendingActions } from "react-icons/md";
import { useSelector } from "react-redux";
import { FcViewDetails } from "react-icons/fc";
import { fetchGetRequest, sendPatchRequest, sendPostRequest } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UpdatePriority from "../Modals/UpdatePriority";
import { checkPermission } from "../../utils/utils";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import MoreProvider from "../component/MoreProvider";

const CasinoManage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingProvider, setProviderLoading] = useState(true);
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

  const [limit, setLimit] = useState("20");
  const [search, setSearch] = useState("");
  const [casinoProvider, setCasinoProvider] = useState([]);
  const toast = useToast();
  const [pagination, setPagination] = useState({});
  const [loaderActive, setLoaderActive] = useState();
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const totalPages = pagination?.totalPages;
  const [selectedProvider, setSelectedProvider] = useState("");
  const [providerName, setProviderName] = useState("");
  const [providerCounts, setProviderCounts] = useState({
    activeCount: 0,
    inactiveCount: 0,
    totalCount: 0,
  });
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [newCasinoGamesLoading, setNewCasinoGamesLoading] = useState(false);
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;
  const permissionDetails = user?.user?.permissions;
  
  let hasPermission = checkPermission(permissionDetails, "gameView");
  let check = !isOwnerAdmin ? hasPermission : true;
  let hasPermission1 = checkPermission(permissionDetails, "providerManage");
  let providerManage = !isOwnerAdmin ? hasPermission1 : true;
  const [status, setStatus] = useState("");
  const [moreProvider, setMoreProvider] = useState([]);
  const navigate=useNavigate()

  const getAllCasinoProvider = async () => {
    setProviderLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/secondary-provider/get-provider?search=${search}&status=${status}&page=${currentPage}&limit=${limit}`;

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data;
      setCasinoProvider(receivedData);
      setPagination(response.pagination);
      setProviderCounts(response?.providerCounts||response?.gameCounts);

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
  const getMoreProvider = async () => {
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/provider-information/get-authorized-provider-information`;

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data.reverse();
      setMoreProvider(receivedData);
      setProviderName(receivedData[0].provider_name);
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
    }
  };

  const handleCasinoStatusUpdate = async (id) => {
    setCasinoProvider(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/casinoprovider/toggle-provider/${id}`;
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
  const [apiProviderName, setApiProviderName] = useState("");
  const handleProcessNewCasinoGamesUpdate = async (providerName) => {
  setApiProviderName(providerName);
if(providerName=== "SBOORIGINAL" ){
    await handleProcessSboOriginal(providerName)
    return;
}
    setNewCasinoGamesLoading(true);
    toast({
      title: "Game Process Notice",
      description: "The game process can take up to 10 minutes or more.",
      status: "info",
      duration: 4000,
      position: "top",
      isClosable: true,
    });

    let provider_name =
      providerName == "NEXUSGGREU"
        ? "nexus"
        : providerName == "EVERGAME"
        ? "evergame"
        : providerName == "DREAMGATES"
        ? "dreamgates"
        : providerName == "WORLDSLOT"
        ? "world"
        :providerName == "DIASLOT"
        ?"diaslot"
        :providerName == "ISOMATSOFT"
        ?"isomatsoft"
        :providerName == "TIMELESS"
        ?"timeless":
        providerName == "GAMES2API"
        ?"games2api": providerName == "FOREVER"?"forever":"";


    if (provider_name == "") return;
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/process-secondary-game/process-${provider_name}-game-data`;
    try {
      let response = await sendPostRequest(url);
      const data = response.data;

      toast({
        title: "Success",
        description: response?.data?.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });

      setNewCasinoGamesLoading(false);
      getAllCasinoProvider()
    } catch (error) {
      console.log("error", "game", error)
      toast({
        description: `${
          error?.message ||
          error?.data?.message ||
          error?.data?.message
        }`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setNewCasinoGamesLoading(false);
    }
  };


  const handleProcessSboOriginal=async()=>{
    setNewCasinoGamesLoading(true);
    toast({
      title: "Game Process Notice",
      description: "The game process can take up to 10 minutes or more.",
      status: "info",
      duration: 4000,
      position: "top",
      isClosable: true,
    });

    let url = `${
      import.meta.env.VITE_API_URL
    }/api/process-primary-game`;
    try {
      let response = await sendPostRequest(url);
      const data = response.data;

      toast({
        title: "Success",
        description: response?.data?.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });

      setNewCasinoGamesLoading(false);
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
      setNewCasinoGamesLoading(false);
    }

  }


  useEffect(() => {
    getMoreProvider();
  }, []);
  useEffect(() => {
    let id;
    id = setTimeout(() => {
      getAllCasinoProvider();
    }, 100);

    return () => clearTimeout(id);
  }, [search, status, limit, currentPage, selectedProvider]);
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

  const updateImg = async (imageUrl, providerID) => {
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/casinoprovider/update-provider-image`;
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

  return (
    <div>
      <div className="flex flex-col items-end gap-3 md:flex-row justify-between px-2">
        <div className="flex items-center md:w-[60%] gap-2">
          <div
            style={{
              border: `1px solid ${border}60`,
              backgroundColor: primaryBg,
            }}
            className={`justify-between rounded-[8px] pl-1 flex items-center gap-2 md:w-[240px]`}
          >
            <input
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              value={search}
              placeholder={`${t(`Search here`)}...`}
              className=" outline-none rounded-[8px] p-[6px]  text-black text-xs md:text-sm  w-[100%]"
            />
            <span
              style={{ backgroundColor: bg }}
              className={`p-[6px] border rounded-r-[8px] cursor-pointer `}
            >
              <IoSearchOutline fontSize={"22px"} color="white" />
            </span>
          </div>

          <select
            style={{
              border: `1px solid ${border}60`,
              backgroundColor: primaryBg,
            }}
            className={`p-[8px]   md:w-[200px] rounded-[6px] text-xs md:text-sm font-semibold border outline-none`}
            onChange={handleStatusChange}
          >
            <option value="">
              {t(`All`)} {t(`Provider`)}
            </option>
            <option value="active">
              {t(`Active`)} {t(`Provider`)}
            </option>

            <option value="inactive">
              {t(`InActive`)} {t(`Provider`)}
            </option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between mr-5">
        <div className="border flex flex-wrap font-bold  md:flex-nowrap items-center gap-6">
          <div className="flex flex-wrap items-center gap-2 lg:gap-5">
            {moreProvider.map((item, index) => {
              return (
                <div className="flex gap-2 items-end font-bold">
                  <p
                    style={{
                      color: iconColor,
                      borderBottom:
                        selectedProvider == index
                          ? `3px solid ${hoverColor}`
                          : "",
                    }}
                    onClick={() => {
                      setSelectedProvider(index);
                      setProviderName(item.provider_name);
                    }}
                    className={`font-bold mt-6 ${
                      selectedProvider === index ? "   pb-1 " : ""
                    } w-[100%] cursor-pointer   flex items-center gap-2 rounded-[6px]  text-lg`}
                  >
                    <GiCardKingClubs
                      style={{ color: iconColor }}
                      fontSize={"30px"}
                    />
                    <span>{item.modified_api_provider_name}</span>
                  </p>
                  <Tooltip
                    label="Click to update the games with the latest information"
                    aria-label="Update games tooltip"
                  >
                    { hasPermission1 ? (
                      <button
                        disabled={newCasinoGamesLoading}
                        className="text-[12px] flex gap-1 bg-black text-white justify-center items-center px-2 py-[4px] rounded-md"
                        onClick={() =>
                          handleProcessNewCasinoGamesUpdate(item.provider_name)
                        }
                      >
                        {apiProviderName == item.provider_name &&
                          newCasinoGamesLoading && (
                            <Spinner my={"1px"} size={"sm"} />
                          )}{" "}
                        UPDATE
                      </button>
                    ) : (
                      <></>
                    )}
                  </Tooltip>
                  <button
                        disabled={newCasinoGamesLoading}
                        className="text-[12px] flex bg-black text-white px-2 py-[4px] rounded-md"
                        onClick={() =>
                           navigate(`/advance-filter-casino/${item.provider_name}/7777`)
                        }
                      >
                        GAMES
                      </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {t(`Show`)}
          <select
            onChange={(e) => setLimit(e.target.value)}
            style={{ border: `1px solid ${border}60` }}
            className="text-xs outline-none p-1 rounded-md"
            value={limit}
          >
            <option value="20">20</option>

            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="500">500</option>
          </select>
          {t(`Entries`)}
        </div>
      </div>

      <div
        className={` bg-white pb-6 overflow-scroll w-[100wh] rounded-[12px] mt-6  `}
      >
        {/* active/inactive providers */}
        <div className="h-[100%] min-h-[80vh] rounded-[16px] px-4  pt-4 w-[100%]  ">
          {loadingProvider && (
            <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
          )}
          <div className="flex justify-between items-center">
            <div className="">
              <p className=" font-semibold text-sm  pt-2 text-left">
                {t(`All`)} {t(`Provider`)} {t(`Details`)}
              </p>
            </div>
          </div>

          {providerName !== "SBOORIGINAL" && (
            <MoreProvider
              apiProviderName={providerName}
              search={search}
              statusQuery={status}
              setStatusQuery={setStatus}
              setSelectedProviders={setSelectedProviders}

              limit={limit}
            />
          )}
          {providerName == "SBOORIGINAL" && (
            <table className="w-[100%] font-bold   mt-5  ">
              <tr
                style={{ borderBottom: `1px solid ${border}60` }}
                className={`text-center p-2    h-[30px]  text-[14px] font-bold `}
              >
                <th className="text-left w-[200px]">{t(`Provider Image`)}</th>
                <th className="text-left w-[200px]">{t(`ProviderID`)}</th>
                <th className="text-left w-[250px]">
                  {t(`Provider`)} {t(`Name`)}
                </th>
                <th className="text-left w-[300px]">{t(`GameID`)}</th>

                <th className="text-left w-[350px] ">
                  {t(`Game`)} {t(`Name`)}
                </th>

                <th className="text-left w-[350px] ">{t(`Device`)}</th>
                <th className="text-left w-[350px] ">{t(`Status`)}</th>

                {providerManage && (
                  <th className="text-center text-nowrap w-[300px]">
                    {t(`Manage`)} {t(`Status`)}
                  </th>
                )}
                {providerManage && (
                  <th className="text-center w-[350px]">
                    {t(`Manage`)} {t(`Priority`)}
                  </th>
                )}

                {check && (
                  <th className="text-right w-[300px]">
                    {t(`Manage`)} {t(`Games`)}
                  </th>
                )}
              </tr>
              <tbody className=" ">
                {casinoProvider.length > 0 &&
                  casinoProvider?.map((item, dex) => {
                    return (
                      <tr
                        style={{ borderBottom: `1px solid ${border}60` }}
                        key={item?._id}
                        className={`text-center   h-[60px] m-auto   text-xs `}
                      >
                        <div className="flex flex-col gap-2 mb-2 justify-start items-start">
                          <img
                            className="w-[50%] h-[80px] py-3 rounded-2xl"
                            src={item?.image_url}
                          />
                          {imageUploadLoading && loaderActive === dex ? (
                            <div className=" w-[30%]">
                              <LoadingSpinner
                                color="green"
                                size="sm"
                                thickness={"4px"}
                              />
                            </div>
                          ) : (
                            ""
                          )}

                          <input
                            type="file"
                            accept="image/*"
                            name="image"
                            id="image"
                            onChange={(e) =>
                              handleImageChange(e, dex, item?.gpId)
                            }
                          />
                        </div>

                        <td className="text-left">{item?.gpId}</td>
                        <td className="text-left">
                          <div className="flex flex-col ">
                            <p>{item?.gpName}</p>
                          </div>
                        </td>
                        <td className="text-left">{item?.gameId}</td>
                        <td className="text-left">{item?.gameName}</td>
                        <td className="text-left">
                          {item?.device[0]},{item?.device[1]}
                        </td>
                        <td className="text-left">
                          <Badge
                            style={{
                              backgroundColor: item?.status ? "green" : "red",
                              color: "white",
                              padding: "2px",
                              width: "80px",
                              textAlign: "center",
                              borderRadius: "4px",
                            }}
                          >
                            {item?.status
                              ? `${t(`Active`)}`
                              : `${t(`InActive`)}`}
                          </Badge>
                        </td>

                        {providerManage && (
                          <td className="flex justify-center items-center mt-3">
                            <Switch
                              onChange={() =>
                                handleCasinoStatusUpdate(item?._id)
                              }
                              size="md"
                              isChecked={item?.status}
                            />
                          </td>
                        )}
                        {providerManage && (
                          <td className="">
                            <div className="flex items-center gap-4  justify-center">
                              <p className="text-lg font-semibold">
                                {item?.priority}
                              </p>
                              <UpdatePriority
                                gpId={item?.gpId}
                                getAllCasinoProvider={getAllCasinoProvider}
                              />
                            </div>
                          </td>
                        )}

                        {check && (
                          <td>
                            <Link
                              to={`/casinomanage/${item?.gameName}/${item?.gpId}`}
                              className="flex justify-end items-end"
                            >
                              <FcViewDetails
                                fontSize={"25px"}
                                cursor={"pointer"}
                              />
                            </Link>
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {providerName == "SBOORIGINAL" && (
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
      )}
    </div>
  );
};

export default CasinoManage;
