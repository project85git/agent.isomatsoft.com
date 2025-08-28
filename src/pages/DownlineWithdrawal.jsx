import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Progress,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { SlScreenDesktop } from "react-icons/sl";
import { Link, useParams } from "react-router-dom";
import coin from ".././assets/rupees.png";
import { RiLuggageDepositFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { IoSearchOutline } from "react-icons/io5";
import SlipModal from "../Modals/SlipModal";
import Barchart from "../component/Barchart";
import { fetchGetRequest } from "../api/api";
import { useTranslation } from "react-i18next";
import nodatafound from '../assets/emptydata.png'

import { checkPermission, convertToUniversalTime, formatDate, formatDateTime } from "../../utils/utils";
const DownlineWithDrawal = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};

  const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;

  const permissionDetails = user?.user?.permissions;

  let hasPermission = checkPermission(permissionDetails, "downlineWithdrawManage");
  let check = !isOwnerAdmin ? hasPermission : true;
  const { t, i18n } = useTranslation();

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

  const [currentPage, setCurrentPage] = useState(1);
  const [allWithdraw, setAllWithdraw] = useState([]);
  const [withdrawGraphData, setWithdrawGraphData] = useState({});

  const [transactionType, setTransactionType] = useState("");
  const [search, setSearch] = useState("");
  const [transactionCount, setTransactionCount] = useState({
    approvedTransaction: 0,
    pendingTransaction: 0,
    rejectTransaction: 0,
    allTransaction: 0,
  });
  const toast = useToast();
  const [pagination, setPagination] = useState({});
  const totalPages = pagination.totalPages;
  const params = useParams();
  const [showLower, setShowlower] = useState(1);
  const getWithdrawDetails = async () => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/admin/get-all-withdraw-data-of-lower-admin?page=${currentPage}&limit=15`;
    if (transactionType) {
      url += `&transaction_type=${transactionType}`;
    }
    if (search) {
      url += `&search=${search}`;
    }
    try {
      let response = await fetchGetRequest(url);
      setAllWithdraw(response.data);
      setTransactionCount(response.transactionsCount);
      setPagination(response.pagination);
      setLoading(false);
    } catch (error) {
      toast({
        description: error?.message || error?.data?.message||error?.response?.data?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const getWithdrawGraph = async () => {
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/transaction/get-all-transaction-amount-for-graph`;

    try {
      let response = await fetchGetRequest(url);
      setWithdrawGraphData(response);
    } catch (error) {
      toast({
        description: error?.message || error?.data?.message||error?.response?.data?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    let id;
    id = setTimeout(() => {
      getWithdrawDetails();
      getWithdrawGraph();
    }, 100);
    return () => clearTimeout(id);
  }, [currentPage, transactionType, search]);
  const handleClick = (tab) => {
    setCurrentPage(1)
    setActiveTab(tab);
    if (tab == "all") {
      setTransactionType("");
    } else {
      setTransactionType(tab);
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

  const handleRender = () => {
    getWithdrawDetails();
  };

  return (
    <div className="lg:px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  justify-between  gap-6 w-[100%]">
        <div
          style={{ backgroundColor: bg }}
          className={` flex flex-col justify-between z-[1] w-[100%] rounded-2xl p-2 h-[240px] top-7 left-1 md:left-2`}
        >
          <div className="w-[100%] flex justify-between">
            <div className="flex flex-col ">
              <p className="text-2xl font-bold  text-white">VISA</p>
              <p className="text-sm font-medium text-white">
                {t(`PREMIUM`)} {t(`ACCOUNT`)}
              </p>
            </div>
            <svg
              width="116"
              height="71"
              viewBox="0 0 116 71"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                opacity="0.25"
                cx="35.5"
                cy="35.5007"
                r="35.5"
                fill="white"
              />
              <circle
                opacity="0.5"
                cx="79.5195"
                cy="35.5007"
                r="35.5"
                fill="white"
              />
            </svg>
          </div>
          <div className="flex justify-evenly mt-4 w-[90%] m-auto">
            <p className="font-semibold text-xl text-white w-[100%]">XXXX </p>
            <p className="font-semibold text-xl text-white w-[100%]"> ***** </p>
            <p className="font-semibold text-xl text-white w-[100%]"> ***** </p>
            <p className="font-semibold text-xl text-white w-[100%]">XXXX </p>
          </div>
          <div className="flex justify-between w-[100%] p-2">
            <div className="flex flex-col ">
              <p className="text-xs font-semibold text-white">
                {" "}
                {t(`Card Holder`)}
              </p>
              <p className="text-[17px] font-medium text-white">
                {" "}
                {adminData?.username}
              </p>
            </div>
            <div className="flex flex-col ">
              <p className="text-xs font-semibold text-white">
                {" "}
                {t(`Created`)} {t(`Date`)}
              </p>
              <p className="text-[14px] font-medium text-white">
                {formatDateTime(adminData?.joined_at).split(" ")[0]}
              </p>
            </div>
          </div>
        </div>

        <div className=" bg-white  p-3  flex flex-col justify-between z-[1] w-[100%] rounded-2xl h-[240px] top-7 left-1 md:left-2">
          <div className="w-[100%] flex justify-between">
            <div className="flex flex-col ">
              <p className="text-sm font-medium ">
                {t(`Total`)} {t(`Downline`)} {t(`Withdraw`)} {t(`Count`)}
              </p>
              <p className="text-lg font-semibold ">{allWithdraw?.length}</p>
            </div>
            <svg
              width="116"
              height="71"
              viewBox="0 0 116 71"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                opacity="0.25"
                cx="35.5"
                cy="35.5007"
                r="35.5"
                fill="white"
              />
              <circle
                opacity="0.5"
                cx="79.5195"
                cy="35.5007"
                r="35.5"
                fill="white"
              />
            </svg>
          </div>
          <div className="flex justify-between mt-4 w-[90%] m-auto">
            <div>
              <p className="font-normal text-sm  ">{t(`Card Holder`)}</p>
              <p className="font-semibold text-lg ">{adminData?.username}</p>
            </div>
            <div>
              <p className="font-normal text-sm  ">
                {t(`Joined`)} {t(`Date`)}
              </p>
              <p className="font-semibold text-sm ">
                {formatDateTime(adminData?.joined_at).split(" ")[0]}
              </p>
            </div>
          </div>
          <div className="flex justify-evenly mt-4 w-[90%] m-auto">
            <p className="font-semibold text-xl  w-[100%]">XXXX </p>
            <p className="font-semibold text-xl  w-[100%]"> ***** </p>
            <p className="font-semibold text-xl w-[100%]"> ***** </p>
            <p className="font-semibold text-xl  w-[100%]">XXXX </p>
          </div>
        </div>

        <div className=" bg-white  p-3  overflow-scroll flex flex-col justify-between z-[1] w-[100%] rounded-2xl h-[240px] top-7 left-1 md:left-2">
          <Barchart
            title={`${t(`Withdraw`)}`}
            type={"bar"}
            withdrawals={withdrawGraphData?.lastTwelveMonthsWithdrawAmount}
          />
        </div>
      </div>

      <p
        style={{ color: iconColor }}
        className={`font-bold mt-8  w-[100%]    flex items-center gap-2 rounded-[6px]   text-lg`}
      >
        <RiLuggageDepositFill fontSize={"30px"} style={{ color: iconColor }} />
        {t(`Downline`)} {t(`Withdraw`)} {t(`Manage`)}
      </p>

      <div className="flex items-center mt-2 sm:flex-row flex-col-reverse justify-between">
      <div className="flex overflow-x-auto mt-4 lg:mt-0 w-full items-center font-semibold text-sm gap-4">
    {["all", "approved"].map((tab) => (
      <p
        key={tab}
        style={{backgroundColor:activeTab===tab ? bg:"white" }}
        className={`px-4 py-2 cursor-pointer rounded-lg transition-all ${
          activeTab === tab
            ? `bg-${iconColor} text-white shadow-md`
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        onClick={() => handleClick(tab)}
      >
        {t(tab.charAt(0).toUpperCase() + tab.slice(1))} {t(`Withdraw`)}
      </p>
    ))}
  </div>
        <div
          style={{ border: `1px solid ${border}60`, backgroundColor: primaryBg }}
          className={`justify-between rounded-[8px] pl-1 flex items-center gap-2`}
        >
          <input
            placeholder={`${t(`Search here`)}...`}
            onChange={(e)=>{
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className=" outline-none rounded-[8px] p-[6px]  text-black text-xs md:text-sm  w-[90%]"
          />
          <span
            style={{ backgroundColor: bg }}
            className={`p-[6px] border rounded-r-[8px] cursor-pointer `}
          >
            <IoSearchOutline fontSize={"22px"} color="white" />
          </span>
        </div>
      </div>

      {/* table */}
      <div className="">
        <div className="h-[100%] overflow-scroll bg-white rounded-[12px] p-3  w-[100%]  mt-3">
          {loading && (
            <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
          )}
          <p className=" font-semibold text-sm pb-2 pt-2 text-left">
            {t(`All`)} {t(`Withdraw`)} {t(`Details`)}
          </p>
         {allWithdraw?.length>0&&<table className="w-[100%] ">
          <tr  style={{backgroundColor:bg, color:"white"}} className="text-left border border-gray-300">
      <th className="px-3 py-2 border border-gray-300 min-w-[100px] text-[12px] font-bold">
        {t(`Trx`)}
      </th>
      <th className="px-3 py-2 border border-gray-300 min-w-[120px] text-[12px] font-bold">
        {t(`Gateway`)}/{t(`Method`)}
      </th>
      <th className="px-3 py-2  border border-gray-300 min-w-[110px] text-[12px] font-bold">
        {t(`Initiated`)}
      </th>
      <th className="px-3 py-2 border border-gray-300 min-w-[130px] text-[12px] font-bold">
        {t(`User`)}/{t(`UserId`)}
      </th>
      <th className="px-3 py-2 border border-gray-300 min-w-[100px] text-[12px] font-bold">
        {t(`Withdraw`)} {t(`Amount`)}
      </th>
      <th className="px-3 py-2 border border-gray-300 min-w-[100px] text-[12px] font-bold">
        {t(`Wallet`)} {t(`Balance`)}
      </th>
      <th className="px-3 py-2 border border-gray-300 min-w-[110px] text-[12px] font-bold">
        {t(`Status`)}
      </th>
      {check && (
        <th className="px-3 py-2 border border-gray-300 text-[12px] font-bold text-left">
          {t(`Action`)}
        </th>
      )}
    </tr>
            {allWithdraw &&
              !loading &&
              allWithdraw.length > 0 &&
              allWithdraw?.map((item) => {
                return (
                  <tr
                    key={item._id}
                    className="text-left font-semibold h-[60px] m-auto  border-b border-gray-600 text-xs "
                  >
                    <td className="max-w-[130px]">
                      <div className="flex flex-col gap-[2px]  ">
                        <p className="text-[9px] font-bold  ">
                          {item.transaction_id}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="flex ">
                        <Badge
                          style={{
                            padding: "2px",
                            fontSize: "10px",
                            width: "",
                          }}
                        >
                          {item.method}
                        </Badge>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col  gap-[2px] ">
                        <p>
                      {formatDateTime(item?.initiated_at).split(" ")[0]}                        

                          </p>
                        <p className="text-[9px] font-bold   ">
                          ({formatDateTime(item?.initiated_at).split(" ")[1]})
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col  gap-[2px] ">
                        <p>{item.username}</p>
                        <p className="text-[9px] font-bold  ">
                          ({item.user_id})
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col  gap-[2px]">
                        <p className="text-[16px] ">
                          {item.withdraw_amount} +{" "}
                          <span className="text-xs text-red-500 ">
                            {item.bonus}
                          </span>
                        </p>
                        <p className="text-xs    ">
                          {(item?.withdraw_amount + item?.bonus)?.toFixed(1)}{" "}
                          {item?.currency}
                        </p>
                      </div>
                    </td>
                    <td className="">
                      <div className="flex   gap-2">
                        <span>
                          {item?.wallet_amount?.toFixed(2)} {item?.currency}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="flex flex-col  justify-between gap-[4px]  ">
                        <button
                          className={` px-2 p-1 rounded-md w-[100px] text-white text-[10px] ${
                            item.status == "approved"
                              ? "bg-[#01B574]"
                              : item.status == "reject"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          } `}
                        >
                          {item.status}
                        </button>
                      </div>
                    </td>
                   {check&&<td>
                      <div className=" flex">
                        {/* <Link
                        key={item._id}
                        to={`/admin/depositmanage/${item._id}`}
                      >
                        <SlScreenDesktop
                          cursor="pointer"
                          color="black"
                          fontSize="20px"
                        />
                      </Link> */}
                        <SlipModal
                          data={item}
                          type="admin"
                          handleRender={handleRender}
                        />
                      </div>
                    </td>}
                  </tr>
                );
              })}
          </table>
         }

      <div>
        {allWithdraw?.length===0&&!loading?<div className="flex justify-center items-center"><img src={nodatafound} className="w-[300px] rounded-[50%]" alt="No user found" /></div>:""}
      </div>
        </div>
      </div>
    
      {allWithdraw && allWithdraw.length > 0 && (
        <div
          className={`text-[16px]   text-sm font-semibold flex m-auto mb-8 mr-5 justify-end gap-3 align-middle items-center mt-2`}
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
  );
};

export default DownlineWithDrawal;
