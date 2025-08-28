import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import { Avatar, AvatarBadge, AvatarGroup, Badge, Spinner, Tooltip, useToast } from "@chakra-ui/react";
import { FaRegCreditCard } from "react-icons/fa6";
import { BsCalendarDateFill, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FaWallet } from "react-icons/fa6";
import { HiCurrencyDollar } from "react-icons/hi2";
import { MdDelete, MdOutlineAccountBalance } from "react-icons/md";
import { GiWallet } from "react-icons/gi";
import { VscGraphLine } from "react-icons/vsc";
import { Switch } from "@chakra-ui/react";
import { FaUsers } from "react-icons/fa";
import { IoSettings, IoWallet } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { GiCard3Diamonds } from "react-icons/gi";
import { MdPendingActions } from "react-icons/md";
import AddNewUser from "../Modals/AddNewUser";
import ChangePassword from "../Modals/ChangePassword";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchGetRequest, sendPatchRequest } from "../api/api";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import DeleteUserAdmin from "../Modals/DeleteUserAdmin";
import nodatafound from '../assets/emptydata.png'
import { useTranslation } from "react-i18next";
import { checkPermission, convertToUniversalTime, formatDate, formatDateTime } from "../../utils/utils";
import getOnlineStatus from "../../utils/getOnlineStatus";
import WalletModal from "../component/usermanageComponent/WalletModal";
import getColorFromUsername from "../../utils/getColorFromUsername";
import BonusHistoryModal from "../component/usermanageComponent/BonusHistoryModal";
import BalanceAction from "../component/usermanageComponent/BalanceAction";
import UserLogout from "../component/usermanageComponent/UserLogout";

