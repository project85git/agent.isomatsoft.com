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
  Tooltip,
  Text
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { SlScreenDesktop } from "react-icons/sl";
import { Link, useParams } from "react-router-dom";
import coin from ".././assets/rupees.png";
import { RiLuggageDepositFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { PiCubeTransparentFill } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import SlipModal from "../Modals/SlipModal";
import Barchart from "../component/Barchart";
import { fetchGetRequest } from "../api/api";
import { useTranslation } from "react-i18next";
import nodatafound from '../assets/emptydata.png'

import { checkPermission, formatDateTime } from "../../utils/utils";
import { IoMdInformationCircleOutline } from "react-icons/io";
const UserTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
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
  const [allTransaction, setAllTransaction] = useState([]);

  const [transactionType, setTransactionType] = useState("");
  const [search, setSearch] = useState("");
//   const [transactionCount, setTransactionCount] = useState({
//     approvedTransaction: 0,
//     pendingTransaction: 0,
//     rejectTransaction: 0,
//     allTransaction: 0,
//   });
  const toast = useToast();
  const [pagination, setPagination] = useState({});
  const totalPages = pagination.totalPages;
  const params = useParams();
  const [showLower, setShowlower] = useState(1);
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};

  const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;

  const permissionDetails = user?.user?.permissions;

  let hasPermission = checkPermission(permissionDetails, "downlineWithdrawManage");
  let check = !isOwnerAdmin ? hasPermission : true;
