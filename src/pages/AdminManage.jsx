import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import { Avatar, AvatarBadge, AvatarGroup, Badge, Tooltip, useToast } from "@chakra-ui/react";
import { FaRegCreditCard } from "react-icons/fa6";
import { BsCalendarDateFill } from "react-icons/bs";
import { FaWallet } from "react-icons/fa6";
import { MdOutlineAccountBalance } from "react-icons/md";
import { GiWallet } from "react-icons/gi";
import { VscGraphLine } from "react-icons/vsc";
import { Switch } from "@chakra-ui/react";
import { FaUserCheck, FaUsers } from "react-icons/fa";
import { IoSettings, IoWallet } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { GiCard3Diamonds } from "react-icons/gi";
import { MdPendingActions } from "react-icons/md";
import AddNewUserAdmin from "../Modals/AddNewUserAdmin";
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
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetRequest, sendPatchRequest } from "../api/api";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import DeleteUserAdmin from "../Modals/DeleteUserAdmin";
import PermissionSetting from "../Modals/PermissionSetting";
import nodatafound from '../assets/emptydata.png'
import { useTranslation } from "react-i18next";
import { checkPermission, convertToUniversalTime, formatDate, formatDateTime } from "../../utils/utils";
import CurrencyModal from "../Modals/CurrencyModal";
import getColorFromUsername from "../../utils/getColorFromUsername";
import { BiGhost } from "react-icons/bi";
import AddBalance from "../component/usermanageComponent/AddBalance";
import SubtractBalance from "../component/usermanageComponent/SubtractBalance";
import BalanceAction from "../component/usermanageComponent/BalanceAction";

const AdminManage = () => {
  const { color,primaryBg,iconColor,secondaryBg, bg,hoverColor,hover,text, font, border } = useSelector(state => state.theme);
const { t, i18n } = useTranslation();

  const [allAdminData, setAllAdminData] = useState();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.authReducer);
  const adminLayer = user.adminLayerUpdated;
  const getLevelName = (name)=>{
    const filterLevel = adminLayer.filter((ele)=>ele.name==name)
    return filterLevel[0]?.label||name
    }
  const [adminCount, setAdminCount] = useState({
    adminCount:0,
    agentCount:0, 
ownerAdminCount:0,
seniorsuperCount:0,
subadminCount:0,
superagentCount:0,
totalAdminCount:0
  });
  const [adminDetails,setAdminDetails]=useState({
    activeAdminCount:0,
    betActiveAdminCount:0,
blockAdminCount:0
  })
  const [adminCategory, setAdminCategory] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();
  const [pagination, setPagination] = useState({});
  const totalPages = pagination.totalPages;
  const [statuses, setStatuses] = useState({});
  const [status, setStatus] = useState("");
  const [limit,setLimit]=useState("20")
const [permissionsData,setPermission]=useState([])
const dispatch=useDispatch()
const { selectedWebsite, siteDetails } = useSelector(
  (state) => state.websiteReducer
);


const adminData = user.user || {};
const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;

const permissionDetails=user?.user?.permissions


let hasPermission=checkPermission(permissionDetails,"permissionView")
let check=!isOwnerAdmin?hasPermission:true


let hasPermission1=checkPermission(permissionDetails,"adminManage")
let check1=!isOwnerAdmin?hasPermission1:true