const AllUser = () => {
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
  const naviagte = useNavigate();
  const [allUserData, setAllUserData] = useState();
  const { t, i18n } = useTranslation();
  const { selectedWebsite, siteDetails } = useSelector(
    (state) => state.websiteReducer
  );
  let filteredData = siteDetails.filter((item) => item.selected === true);

  const [loading, setLoading] = useState(false);
  const [usersCount, setUsersCount] = useState({
    totalUserCount: 0,
    blockUserCount: 0,
    betDeactiveUser: 0,
  });
  const [userCategory, setUserCategory] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();
  const [pagination, setPagination] = useState({});
  const totalPages = pagination.totalPages;
  const [statuses, setStatuses] = useState({});
const [limit,setLimit]=useState("20")
  const getAllUser = async () => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/admin/get-all-user?page=${currentPage}&limit=${limit}`;

    if (search) {
      url += `&search=${search}`;
    }
    if (userCategory) {
      url += `&category=${userCategory}`;
    }

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data;
      setAllUserData(receivedData);
      setUsersCount(response.userCount);
      setPagination(response.pagination);

      setLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message||error?.response?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    let id;
    id = setTimeout(() => {
      getAllUser();
    }, 100);

    return () => clearTimeout(id);
  }, [currentPage, search, userCategory,limit]);

  useEffect(() => {
    let result = {};
    let data = allUserData?.map((ele) => {
      result[ele._id] = ele.is_blocked ? "Block" : "Active";
    });
    setStatuses(result);
  }, [allUserData]);

  const handleStatus = async (value, itemId, userId) => {

    let url = `${import.meta.env.VITE_API_URL}/api/admin/toggle-user-status/${userId}`;

    try {
      let response = await sendPatchRequest(url, { name: value });
      const data = response.data;

      setLoading(false);
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [itemId]: data.is_blocked ? "Block" : "Active",
      }));
   getAllUser()

    } catch (error) {
      toast({
        description: `${error?.data?.message||error?.response?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
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
  const deleteUserHandler = () => {
    getAllUser()
  };
const [plData, setPlData]=useState({})
const [loading1, setLoading1]=useState(false)
const [individualPl, setShowIndivitualPl] = useState();
const [plShow, setPlShow] = useState(false);

  const profitLossData = async (userData) => {
    setPlData({});
    if (!userData) {
      return;
    }
    setLoading1(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/transaction/get-transaction-pl/${userData?.user_id}?username=${
      userData?.username
    }&type=user`;

    try {
      let response = await fetchGetRequest(url);
      setLoading1(false);
      if (response) {
        setPlData(response);
      }
    } catch (error) {
      setLoading1(false);
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }
  };

  const handlePlShow = (item) => {
    setPlShow(!plShow);
    profitLossData(item);
    setShowIndivitualPl(item?._id);
  };

  const user = useSelector((state) => state.authReducer);

const adminData = user.user || {};
const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;

const permissionDetails=user?.user?.permissions

let hasPermission=checkPermission(permissionDetails,"allUserManage")
let check=!isOwnerAdmin?hasPermission:true

  return (
    <div className="px-2 lg:px-0">
      <div className="flex flex-col items-end gap-3 md:flex-row justify-between px-2">
        <div className="flex items-center md:w-[60%] gap-2">
          <div
            style={{
              border: `1px solid ${border}60`,
              backgroundColor: primaryBg,
            }}
            className={` justify-between rounded-[8px] pl-1 flex items-center gap-2 w-[100%]`}
          >
            <input
              placeholder={`${t(`Search here`)}...`}
              className=" outline-none rounded-[8px] p-[6px]  text-black text-xs md:text-sm  w-[70%]"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              setCurrentPage(1)
              }}
            />
            <span
              style={{ backgroundColor: bg }}
              className={`p-[6px] border rounded-r-[8px] cursor-pointer `}
            >
              <IoSearchOutline fontSize={"22px"} color="white" />
            </span>
          </div>

          <select
            onChange={(e) =>{
               setUserCategory(e.target.value)
               setCurrentPage(1)
              
              }}
            style={{
              border: `1px solid ${border}60`,
              backgroundColor: primaryBg,
            }}
            className={`p-[8px]   w-[100%] rounded-[6px] text-xs md:text-sm font-semibold border outline-none`}
          >
            <option>
              {" "}
              <IoSearchOutline fontSize={"22px"} color="black" />
              {t(`Select Status`)}
            </option>
            <option value="is_active">{t(`Active`)}</option>
            <option value="is_blocked">{t(`Block`)}</option>
            {/* <option value="bet_active">Bet Suspend</option> */}
          </select>
        </div>
       {check&& <AddNewUser setAllUserData={setAllUserData} allUserData={allUserData}/>}
      </div>
<div className="flex justify-between flex-col gap-4 sm:flex-row  mt-6  pr-5 sm:items-center">

      <p
        style={{ color: iconColor }}
        className={`font-bold  w-[100%]    flex items-center gap-2 rounded-[6px]  text-lg`}
      >
        <FaUsers style={{ color: iconColor }} fontSize={"30px"} />
       {t(`All`)} {t(`User`)}{" "}
       {usersCount.totalUserCount>0&&<span className={`text-green-600`}>({usersCount.totalUserCount})</span>}
      </p>
      <div className="flex items-center gap-2 text-sm">{t(`Show`)} 
        <select onChange={(e)=>setLimit(e.target.value)} style={{border:`1px solid ${border}60`}} className="text-xs outline-none p-1 rounded-md" value={limit}>
        <option value="20">20</option>

          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="500">500</option>
          <option value="1000">1000</option>

        </select>{t(`Entries`)}</div>
</div>

<div className="flex space-x-4 mt-4">
  <p
    onClick={() => setUserCategory("is_active")}
    className={`px-6 py-3 text-sm cursor-pointer text-white font-semibold rounded-lg shadow-md bg-green-500 hover:bg-green-600 flex-1 text-center`}
  >
    {usersCount.activeUserCount} {t(`Active`)}
  </p>

  <p
    onClick={() => setUserCategory("is_blocked")}
    className={`px-6 py-3 text-sm cursor-pointer text-white font-semibold rounded-lg shadow-md bg-red-500 hover:bg-red-600 flex-1 text-center`}
  >
    {usersCount.blockUserCount} {t(`Block`)}
  </p>

  {/* Uncomment and modify this block if needed
  <p
    onClick={() => setUserCategory("bet_active")}
    className={`px-6 py-3 text-sm cursor-pointer text-white font-semibold rounded-lg shadow-md bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 flex-1 text-center`}
  >
    {usersCount.betDeactiveUser} Bet Suspend
  </p>
  */}
</div>


      <div className="mt-5 ml-5">
        {loading ? (
       <center style={{ height: '60vh' ,display:"flex", justifyContent:"center", alignItems:"center"}}>
       <LoadingSpinner thickness={3} size={"lg"} />
     </center>
        ) : (
          ""
        )}
      </div>

      {allUserData && !loading && allUserData.length > 0 && (
      <div className="mt-3 overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr style={{ backgroundColor: bg, color: "white" }} className="border-b border-gray-300 text-[12px]">
          <th className="text-left px-3 p-2 border-r border-gray-300">User</th>
          <th className="text-left px-3 p-2 border-r border-gray-300">Joining Date</th>
          <th className="text-left px-3 p-2 border-r border-gray-300">Created By</th>
          <th className="text-left px-3 p-2 border-r border-gray-300">Company Site</th>
          <th className="text-left px-3 p-2 border-r border-gray-300">Balance</th>
          <th className="text-center px-3 p-2 border-r border-gray-300">Bonus</th>
          <th className="text-center px-3 p-2 border-r border-gray-300">Profit & Loss</th>
          <th className="text-center px-3 p-2 border-r border-gray-300">Online</th>
          <th className="text-center px-3 p-2 border-r border-gray-300">Status</th>
          <th className="text-left p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {allUserData.map((item) => (
          <tr key={item._id} className="border-b border-gray-300">
            <td className="p-2 border-r border-gray-300">
              <div className="flex items-center gap-1">
                <Avatar name={item.username[0]} size={"sm"} style={{ backgroundColor: getColorFromUsername(item.username), color:"black" }} />
                <div className="flex flex-col">
                  <p className="text-xs font-bold">{item.username}</p>
                  <span
                    style={{ backgroundColor: bg }}
                    className="text-[8px] w-10 text-center font-medium px-1 py-[2px] rounded-[4px] text-white"
                  >
                    {item.role_type=="user"?"Player":item.role_type}
                  </span>
                </div>
              </div>
            </td>
            <td className="p-2 border-r font-bold border-gray-300">
              <p className="text-sm ">
                {formatDateTime(item.joined_at).split(" ")[0]}
                <span className="text-[12px] ml-1">
                  ({formatDateTime(item.joined_at).split(" ")[1]})
                </span>
              </p>
            </td>
            <td className="p-2 border-r border-gray-300">
              <p
                style={{ backgroundColor: bg }}
                className="text-[10px] w-auto text-center font-medium px-1 py-[6px] rounded-[4px] text-white"
              >
                {item.parent_admin_username}
              </p>
            </td>
            <td className="p-2 border-r border-gray-300">
              <Badge color={iconColor} className="text-xs rounded-sm font-semibold">
                {filteredData[0]?.site_name}
              </Badge>
            </td>
            <td className="p-2 border-r border-gray-300">
              <p className="text-sm font-bold">
                {item.amount.toFixed(2)} {item.currency}
              </p>
            </td>

            <td className="p-2 flex justify-center  border-r border-gray-300">
              <p className="text-xs font-semibold text-center text-green-600">
                {item.bonus.toFixed(2)} {item.currency}
              </p>
            </td>
            <td className="p-2 border-r border-gray-300">
              <p className={`text-xs font-bold flex flex-col items-center text-center ${plData?.totalAmount > 0 ? "text-green-400" : "text-red-400"}`}>
                <span className="w-[70px]">
                  {individualPl == item._id && plShow && plData?.totalAmount?.toFixed(2)}
                </span>
                {loading1 && individualPl == item._id ? (
                  <Spinner />
                ) : (
                  <span onClick={() => handlePlShow(item)}>
                    {plShow && individualPl == item._id ? (
                      <BsEyeFill style={{ fontSize: "20px", cursor: "pointer", color: iconColor }} />
                    ) : (
                      <BsEyeSlashFill style={{ fontSize: "20px", cursor: "pointer", color: iconColor }} />
                    )}
                  </span>
                )}
              </p>
            </td>


            <td className="p-2 border-r border-gray-300 text-center">
            <div className="min-w-[50px] flex justify-center">
                 <p className={`h-[15px] w-[15px] rounded-[50%] animate-pulse ${getOnlineStatus(item?.updated_at)?"bg-green-700":"bg-red-700"} `}></p>
            </div>
            </td>
            <td className="p-2 border-r border-gray-300 flex justify-center">
              {check && (
                <div>
                  <Menu>
                    <MenuButton
                      className={`px-2 ${statuses[item._id] === "Block" ? "bg-red-600" : "bg-green-500"}`}
                      style={{ fontSize: "13px", borderRadius: "4px", color: "white" }}
                    >
                      {statuses[item._id] || "Active"}
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => handleStatus("is_blocked", item._id, item.user_id)}>
                        {t('Active')}
                      </MenuItem>
                      <MenuItem onClick={() => handleStatus("is_blocked", item._id, item.user_id)}>
                        {t('Block')}
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </div>
              )}
            </td>
            <td className="p-2 border-r border-gray-300">
              <div className="flex items-center gap-[6px] justify-start">
                <Link
                  to={`/usermanage/${item.user_id}`}
                  style={{ border: `1px solid ${border}60` }}
                  className="w-[25px] flex items-center justify-center rounded-[6px] h-[25px]"
                >
                  <Tooltip label={"Profile"} bg={bg} aria-label={`Profile`} hasArrow>
                    <div>
                  <FaRegUser style={{ color: iconColor }} fontSize={"15px"} />
                  </div>
                  </Tooltip>
                </Link>
                <WalletModal id={item.username} />
                <BonusHistoryModal user={item}/>
                <ChangePassword id={item.user_id} type="user" />
                <DeleteUserAdmin
                  type="user"
                  name={item.username}
                  id={item.user_id}
                  onDeleteSuccess={deleteUserHandler}
                />
                <BalanceAction userData={item} getData={getAllUser} title={item.role_type} type="direct"/>
                <UserLogout userData={item}/>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      </table>
      </div>
      )}
      <div>
        {allUserData?.length===0?<div className="flex justify-center items-center"><img src={nodatafound} className="w-[300px] rounded-[50%]" alt="No user found" /></div>:""}
      </div>
      <div className="flex justify-between items-center">
        {allUserData?.length>0&& <p style={{color:iconColor}} className="text-xs font-semibold ">{t(`Showing`)} 1 {t(`to`)} {limit} {t(`of`)} {usersCount.totalUserCount} {t(`Entries`)}</p>}
        {allUserData && allUserData.length > 0 && (
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
          {t(`Page`)} <span>{currentPage}</span> {t(`of`)}{" "}
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

export default AllUser;