const [transactionGraphData,setTransactionGraphData]=useState({})
  const getAllTransactionDetails = async () => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/transaction/get-all-transaction?transaction_type=${transactionType}&user_type=admin&page=${currentPage}&limit=15`;

    if (search) {
      url += `&search=${search}`;
    }
    try {
      let response = await fetchGetRequest(url);
      setAllTransaction(response.data);
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
  const getTransactionGraph = async () => {
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/transaction/get-all-transaction-amount-for-graph?user_type=admin`;
  
    
    try {
      let response = await fetchGetRequest(url);
      setTransactionGraphData(response)
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
      getAllTransactionDetails();
      getTransactionGraph()
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
  const handleRender=()=>{
    getAllTransactionDetails()
  }
  
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
              <p className="text-sm font-medium text-white">{t(`PREMIUM`)} {t(`ACCOUNT`)}</p>
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
              <p className="text-xs font-semibold text-white"> {t(`Card Holder`)}</p>
              <p className="text-[17px] font-medium text-white"> {adminData?.username}</p>
            </div>
            <div className="flex flex-col ">
              <p className="text-xs font-semibold text-white"> {t(`Joined`)} {t(`Date`)}</p>
              <p className="text-[14px] font-medium text-white">{formatDateTime(adminData?.joined_at).split(" ")[0]}</p>
            </div>
          </div>
        </div>

        <div className=" bg-white  p-3  flex flex-col justify-between z-[1] w-[100%] rounded-2xl h-[240px] top-7 left-1 md:left-2">
          <div className="w-[100%] flex justify-between">
            <div className="flex flex-col ">
              <p className="text-sm font-medium ">{t(`Total`)} {t(`Transaction`)} {t(`Count`)}</p>
              <p className="text-lg font-semibold ">{allTransaction?.length}</p>
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
              <p className="font-normal text-sm  ">{t(`Joined`)} {t(`Date`)}</p>
              <p className="font-semibold text-sm ">{formatDateTime(adminData?.joined_at).split(" ")[0]}</p>
            </div>
          </div>
          <div className="flex justify-evenly mt-4 w-[90%] m-auto">
            <p className="font-semibold text-xl  w-[100%]">XXXX </p>
            <p className="font-semibold text-xl  w-[100%]"> ***** </p>
            <p className="font-semibold text-xl w-[100%]"> ***** </p>
            <p className="font-semibold text-xl  w-[100%]">XXXX </p>
          </div>
        </div>

        <div className=" bg-white  p-3 overflow-scroll  flex flex-col justify-between z-[1] w-[100%] rounded-2xl h-[240px] top-7 left-1 md:left-2">
          <Barchart
            title={`${t(`Transaction`)} ${t(`Overview`)}`}
            type={"bar"}
            deposits={transactionGraphData?.lastTwelveMonthsDepositAmount}
            withdrawals={transactionGraphData?.lastTwelveMonthsWithdrawAmount}
          />
        </div>
      </div>{" "}
      <p
        style={{ color: iconColor }}
        className={`font-bold mt-8  w-[100%]    flex items-center gap-2 rounded-[6px]  text-lg`}
      >
        <PiCubeTransparentFill style={{ color: iconColor }} fontSize={"30px"} />
       {t(`Admin`)} {t(`Recent`)} {t(`Transaction`)}
      </p>
      <div className="flex flex-col-reverse mt-2 lg:flex-row  justify-between lg:items-center">
      <div className="flex overflow-x-auto mt-4 lg:mt-0 w-full items-center font-semibold text-sm gap-4">
    {["all", "withdraw", "Deposit"].map((tab) => (
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
        {t(tab.charAt(0).toUpperCase() + tab.slice(1))} {t(`Transaction`)}
      </p>
    ))}
  </div>
        <div
          style={{ border: `1px solid ${border}60`, backgroundColor: primaryBg }}
          className={` justify-between rounded-[8px] pl-1 flex items-center gap-2`}
        >
          <input
            placeholder={`${t(`Search here`)}...`}
            className=" outline-none rounded-[8px] p-[6px]  text-black text-xs md:text-sm  w-[90%]"
          value={search}
          onChange={(e)=>{
          setSearch(e.target.value)
          setCurrentPage(1)
          }}
          />
          <span
            style={{ backgroundColor: bg }}
            className={`p-[6px] border rounded-r-[8px] cursor-pointer  `}
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
          {t(`All`)} {t(transactionType) || `${t(`Transaction`)}`} {t(`Details`)}

          </p>
         {allTransaction?.length>0&&<table className="w-[100%] ">
            <tr style={{backgroundColor:bg, color:"white"}}  className="text-left p-2   border border-gray-300 text-[10px] font-bold ">
              <th className="px-3 py-2 border border-gray-300 text-left min-w-[120px]">{t(`Trx`)}</th>
              <th className=" px-3 py-2 border border-gray-300 min-w-[120px]">{t(`Method`)}/{t(`Gateway`)}</th>
              <th className=" px-3 py-2 border border-gray-300 min-w-[120px]">{t(`Date`)}/{t(`Time`)}</th>
              <th className=" px-3 py-2 border border-gray-300 min-w-[140px]">{(`User`)}/{t(`UserId`)}</th>
              <th className=" px-3 py-2 border border-gray-300 min-w-[120px]">{t(`Transaction`)} {t(`Amount`)}</th>
              <th className=" px-3 py-2 border border-gray-300 min-w-[120px]">{t(`Wallet`)} {t(`Balance`)}</th>
              <th className=" px-3 py-2 border border-gray-300 min-w-[60px]">{t(`Status`)}</th>
              <th className="px-3 py-2 border border-gray-300 min-w-[80px] text-center">{t(`Payment Info`)}</th>
              {check&& <th className=" min-w-[100px] text-center">{t(`Action`)}</th>}
            </tr>
            {allTransaction.length > 0 &&
  allTransaction
    .filter(item => item.status!== "pending") 
    .map(item => {
               return <tr
                  key={item._id}
                  className="text-left font-semibold h-[60px] m-auto  border-b border-gray-600 text-xs "
                >
                  <td className="p-3 border border-gray-300 max-w-[120px]">
                    <div className="flex  flex-col gap-[2px]  ">
                      <p className="text-[10px]   ">{item.transaction_id}</p>
                    </div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="flex ">
                      <Badge>{item.method}</Badge>
                    </div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="flex flex-col  gap-[2px] ">
                      <p>
                      
                        {formatDateTime(item?.initiated_at).split(" ")[0]}
                        </p>
                      <p className="text-[10px] font-bold   ">
                        (
                          {formatDateTime(item?.initiated_at).split(" ")[1]}
                        )
                      </p>
                    </div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="flex flex-col  gap-[2px] ">
                      <p>{item.username}</p>
                      <p className="text-[10px] font-bold   ">
                        ({item.user_id})
                      </p>
                    </div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="flex flex-col  gap-[2px]">
                      <p
                        className={`text-[16px] ${
                          item.type == "withdraw"
                            ? "text-red-600"
                            : "text-green-500"
                        } `}
                      >
                        {item.type == "withdraw"
                          ? item.withdraw_amount?.toFixed(2)
                          : item.deposit_amount?.toFixed(2)}{" "}
                        +<span className="text-xs  ">{item.bonus}%</span>
                      </p>
                      {item.type === "withdraw" ? (
                        <p className="text-xs    ">
                          {item.withdraw_amount?.toFixed(2) + item.bonus} {item?.currency}
                        </p>
                      ) : (
                        <p className="text-xs    ">
                          {item.deposit_amount?.toFixed(2) + item.bonus} {item?.currency}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <div className="flex    gap-2">
                      {/* <img src={coin} alt="" className="h-[15px] w-[15px]" /> */}
                      <span>{item.wallet_amount?.toFixed(2)} {item?.currency}</span>
                    </div>
                  </td>

                  <td className="p-3 border border-gray-300">
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
                  <td className="p-3 border border-gray-300 text-center">
            <Menu>
              <MenuButton className="flex">
                <Button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                    gap: "2px",
                    justifyContent: "center",
                    color,
                  }}
                >
                  <IoMdInformationCircleOutline size={"24px"} />
                </Button>
              </MenuButton>
              <MenuList style={{ width: "300px", height: "220px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div className="flex flex-col justify-between w-[100%]">
                  {Object.entries(item?.auto_payment_details).map(([key, value]) => (
                    <MenuItem
                      key={key}
                      style={{ display: "flex", justifyContent: "space-between", gap: "8px", width: "100%", fontWeight: "bold" }}
                    >
                      <Text>{key.replace(/_/g, " ")}</Text>
                      {key === "status" ? (
                        <Badge colorScheme={value === "paid" ? "green" : value === "error" ? "red" : "yellow"}>{value}</Badge>
                      ) : value && value.toString().length > 30 ? (
                        <Tooltip label={value.toString()}>
                          <Link
                            to={value}
                            style={{
                              fontWeight: "800",
                              fontSize: "14px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "160px",
                            }}
                          >
                            {value.toString().slice(0, 30)}...
                          </Link>
                        </Tooltip>
                      ) : (
                        <Text style={{ fontWeight: "800", fontSize: "14px" }}>{value ? value.toString() : "N/A"}</Text>
                      )}
                    </MenuItem>
                  ))}
                </div>
              </MenuList>
            </Menu>
          </td>
                  {check&&<td className="p-3 border border-gray-300">
                    <div className="flex justify-center">
                      <SlipModal data={item} type="user" handleRender={handleRender} />
                    </div>
                  </td>}
                </tr>
})}
          </table>
         }
      <div>
        {allTransaction?.length===0&&!loading?<div className="flex justify-center items-center"><img src={nodatafound} className="w-[300px] rounded-[50%]" alt="No user found" /></div>:""}
      </div>
        </div>
      </div>
      
      {allTransaction && allTransaction.length > 0 && (
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

export default UserTransaction;