let hasPermission2=checkPermission(permissionDetails,"multipleCurrencyView")
let check2=!isOwnerAdmin?hasPermission2:true
let filteredData = siteDetails.filter((item) => item.selected === true);

  const getAllAdmin = async () => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/admin/get-all-admin-by-parent?page=${currentPage}&limit=${limit}&status=${status}`;

    if (search) {
      url += `&search=${search}`;
    }
    if (adminCategory) {
      url += `&category=${adminCategory}`;
    }
    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data;
      setAllAdminData(receivedData);
      setAdminCount(response.adminCount);
      
      setAdminDetails(response.adminDetailsCount)
      setPagination(response.pagination);

      setLoading(false);
    } catch (error) {
      // toast({
      //   description: `${error?.data?.message||error?.response?.data?.message}`,
      //   status: "error",
      //   duration: 4000,
      //   position: "top",
      //   isClosable: true,
      // });
      setLoading(false);
    }
  };

  useEffect(() => {
    let id;
    id = setTimeout(() => {
      getAllAdmin();
    }, 100);

    return () => clearTimeout(id);
  }, [currentPage, search, adminCategory,status,limit]);

  useEffect(() => {
    let result = {};
    let data = allAdminData?.map((ele) => {
      result[ele._id] = ele.is_blocked ? "Block" : "Active";
    });
    setStatuses(result);
  }, [allAdminData]);

  const handleStatus = async (value, itemId, adminId) => {

    let url = `${
      import.meta.env.VITE_API_URL
    }/api/admin/toggle-admin-status/${adminId}`;

    try {
      let response = await sendPatchRequest(url, { name: value });
      const data = response.data;

      setLoading(false);
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [itemId]: data.is_active ? "Block" : "Active",
      }));
getAllAdmin()

    } catch (error) {
      // toast({
      //   description: `${error?.data?.message||error?.response?.data?.message}`,
      //   status: "error",
      //   duration: 4000,
      //   position: "top",
      //   isClosable: true,
      // });
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
    getAllAdmin()
  };

  return (
    <div className="px-2 lg:px-0">
      <div className="flex flex-col items-end gap-3 md:flex-row justify-between px-2">
        <div className="flex items-center md:w-[60%] gap-2">
          <div style={{border:`1px solid ${border}60`,backgroundColor:primaryBg}} className={` justify-between rounded-[8px] pl-1 flex items-center gap-2 w-[100%]`}>
            <input
              placeholder={`${t(`Search here`)}...`}
              className=" outline-none rounded-[8px] p-[6px]  text-black text-xs md:text-sm  w-[70%]"
           onChange={(e)=>{
            setSearch(e.target.value)
          setCurrentPage(1)
          }}
           />
            <span style={{backgroundColor:bg}} className={`p-[6px] border rounded-r-[8px] cursor-pointer`}>
              <IoSearchOutline fontSize={"22px"} color="white" />
            </span>
          </div>
          <select
         onChange={(e) =>{
           setAdminCategory(e.target.value)
           setCurrentPage(1)
          
          }}
          
          style={{border:`1px solid ${border}60`,backgroundColor:primaryBg}}
          className={` p-[8px]  w-[100%] rounded-[6px] text-xs md:text-sm font-semibold border outline-none`}>
                                   <option value="">{t(`Select Layer`)} </option>
                                   {adminLayer?.map((ele) => (
  <option value={ele.name}>{t(ele?.label||ele?.name)}</option>
))}
          </select>
          <select 
            onChange={(e) =>{
               setStatus(e.target.value)
          setCurrentPage(1)
              
              }}
            value={status}
          style={{border:`1px solid ${border}60`,backgroundColor:primaryBg}} className={` p-[8px]   w-[100%] rounded-[6px] text-xs md:text-sm font-semibold border outline-none `}>
            <option>
              {" "}
              <IoSearchOutline fontSize={"22px"} color="black" />
              {t(`Select Status`)}
            </option>
            <option value="is_active">{t(`Active`)}</option>
            <option value="is_blocked">{t(`Block`)}</option>
           
          </select>
        </div>
        {check1&&<AddNewUserAdmin setAllAdminData={setAllAdminData} />}
      </div>

      
      <div className="flex justify-between flex-col gap-4 sm:flex-row  mt-6  pr-5 sm:items-center">

      <p style={{color:iconColor}} className={`font-bold mt-6  w-[100%]    flex items-center gap-2 rounded-[6px]  text-lg`}>
        <FaUserCheck fontSize={"30px"} style={{color:iconColor}}  />
        {t(`Admin Manage`)} <span className={`text-green-600 text-center`}>( {adminCount?.totalAdminCount} )</span>
         
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
    onClick={() => setStatus("is_active")}
    className={`px-6 py-3 text-sm cursor-pointer text-white font-semibold rounded-lg shadow-md bg-green-500 hover:bg-green-600 flex-1 text-center`}
  >
    {adminDetails?.activeAdminCount} {t(`Active`)}
  </p>

  <p
    onClick={() => setStatus("is_blocked")}
    className={`px-6 py-3 text-sm cursor-pointer text-white font-semibold rounded-lg shadow-md bg-red-500 hover:bg-red-600 flex-1 text-center`}
  >
    {adminDetails?.blockAdminCount} {t(`Block`)}
  </p>

  {/* Uncomment this block if needed
  <p
    onClick={() => setAdminCategory("bet_active")}
    className={`px-6 py-3 text-sm cursor-pointer text-white font-semibold rounded-lg shadow-md bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 flex-1 text-center`}
  >
    {usersCount.betDeactiveUser} Bet Suspend
  </p>
  */}
</div>


        <div className="">
        {loading ? (
        <center style={{ height: '60vh' ,display:"flex", justifyContent:"center", alignItems:"center"}}>
        <LoadingSpinner thickness={3} size={"lg"} />
      </center>
        ) : (
          <div className="mt-3 overflow-x-auto">
          <table className="min-w-full mt-3 bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b text-white" style={{ backgroundColor: bg, color: "white" }} >
                <th className="p-2 text-left text-xs font-semibold ">Username</th>
                <th className="p-2 text-left text-xs font-semibold ">Joining Date</th>
                <th className="p-2 text-left text-xs font-semibold ">Balance</th>
                <th className="p-2 text-left text-xs font-semibold ">Created By</th>
                <th className="p-2 text-left text-xs font-semibold ">Share %</th>
                <th className="p-2 text-left text-xs font-semibold ">Company Site</th>
                <th className="p-2 text-left text-xs font-semibold ">P/L</th>
                <th className="p-2 text-left text-xs font-semibold ">Online</th>
                <th className="p-2 text-left text-xs font-semibold ">Status</th>
                <th className="p-2 text-left text-xs font-semibold ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allAdminData &&
                !loading &&
                allAdminData.length > 0 &&
                allAdminData.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          <Avatar name={item.username[0]} size={"sm"} style={{ backgroundColor: getColorFromUsername(item.username), color:"black" }} />
                          <div className="flex flex-col">
                            <p className="text-xs font-bold">{item.username}</p>
                            <span
                              style={{ backgroundColor: bg }}
                              className="text-[10px] text-center font-medium px-1 py-[2px] rounded-[4px] text-white"
                            >
                              {getLevelName(item.role_type)}
                            </span>
                          </div>
                        </div>
                      </td>
                    <td className="p-2">
                      <p className="text-[12px] font-medium">
                        {formatDateTime(item?.joined_at).split(" ")[0]}
                        <span className="text-[10px] ml-1 font-bold">({formatDateTime(item?.joined_at).split(" ")[1]})</span>
                      </p>
                    </td>
                    <td className="p-2 text-[12px] font-semibold">
                      {item?.amount?.toFixed(2)} {item?.currency}
                    </td>
                    <td className="p-2">
                      <span className="text-[12px] font-medium px-1 py-[2px] rounded-[4px] text-white" style={{ backgroundColor: bg }}>
                        {item.parent_admin_username}
                      </span>
                    </td>
                    <td className="p-2 text-xs font-semibold">{item.share_percentage}%</td>
                    <td className="p-2">
                      <Badge color={iconColor} className="text-xs font-semibold">
                        {filteredData[0]?.site_name||"N/A"}
                      </Badge>
                    </td>
                    <td className="p-2 text-xs font-bold text-green-500">0.00 {item?.currency}</td>
                    <td className="p-2">
                      <div className={`h-[15px] w-[15px] animate-pulse rounded-[50%] ${item.status ? "bg-green-700" : "bg-red-700"}`}></div>
                    </td>

                    <td>
                    <Menu>
                            <MenuButton
                              className={`${item?.is_active ? "bg-green-600" : "bg-red-500"} px-2`}
                              style={{ fontSize: "13px", borderRadius: "4px", color: "white" }}
                            >
                              {item?.is_active ? "Active" : "Block"}
                            </MenuButton>
                            <MenuList>
                              <MenuItem onClick={() => handleStatus("is_active", item._id, item.admin_id)}>{t("Active")}</MenuItem>
                              <MenuItem onClick={() => handleStatus("is_active", item._id, item.admin_id)}>{t("Block")}</MenuItem>
                            </MenuList>
                          </Menu>
                    </td>
                    <td className="p-2">
                      {check1 && (
                        <div className="flex gap-1">

                          <Link
                            to={`/adminmanage/${item.admin_id}`}
                            style={{ border: `1px solid ${border}60`, backgroundColor: primaryBg }}
                            className="w-[25px] flex items-center justify-center rounded-[6px] h-[25px]"
                          >
                            <Tooltip label={"Profile"} bg={bg} aria-label={`Profile`} hasArrow>
                            <div >
                            <FaRegUser style={{ color: iconColor }} fontSize={"15px"} />
                            </div>
                            </Tooltip>
                          </Link>
                          {check && <PermissionSetting adminid={item.admin_id} singledata={item} permissionsData={item.permissions} />}
                          {check2 && <CurrencyModal adminId={item.admin_id} roleType={item.role_type} username={item.username} />}
                          {check1 && <ChangePassword id={item.admin_id} type="admin" />}
                          {check1 && <DeleteUserAdmin type="admin" name={item.username} id={item.admin_id} onDeleteSuccess={deleteUserHandler} />}
                          {check1 && <BalanceAction userData={item} getData={getAllAdmin} title={item.role_type}type="direct"/>}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          </div>
        )}
        </div>

      <div>
        {allAdminData?.length===0&&!loading?<div className="flex justify-center items-center"><img src={nodatafound} className="w-[300px] rounded-[50%]" alt="No user found" /></div>:""}
      </div>
      <div className="flex justify-between items-center">
      {allAdminData?.length>0&&    <p style={{color:iconColor}} className="text-xs font-semibold ">{t(`Showing`)} 1 {t(`to`)} {limit} {t(`of`)} {adminCount?.totalAdminCount} {t(`Entries`)}</p>}
        {allAdminData && allAdminData.length > 0 && (
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
    </div>
  );
};

export default AdminManage;
