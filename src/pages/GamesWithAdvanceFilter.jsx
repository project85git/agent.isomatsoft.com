import React, { useEffect, useState } from "react";
import { fetchGetRequest, sendPatchRequest, sendPostRequest } from "../api/api";
import { useParams } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import {
  Switch,
  Progress,
  useToast,
  MenuButton,
  MenuItem,
  Menu,
  MenuList,
  Checkbox,
  Select,
  CheckboxGroup,
  Stack,
  Button,
  Box,
  Flex,
} from "@chakra-ui/react";
import nodatafound from "../assets/emptydata.png";
import { checkPermission } from "../../utils/utils";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { RxCrossCircled } from "react-icons/rx";
import { IoMdArrowDropdown } from "react-icons/io";
import UpdateMultipleGameCategory from "../Modals/UpdateMultipleGameCategory";
import { FaArrowDown, FaChevronDown, FaChevronUp, FaRedo } from "react-icons/fa";
import { FaUpDown } from "react-icons/fa6";
const GamesWithAdvanceFilter = () => {
  const [game, setAllGame] = useState([]);
  const [gameLoading, setGameLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const { t, i18n } = useTranslation();
  const [pagination, setPagination] = useState({});
  const totalPages = pagination?.totalPages;
  const [search, setSearch] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loaderActive, setLoaderActive] = useState();
  const [category, setGameCategory] = useState([]);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [addMultipleCategoryOpen, setAddMultipleCategoryOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [selectedItemIDs, setSelectedItemIDs] = useState([]);   
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [gamesCount, setGamesCount] = useState({
         activeGames: 0,
         inactiveGames: 0,
         totalGames: 0
  });
  const toast = useToast();
  const params = useParams();
  const { primaryBg, iconColor, bg, border, secondaryBg } = useSelector(
    (state) => state.theme
  );
  const getAllGamesByProviderID = async () => {
    setGameLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/secondary-game/get-game?page=${currentPage}&limit=${limit}&api_provider_name=${
      params.provider
    }`;

    if (search) {
      url += `&search=${search}`;
    }
    if (status == false || status == true) {
      url += `&status=${status}`;
    }
if (selectedCategories && selectedCategories.length > 0) {
  // Serialize the array as a JSON string
  const categoriesString = JSON.stringify(selectedCategories);
  url += `&category=${encodeURIComponent(categoriesString)}`;
}
if (selectedProvider) {
  url += `&provider_id=${selectedProvider}`;
}

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data;
      setGamesCount(response.gamesCount)
      setAllGame(receivedData);
      setPagination(response.pagination);
      //   setProviderCount(response.providerCounts);
      setGameLoading(false);
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
      setGameLoading(false);
    }
  };

  const getGameCategory = async () => {
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/game-navigation/get-all-game-navigation`;
    try {
      let response = await fetchGetRequest(url);
      setGameCategory(response.data);
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
      setCategoryLoading(false);
    }
  };

  const [providerData, setProviderData]=useState([])

  const getAllCasinoProvider = async () => {
    let url = ""
      url = `${
        import.meta.env.VITE_API_URL
      }/api/secondary-provider/get-provider-name?api_provider_name=${params.provider}`;
    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      setProviderData(data);
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

  useEffect(() => {
    getAllCasinoProvider();
  }, [params.provider]);
  const handleImageChange = async (event, index, gameId, providerID) => {
    setLoaderActive(index);
    const file = event.target.files[0];
    handleImageUpload(file, gameId, providerID);
  };

  const handleImageUpload = async (file, gameId, providerID) => {
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
        updateImg(response.url, gameId, providerID);
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
  const updateImg = async (imageUrl, gameId, providerID) => {
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/secondary-game/update-game-image/${gameId}/${providerID}`;
    try {
      const payload = {
        image_url: imageUrl,
      };
      let response = await sendPatchRequest(url, payload);
      const data = response.data;
      getAllGamesByProviderID();
      toast({
        description: `succesfully updated `,
        status: `success`,
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setGameLoading(false);
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
      setGameLoading(false);
    }
  };

  useEffect(() => {
    let id;
    id = setTimeout(() => {
      getAllGamesByProviderID();
    }, 200);
    return () => clearTimeout(id);
  }, [search, status, limit, currentPage, selectedCategories, selectedProvider]);

  useEffect(() => {
    getGameCategory();
  }, []);

  const handleCasinoStatusUpdate = async (gameId) => {
    setGameLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/secondary-game/toggle-game-status/${gameId}`;
    try {
      const payload = {
        status: !status,
      };
      let response = await sendPatchRequest(url, payload);
      const data = response.data;
      const updatedStatus = response.data.status;

      getAllGamesByProviderID();
      toast({
        description: `${
          data.status ? "Provider activated" : "Provider diactivated"
        }`,
        status: `${data.status ? "success" : "warning"}`,
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setGameLoading(false);
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
      setGameLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    setCurrentPage(1);
    const selectedValue = e.target.value;
    if (selectedValue === "") {
      setStatus("");
      return;
    }
    setStatus(
      selectedValue === "active"
        ? true
        : selectedValue === "inactive"
        ? false
        : null
    );
  };

  // Set initial state for priorities when game changes
  useEffect(() => {
    const initialPriorities = game.map((item) => item?.priority || "");
    setPriorities(initialPriorities);
    const initialSelectedIDs = initialPriorities.reduce(
      (selectedIDs, priority, index) => {
        if (priority) {
          return [...selectedIDs, game[index]._id];
        }
        return selectedIDs;
      },
      []
    );
    setSelectedItemIDs(initialSelectedIDs);
  }, [game]);

  const handlePriorityChange = (index, id, event) => {
    const { value } = event.target;
    setPriorities((prevPriorities) => {
      const updatedPriorities = [...prevPriorities];
      updatedPriorities[index] = value;
      return updatedPriorities;
    });
  };

  const handleUpdatePriority = async () => {
    setUpdateLoading(true);
    const payload = {
      ids: selectedItemIDs,
      values: priorities,
    };

    try {
      let url = `${
        import.meta.env.VITE_API_URL
      }/api/secondary-game/update-game-priority`;
      let response = await sendPatchRequest(url, payload);
      toast({
        description: response.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setUpdateLoading(false);
      getAllGamesByProviderID();
    } catch (error) {
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setUpdateLoading(false);
    }
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
  const handleAddCategory = async (data, id) => {
    const payload = {
      category: data.toLowerCase(),
    };
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/secondary-game/add-game-category/${id}`;
    try {
      let response = await sendPostRequest(url, payload);
      toast({
        description: response.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      getAllGamesByProviderID();
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

  const handleDeleteCategory = async (item, data) => {
    const payload = {
      category: data,
    };

    try {
      let response = await sendPatchRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/secondary-game/delete-game-category/${item._id}`,
        payload
      );
      toast({
        description: response.message,
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      getAllGamesByProviderID();
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

  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;

  const permissionDetails = user?.user?.permissions;

  let hasPermission = checkPermission(permissionDetails, "gameManage");
  let check = !isOwnerAdmin ? hasPermission : true;

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedIds(game.map((item) => item._id));
    } else {
      setSelectedIds([]);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryChange = (e) => {
    const value = e.target.value.toLowerCase();
    console.log(value)
    setSelectedCategories((prevSelectedCategories) => {
      if (prevSelectedCategories.includes(value)) {
        return prevSelectedCategories.filter((category) => category !== value);
      } else {
        return [...prevSelectedCategories, value];
      }
    });
  };
  const handleUncheckAll = () => {
    if(selectedCategories.length)
    setSelectedCategories([]); // Reset state to empty, unchecking all checkboxes
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <div className="flex flex-col  gap-3 pb-3 md:flex-row justify-between items-center pr-5">
        <div className="flex  justify-start md:w-[60%] gap-2">
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
              placeholder="Search here..."
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
            <option value="">All Game</option>
            <option value="active">
              {t(`Active`)} {t(`Game`)}
            </option>

            <option value="inactive">
              {t(`InActive`)} {t(`Game`)}
            </option>
          </select>


          <select
            style={{
              border: `1px solid ${border}60`,
              backgroundColor: primaryBg,
            }}
            className={`p-[8px]   md:w-[200px] rounded-[6px] text-xs md:text-sm font-semibold border outline-none`}
            onChange={(e)=>setSelectedProvider(e.target.value)}
          >
            <option value="">All Provider</option>
            {providerData.map((ele)=>            
            <option value={ele}>
              {ele}
            </option>
            )}
          </select>
          <Box width="180px">
      {/* Button to toggle the dropdown */}
      <Button onClick={toggleDropdown} width="100%" style={{backgroundColor:bg, color:"white"}}>
        Select Categories  {isOpen ? (
        <FaChevronUp style={{ marginLeft: '8px' }} size="24px" />
      ) : (
        <FaChevronDown style={{ marginLeft: '8px' }} size="24px" />
      )}
      </Button>

      {/* Dropdown menu with checkboxes */}
      {isOpen && (
        <Box
          position="absolute"
          border="1px solid #ccc"
          borderRadius="8px"
          backgroundColor="white"
          width="180px"
          mt={2}
          p={2}
          zIndex={1000}
        >
          <CheckboxGroup
            colorScheme="blue"
            value={selectedCategories}
            
          >
            <Stack spacing={2} direction="column">
            <Flex gap={1}
            alignItems={"center"}
          >
         <FaRedo onClick={handleUncheckAll} className="cursor-pointer" style={{ marginRight: '6px', fontSize: '14px' }} /> 
         Reset All
        </Flex>

              {category.map((ele) => (
                <Checkbox onChange={handleCategoryChange} key={ele.id} value={ele.name.toLowerCase()}>
                  {ele.name}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
          <Button
            mt={2}
            onClick={toggleDropdown}
            style={{backgroundColor:bg, color:"white"}}
            width="100%"
          >
            Close
          </Button>
        </Box>
      )}
    </Box>

        </div>


        <div className="flex gap-2">
        {check&&<div>
          <button
            disabled={selectedIds.length===0}
            onClick={() => setAddMultipleCategoryOpen(true)}
            style={{ backgroundColor: bg }}
            className="p-2 px-4  text-nowrap text-sm font-bold text-white rounded-md "
          >
             { `${t(`M`)} ${t(`Category`)}`
        }
          </button>
        </div>}

        {check && (
          <div>
            <button
              onClick={handleUpdatePriority}
              style={{ backgroundColor: bg }}
              className="p-2 px-4 text-sm font-bold text-white rounded-md "
            >
              {updateLoading ? (
                <LoadingSpinner size="sm" thickness={"3px"} color={"white"} />
              ) : (
                `${t(`Update`)} ${t(`Priority`)}`
              )}
            </button>
          </div>
        )}
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
            <option value="1000">1000</option>
          </select>
          {t(`Entries`)}
        </div>
      </div>

      <div className="flex space-x-4  mt-4">
        <p
         onClick={()=>setStatus(true)}
          className={`px-6 py-3 text-sm cursor-pointer text-white font-semibold rounded-lg shadow-md bg-green-500 hover:bg-green-600 flex-1 text-center`}
        >
        {gamesCount?.activeGames}  {t(`Active`)}
        </p>

        <p
          onClick={() => setStatus(false)}
          className={`px-6 py-3 text-sm cursor-pointer text-white font-semibold rounded-lg shadow-md bg-red-500 hover:bg-red-600 flex-1 text-center`}
        >
         {gamesCount?.inactiveGames} {t(`Inactive`)}
        </p>

        </div>

      <div className="max-w-full mt-5  overflow-x-auto">
        {gameLoading && (
          <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
        )}
        <table className="min-w-full bg-white shadow-md rounded mb-4">
          <thead>
            <tr style={{ backgroundColor: bg, color: "white" }} className="border-b text-xs text-center">
             {check&& <th>
                <Checkbox
                  isChecked={ selectedIds.length === game.length}
                  onChange={handleSelectAll}
                  size="md"
                 className="py-3 pl-3 text-left text-xs w-[80px]"
                  sx={{
                    ".chakra-checkbox__control": {
                      bg: "gray.200",  // A slightly darker gray for better visibility
                      borderColor: "gray.500", // Darker border for contrast
                      _checked: {
                        bg: bg,  // A universally appealing color that contrasts well with both light and dark backgrounds
                        borderColor: bg,
                      },
                      _hover: {
                        bg: "",  // Darker shade of the checked color for hover state
                        borderColor: bg,
                      },
                    },
                  }}
                >
                  <span className="text-xs">
                  All
                  </span>
                </Checkbox>
              </th>}
              <th className="p-3 text-left w-[200px]">
                {t("Game")} {t("Image")}
              </th>
              <th className="p-3 text-left w-[150px]">
                {t("Game")} {t("Name")}
              </th>
              <th className="p-3 text-left w-[150px]">
                {t("Game")} {t("Id")}
              </th>
              <th className="p-3">{t("Provider")}</th>
              <th className="p-3 min-w-[120px]">{t("Status")}</th>
              {check && <th className="p-3 min-w-[120px]">{t("Priority")}</th>}
              {check && <th className="p-3 min-w-[300px]">{t("Groups")}</th>}
              {check && (
                <th className="p-3 pr-5 min-w-[60px] text-center">
                  {t("Action")} 
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {game.length > 0 &&
              game.map((item, index) => (
                <tr
                  key={index}
                  className="border-b text-sm text-center hover:bg-gray-100"
                >
             {check&& <td  className="pl-[14px] text-left w-[80px]">

                
                <Checkbox
                  isChecked={selectedIds.includes(item._id)}
                  onChange={() => handleCheckboxChange(item._id)}
                  size="md"
                  sx={{
                    ".chakra-checkbox__control": {
                      bg: "gray.200",  // A slightly darker gray for better visibility
                      borderColor: "gray.500", // Darker border for contrast
                      _checked: {
                        bg: bg,  // A universally appealing color that contrasts well with both light and dark backgrounds
                        borderColor: bg,
                      },
                      _hover: {
                        bg: "",  // Darker shade of the checked color for hover state
                        borderColor: bg,
                      },
                    },
                  }}
                />
              </td>}
                  <td className="p-3">
                    <div className="flex justify-start w-[200px] items-center">
                    <div className="flex  gap-2  justify-start items-center">
                        <img
                          className="w-[80px] h-[90px] object-contain rounded-md"
                          src={item.image_url}
                          alt="game"
                        />
                        {imageUploadLoading && loaderActive === index && (
                          <div className="w-[30%]">
                            <LoadingSpinner
                              color="green"
                              size="sm"
                              thickness="4px"
                            />
                          </div>
                        )}
                  <div className={`flex items-center justify-center p-1 border-2 
                  border-dashed border-gray-300 rounded bg-gray-100 
                  cursor-pointer hover:border-blue-500`} 
                  onClick={() => document.getElementById(`image${index}`).click()}
                >
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    id={`image${index}`}
                    className="hidden"
                    onChange={(e) => handleImageChange(e, index, item._id, item.provider_id)}
                  />
                  <span className="text-sm text-gray-600">Upload</span>
                </div>

                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-start w-[150px] items-center">
                      <p className="font-bold">{item.game_name}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-start w-[100px] items-center">
                      <p className="font-bold">{item.game_id}</p>
                    </div>
                  </td>
                  <td className="p-3">{item?.provider_id||item?.provider}</td>
                  <td className="">
                  <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                item?.status ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {item?.status ? t('Active') : t('Inactive')}
            </span>
                  </td>
                  {check && (
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <input
                          value={priorities[index] || ""}
                          className="text-center outline-none p-1 rounded-md"
                          onChange={(e) =>
                            handlePriorityChange(index, item._id, e)
                          }
                        />
                      </div>
                    </td>
                  )}
                  {check && (
                <td className="py-2">
                <div className="flex justify-center items-center gap-2">
                  {/* Game Categories */}
                  <div className={`max-w-[230px] grid ${item?.game_category?.length>1?"grid-cols-2":"grid-cols-1"} items-center gap-1`}>
                    {item.game_category.map((skill, idx) => (
                      <div
                        style={{backgroundColor:secondaryBg}}
                        className="flex shadow-md rounded-sm p-1 w-[110px] items-center justify-between border border-gray-300"
                        key={idx}
                      >
                        <p className="text-[10px] font-semibold text-gray-700">{skill.slice(0,14)} {skill.length>14&&"..."}</p>
                        <RxCrossCircled
                          onClick={() => handleDeleteCategory(item, skill)}
                          className="ml-2 text-red-500 cursor-pointer hover:text-red-700"
                          style={{ fontSize: "16px" }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Dropdown Menu */}
                  <Menu>
                    <MenuButton
                      as="button"
                      style={{backgroundColor:bg}}
                      className="px-2 py-1 text-white text-sm rounded-md shadow-md  flex items-center"
                    >
                        <IoMdArrowDropdown size={"20px"} />
                    </MenuButton>
                    <MenuList className="bg-white shadow-md border border-gray-200 rounded-lg">
                      {category.map((value, idx) => (
                        <MenuItem
                          onClick={() => handleAddCategory(value.name, item._id)}
                          key={idx}
                          className="text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {value.name}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </div>
                </td>
                  )}
                  {check && (
                    <td>
                      <div className="flex pr-3 justify-center">
                        <Switch
                          colorScheme="green"
                          onChange={() => handleCasinoStatusUpdate(item._id)}
                          size="md"
                          isChecked={item.status}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>

        {game.length === 0 && (
          <div className="flex justify-center items-center">
            <img src={nodatafound} className="w-[300px]" />
          </div>
        )}
      </div>

      <div className="flex justify-between  items-center">
        {game?.length > 0 && (
          <p style={{ color: iconColor }} className="text-xs font-semibold ">
            {t(`Showing`)} 1 {t(`to`)} {limit} {t(`of`)}{" "}
            {pagination?.totalGames} {t(`Entries`)}
          </p>
        )}
        {game && game.length > 0 && (
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
            {t(`Page`)} <span>{currentPage}</span> of{" "}
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
      {addMultipleCategoryOpen && (
        <UpdateMultipleGameCategory
          selectedIds={selectedIds}
          isOpen={addMultipleCategoryOpen}
          onClose={() => setAddMultipleCategoryOpen(false)}
          selectedCategories={[]}
          allCategories={category}
          getAllGamesByProviderID={getAllGamesByProviderID}
        />
      )}
    </div>
  );
};

export default GamesWithAdvanceFilter;
