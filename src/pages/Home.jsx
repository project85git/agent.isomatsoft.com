import React, { useEffect, useState } from "react";
import user from "../assets/users.png";
import { BiDotsHorizontalRounded, BiSolidWalletAlt } from "react-icons/bi";
import {
  BsFillClockFill,
  BsArrowRightShort,
  BsFillRocketTakeoffFill,
  BsCartFill,
  BsCheckCircleFill,
  BsArrowDownCircle,
  BsArrowUpCircle,
  BsCalendarDateFill,
} from "react-icons/bs";
import { RiBankFill, RiLuggageDepositLine, RiNumbersFill } from "react-icons/ri";
import Chart from "../component/Chart";
import { HiCurrencyDollar, HiOutlineDotsVertical } from "react-icons/hi";
import { TbCoin, TbMoneybag } from "react-icons/tb";
import { GoDotFill } from "react-icons/go";
import dash from "../assets/dash1.png";
import d2 from "../assets/d2.png";
import coin from "../assets/rupees.png";
import plbg from '../assets/plbg.jpeg'
import Carousel from "../component/Carousel";
import { LuImport } from "react-icons/lu";
import deposit from "../assets/deposit.png";
import withdraw from "../assets/Vector.png";
import icon from "../assets/icon.png";
import { useDispatch, useSelector } from "react-redux";
import { HiMiniUsers } from "react-icons/hi2";
import { Avatar, Badge, Box, Progress, Skeleton, Switch, useToast } from "@chakra-ui/react";
import { FaRegCreditCard, FaUsers } from "react-icons/fa";
import { MdOutlineAccountBalance, MdPendingActions } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import Barchart from "../component/Barchart";
import { fetchGetRequest } from "../api/api";
import { retrieveUserDetails } from "../redux/middleware/localstorageconfig";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import {
  getAdminFailure,
  getAdminRequest,
  getAdminSuccess,
} from "../redux/auth-redux/actions";
import nouser from "../assets/not.png";
import notbetimg from "../assets/notbet.png";

import { useNavigate } from "react-router-dom";
import { convertToUniversalTime, formatDate, formatDateTime, getGameProvider } from "../../utils/utils";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { GiDiamondTrophy } from "react-icons/gi";
const Home = () => {
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
  const navigate = useNavigate();
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const getAdminDetails = JSON.parse(localStorage.getItem("adminauth"));

  const adminLayer = user.adminLayer;
  const [loading, setLoading] = useState(false);
  const [graphDeposit, setGraphDeposit] = useState([]);
  const [graphWithdraw, setGraphWithDraw] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const [newUserData, setNewUsers] = useState([]);
  const [transactionData, setAllTransaction] = useState([]);
  const toast = useToast();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [adminPldata, setAdminPlData] = useState({});
  const [adminPlLoading, setAdminPlLoading] = useState(false);
  const [casinoBetData,setCasinoBetData]=useState([])
  const [casinoBetloading,setCasinoBetLoading]=useState(false)
  const [dateCategory,setDateCategory]=useState('24h')
const [ggrData,setGGRData]=useState({})
const [ggrDataLoading,setggrDataLoading]=useState(false)

const { selectedWebsite, siteDetails } = useSelector(
  (state) => state.websiteReducer
);
let filteredSite = siteDetails.filter((item) => item.selected === true);

  if (!getAdminDetails || !getAdminDetails?.token) {
    navigate("/login");
    return
  }
  const dispatch = useDispatch();
  const [adminCount, setAdminCount] = useState([]);
  const [adminDataLoading,setAdminDataLoading]=useState(false)
  const getAllAdmin = async () => {
    setAdminDataLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/admin/get-all-admin`;

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data;
      setAdminCount(response.adminCount);

      setAdminDataLoading(false);
    } catch (error) {
      // toast({
      //   description: `${error?.data?.message}`,
      //   status: "error",
      //   duration: 4000,
      //   position: "top",
      //   isClosable: true,
      // });
      setAdminDataLoading(false);
    }
  };
  const getGraphDetails = async () => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/transaction/get-all-transaction-amount-for-graph`;

    try {
      let response = await fetchGetRequest(url);
      setGraphDeposit(response?.lastTwelveMonthsDepositAmount);
      setGraphWithDraw(response?.lastTwelveMonthsWithdrawAmount);
      setLoading(false);
    } catch (error) {
      toast({
        description: error?.message || error?.data?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };
  const getAllUser = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/admin/get-all-user`;

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data;
      setAllUserData(receivedData);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const getTransactionDetails = async () => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/transaction/get-all-transaction?transaction_type=all&user_type=all&page=1&limit=20`;

    try {
      let response = await fetchGetRequest(url);
      setAllTransaction(response.data);
      setLoading(false);
    } catch (error) {
      toast({
        description: error?.message || error?.data?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

const getCasinoBetHistory = async () => {
  setCasinoBetLoading(true);
  let url = `${import.meta.env.VITE_API_URL}/api/bet/get-all-bet?status=all&limit=20`;
  


  try {
    let response = await fetchGetRequest(url);
    const data = response.data;
    const receivedData = response.data;
    setCasinoBetData(receivedData);
    setCasinoBetLoading(false);
  } catch (error) {
    toast({
      description: `${error?.data?.message}`,
      status: "error",
      duration: 4000,
      position: "top",
      isClosable: true,
    });
    setCasinoBetLoading(false);
  }
};
const getGGRReport = async () => {
  setggrDataLoading(true)
  const formattedFromDate = fromDate
    ? new Date(fromDate).toISOString().split("T")[0]
    : "";
  const formattedToDate = toDate
    ? new Date(toDate).toISOString().split("T")[0]
    : "";
  let url = `${
    import.meta.env.VITE_API_URL
  }/api/bet/get-data-overview?`;

  if (formattedFromDate && formattedToDate) {
    url += `start_date=${formattedFromDate}&end_date=${formattedToDate}`;
  }
  else{
    url+=`&filter=${dateCategory}`
  }

  try {
    let response = await fetchGetRequest(url);
    if (response) {
      setGGRData(response);
    }
  setggrDataLoading(false)

  } catch (error) {
    toast({
      description: `${error?.data?.message || error?.message}`,
      status: "error",
      duration: 4000,
      position: "top",
      isClosable: true,
    });
  }
  setggrDataLoading(false)

};

console.log(adminCount, "adminCount")
useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Use Promise.all to execute all API calls concurrently
        await Promise.all([
          getAllAdmin(),
          getGraphDetails(),
          getCasinoBetHistory(),
          getAllUser(),
          getGGRReport(),
          getTransactionDetails(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAllData();
}, []);

  useEffect(() => {
      getGGRReport()
  }, [dateCategory,toDate]);

  const getAdmin = async () => {
    dispatch(getAdminRequest());
    let url = `${import.meta.env.VITE_API_URL}/api/admin/get-single-admin/${
      adminData.admin_id
    }`;
    try {
      let adminData = await fetchGetRequest(url);
      dispatch(getAdminSuccess(adminData.data));
    } catch (error) {
      dispatch(getAdminFailure(error?.message));
    }
  };

  const getAdminPlDetails = async () => {
    setAdminPlLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/transaction/get-admin-pl-details`;

    try {
      let response = await fetchGetRequest(url);
      setAdminPlData(response);

      setAdminPlLoading(false);
    } catch (error) {
      toast({
        description: error?.message || error?.data?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setAdminPlLoading(false);
    }
  };
//   const getTotalWager = async () => {
//     let url = `${
//       import.meta.env.VITE_API_URL
//     }/api/user/get-total-wager`;
//     try {
//       let response = await fetchGetRequest(url);


//     } catch (error) {
//       toast({
//         description: error?.message || error?.data?.message,
//         status: "error",
//         duration: 4000,
//         position: "top",
//         isClosable: true,
//       });
//     }
//   };

  useEffect(() => {
    getAdmin();
    getAdminPlDetails();
    // getTotalWager()
  }, []);

  useEffect(() => {
    const newUsersData = allUserData?.filter((user) =>
      isNewUser(user.joined_at)
    );
    setNewUsers(newUsersData);
  }, [allUserData]);

  const isNewUser = (joinedAt) => {
    const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const joinedDate = new Date(joinedAt);
    const currentDate = new Date();
    return currentDate - joinedDate <= twentyFourHoursInMilliseconds;
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

const handleSetCatgory=(e)=>{
  setDateCategory(e.target.value)
  setFromDate('')
  // setToDateDate('')
}

const data = adminCount
  .filter(item => item.key !== 'totalAdminCount' && item.key !== 'ownerAdminCount')
  .map(item => ({
    name: item.label,
    value: item.count
  }));

  const currentTime = new Date();

  // Calculate the time 24 hours ago
  const twentyFourHoursAgo = new Date(currentTime.getTime() - (24 * 60 * 60 * 1000));
  
  // Filter the data based on the condition that BetTime is within the last 24 hours
  const filteredData = casinoBetData.filter(item => {
      // Convert BetTime string to a Date object
      const betTime = new Date(item.BetTime);
      // Check if BetTime is greater than or equal to twentyFourHoursAgo and less than or equal to currentTime
      return betTime >= twentyFourHoursAgo && betTime <= currentTime;
  });
  

  return (
    <div className="sm:px-2  mb-5">
      <div className="relative">
        <div
          style={{ backgroundColor: bg }}
          className={`w-[100%] h-[200px] rounded-[8px]`}
        ></div>
        <div className="overflow-scroll -mt-20 px-5  flex gap-4 justify-between   ">
          <div className=" absolute top-8 flex justify-between w-[100%] text-white text-xl">
            <div className=" text-[14px] md:text-lg">
              <p className="font-bold ">{t('Hello')} {adminData.username}</p>
              <p className="font-semibold ">{filteredSite[0]?.site_name}</p>
            </div>
            <p className="font-bold flex items-center gap-1 text-xl md:text-3xl pr-12 ">
           
              {adminData?.amount?.toFixed(2)}
              <span className="text-[14px] md:text-lg">


              {adminData?.currency}

              </span>

            </p>
          </div>
          <div className="flex gap-3 lg:gap-5 overflow-x-auto">
        {adminDataLoading
        ? Array(7) // Adjust the number of skeletons as needed
        .fill("")
        .map((_, index) => (
          <Box
            key={index}
            className="flex items-center gap-2 bg-white rounded-md shadow-md p-2  min-w-[160px] justify-between"
          >
            <Skeleton
              className="rounded-full"
              rounded={"50%"}
              height="32px"
              width="32px"
              startColor="gray.400"
              endColor={secondaryBg}
            />
            <div className="flex flex-col gap-1 justify-start items-center">
              <Skeleton
                height="14px"
                width="60px"
                startColor="gray.400"
                endColor={secondaryBg}
              />
              <Skeleton
                height="16px"
                width="40px"
                startColor="gray.400"
                endColor={secondaryBg}
              />
            </div>
          </Box>
        ))
       :adminCount // assuming this is the array returned from getCountsByLayer()
        .filter(item => item.key !== 'totalAdminCount' && item.key !== 'ownerAdminCount')
        .map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-white rounded-md shadow-md p-2 min-w-[160px] justify-between"
          >
            {/* Icon container */}
            <div
              style={{ border: `1px solid ${border}60` }}
              className="rounded-full h-8 w-8 p-1 flex justify-center items-center bg-gray-50"
            >
              <HiMiniUsers
                style={{ color: iconColor }}
                className="text-lg"
              />
            </div>
            {/* Content */}
            <div className="flex flex-col justify-start items-center">
              <p className="text-xs font-semibold text-gray-700">
                {t(item.label)}
              </p>
              <p className="text-sm font-bold text-gray-900">{item.count}</p>
            </div>
          </div>
        ))}
        </div>
        </div>
      </div>
{adminData?.role_type===import.meta.env.VITE_ROLE_SUPER&&
    <div style={{backgroundColor:hoverColor}} className="bg-white p-5  mt-8 rounded-lg">
      <div className="flex flex-col  ">
      <p className="font-bold text-lg text-white">{t(`Overview`)}</p>
        <div  className="flex mt-8 flex-col  sm:flex-row justify-between items-center gap-5">
        <select value={dateCategory} onChange={(e)=>handleSetCatgory(e)} style={{border:`1px solid ${border}60`}} className="outline-none p-[2px] w-[150px] rounded-sm">
        {/* <option value={""}>{t(`select`)}</option> */}
        <option value="24h">{t(`Last`)} 24 {t(`Hours`)}</option>
        <option value="7days">{t(`Last`)} 7 {t(`Days`)}</option>
        <option value="30days">{t(`Last`)} 30 {t(`Days`)}</option>
        <option value="today">{t(`Today`)}</option>
        <option value="yesterday">{t(`Yesterday`)}</option>
        <option value="thismonth">{t(`This`)} {t(`Month`)}</option>
        <option value="lastmonth">{t(`Last`)} {t(`Month`)}</option>

        </select>
        <p style={{backgroundColor:bg}} className="font-bold border px-4 min-w-[100px] rounded-md p-1 text-white text-sm">{t(`GGR`)} : <span className="text-sm">{ggrData?.gameGGR}</span></p>
        <div className="flex gap-2  items-center">
            <div className="flex  items-center gap-2">
              <p className="text-white">{t(`From`)}</p>
              <input
                type="date"
                style={{ border: `1px solid ${border}60` }}
                // min={today}
                className={` outline-none  rounded-sm px-3 text-xs py-1`}
                value={fromDate}
                onChange={handleFromDateChange}
              />
            </div>
            <div className="flex  items-center ml-2 gap-2">
              <p className="text-white">{t(`to`)}</p>
              <input
                type="date"
                style={{ border: `1px solid ${border}60` }}
                // min={today}
                className={` ml-2 outline-none rounded px-3 py-1 text-xs `}
                value={toDate}
                onChange={handleToDateChange}
              />
            </div>
          </div>
        </div>

      
     
    </div>
  
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 justify-between items-center gap-3 mt-6">
  <div style={{border:`1px solid ${border}60`,backgroundColor:"white"}} className="flex pr-5 p-1 px-2 w-[100%] items-center justify-between font-bold rounded-md  ">
<div>
{ggrDataLoading?<LoadingSpinner/>:ggrData?.approvedWithdrawAmount?.toFixed(2)}
    <p className="font-medium text-gray-500 text-[10px]">{t(`Withdrawal`)} {t(`Amount`)}</p>
</div>
    <RiBankFill color={iconColor} fontSize={"25px"} />
</div>
  <div style={{border:`1px solid ${border}60`,backgroundColor:"white"}} className="flex pr-5 p-1 px-2 w-[100%] items-center justify-between font-bold rounded-md   ">
<div>
{ggrDataLoading?<LoadingSpinner color={border}/>:ggrData?.depositAmount?.toFixed(2)}
    <p className="font-medium text-gray-500 text-[10px]">{t(`Deposit`)} {t(`Amount`)}</p>
  </div>

    
    <TbMoneybag color={iconColor} fontSize={'25px'} />
  </div>

  <div style={{border:`1px solid ${border}60`,backgroundColor:"white"}} className="flex pr-5 p-1 px-2 w-[100%] items-center justify-between font-bold rounded-md   ">

   <div>
   {ggrDataLoading?<LoadingSpinner color={border} />:ggrData?.userAmount?.toFixed(2)}
    <p className="font-medium text-gray-500 text-[10px]">{t(`User`)} {t(`Amount`)}</p>

    </div> 
    <FaUsers color={iconColor} fontSize={'25px'}/>
  </div>
  <div style={{border:`1px solid ${border}60`,backgroundColor:"white"}} className="flex pr-5 p-1 px-2 w-[100%] items-center justify-between font-bold rounded-md   ">

    <div>
    {ggrDataLoading?<LoadingSpinner color={border}/>:ggrData?.winsAmount?.toFixed(2)}
    <p className="font-medium text-gray-500 text-[10px]">{t(`Wins`)} {t(`Amount`)}</p>

    </div>
    

    <GiDiamondTrophy color={iconColor} fontSize={'25px'} />
  </div>
  <div style={{border:`1px solid ${border}60`,backgroundColor:"white"}} className="flex pr-5 p-1 px-2 w-[100%] items-center justify-between font-bold rounded-md   ">

   
   <div>
   {ggrDataLoading?<LoadingSpinner color={border}/>:ggrData?.depositCount}
    <p className="font-medium text-gray-500 text-[10px]">{t(`Deposit`)} {t(`Count`)}</p>
   </div>
    
    <RiNumbersFill color={iconColor} fontSize={'25px'} />
  </div>
  <div style={{border:`1px solid ${border}60`,backgroundColor:"white"}} className="flex pr-5 p-1 px-2 w-[100%] items-center justify-between font-bold rounded-md   ">
<div>
{ggrDataLoading?<LoadingSpinner color={border}/>:ggrData?.pendingWithdrawAmount?.toFixed(2)}
    <p className="font-medium text-gray-500 text-[10px]">{t(`Pending`)} {t(`Withdraw`)} {t(`Amount`)}</p>
</div>
<MdPendingActions color={iconColor} fontSize={'25px'} />
    
  </div>

</div>
</div>}

      <div className="flex mt-4 gap-6  flex-col w-[100%] justify-start items-start  lg:flex-row">
        <div className="w-[100%] lg:w-[65%] flex flex-col gap-2">
          <div className="flex w-[100%] flex-col gap-4 lg:gap-4  justify-between">
            <div className=" w-[100%] overflow-scroll pt-5 pl-3 mt-4 bg-white rounded-xl min-h-[400px] ">
              {/* <div className="flex gap-2   items-end justify-end mr-2">
      <div className='flex items-center gap-2'>
        <p>From</p>
        <input
          type="date"
          style={{border:`1px solid ${border}60`}}

          className={` outline-none  rounded px-3 text-xs py-1}
          value={fromDate}
          onChange={handleFromDateChange}
        />
      </div>
      <div className='flex items-center ml-2 gap-2'>
        <p>To</p>
        <input
          type="date"
          style={{border:`1px solid ${border}60`}}

          className={` ml-2 outline-none rounded px-3 py-1 text-xs `}
          value={toDate}
          onChange={handleToDateChange}
        />
      </div>
    </div> */}
              <Barchart
                title={`${t(`Transaction`)} ${t(`Details`)}`}
                width={"100%"}
                id="first"
                height={"400px"}
                type="bar"
                deposits={graphDeposit}
                withdrawals={graphWithdraw}
              />
            </div>

            {/* recetnlr user added */}
            <div className={` bg-white pb-6 rounded-[12px] mt-2  `}>
              <div className="h-[100%] rounded-[16px] px-4  pt-4 w-[100%]  ">
                {loading && (
                  <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
                )}
                <div className="flex justify-between items-center">
                  <div className="">
                    <p className=" font-semibold text-sm  pt-2 text-left">
                      {t(`New`)} {t(`Registered`)} {t(`Members`)} ( {t(`Last`)} 24 {t(`Hours`)} )
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center   overflow-scroll h-[340px] pb-5 mt-3 flex-col gap-3`}
                >
                  {newUserData.length > 0 &&
                    newUserData?.map((item) => {
                      return (
                        <div
                          style={{ border: `1px solid ${border}60` }}
                          key={item.id}
                          className={` rounded-[10px] w-[100%]`}
                        >
                          <div className="rounded-[10px] flex justify-between  overflow-scroll items-center gap-2 bg-white p-2 w-[100%]">
                            <div className="flex items-center w-[100%] min-w-[120px] gap-1">
                              <Avatar
                                name="Dan Abrahmov"
                                src="https://bit.ly/dan-abramov"
                              />
                              <div className="flex flex-col gap-1">
                                <p className="text-sm font-bold">
                                  {item?.username}
                                </p>
                              </div>
                            </div>
                            <div className="flex w-[100%] min-w-[120px] justify-center items-center flex-col gap-1">
                              <p className="text-xs flex items-center  gap-1 font-bold">
                                <MdOutlineAccountBalance
                                  style={{ color: iconColor }}
                                />
                                {t(`Balance`)}
                              </p>
                              <p className="text-xs flex text-left justify-start gap-1 rounded-sm font-semibold ">
                                {" "}
                                {item?.amount?.toFixed(2)}{" "}
                                <span className="text-[10px]">
                                  {" "}
                                  {item?.currency}
                                </span>
                              </p>
                            </div>
                            <div className="flex w-[100%] min-w-[120px] justify-center items-center flex-col gap-1">
                              <p className="text-xs flex  gap-1 font-bold">
                                <MdOutlineAccountBalance
                                  style={{ color: iconColor }}
                                />
                                {t(`Country`)}
                              </p>
                              <p className="text-xs font-bold flex text-left justify-start rounded-sm  ">
                                {item?.country}
                              </p>
                            </div>
                            <div className=" flex w-[100%] min-w-[120px] justify-end items-center flex-col gap-1">
                              <p className="text-xs flex items-center gap-1 font-bold">
                                <FaRegCreditCard
                                  color=""
                                  style={{ color: iconColor }}
                                />
                                {t(`Date`)}
                              </p>
                              <p className="text-xs flex flex-col font-medium ">
                              {formatDateTime(item?.joined_at).split(" ")[0]}
                                <span className="text-xs font-bold">
                                {formatDateTime(item?.joined_at).split(" ")[1]}

                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {newUserData.length == 0 && (
                    <div className="flex flex-col items-center h-[100%] justify-center gap-1">
                      <img
                        src={nouser}
                        className="w-[100px]  rounded-lg"
                        alt=""
                      />
                      <p
                        style={{ color: iconColor }}
                        className="font-semibold text-sm"
                      >
                        {t(`No`)} {t(`New`)} {t(`User`)} {t(`Found`)}!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* recentl bets added */}

            <div
              className={`h-[100%] rounded-[16px] bg-white p-3   w-[100%]  mt-2 `}
            >
              {loading && (
                <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
              )}
              <p
                style={{ color: iconColor }}
                className={`font-semibold text-sm pb-1  pt-2 text-left`}
              >
                {t(`Recently`)} {t(`Bet`)} {t(`Placed`)} ( {t(`Last`)} 24 {t(`Hours`)} )
              </p>
              {filteredData.length !== 0 ? (
                <div className=" h-[340px]  overflow-scroll">
                  <table className={`w-[100%] mt-5`}>
                    <tr
                      style={{ borderBottom: `1px solid ${border}60` }}
                      className={`text-center p-2 rounded-md   h-[30px]  text-[10px] font-bold `}
                    >
                      <th className="text-left">{t(`Username`)} / {t(`User`)} {t(`id`)}</th>
                      <th>{t(`Bet`)} {t(`Placed`)}</th>
                      <th className=" ">{t(`Provider`)} {t(`Name`)}</th>
                    <th className=" ">{t(`Game`)} {t(`Name`)}</th>
                      <th >{t(`Amount`)}</th>

                      <th>{t(`Win`)}/{t(`Loss`)}</th>
                      <th className="text-right ">Result</th>
                      {/* <th className="text-right">Settelment</th> */}
                    </tr>
                    <tbody className=" text-xs">
                      {filteredData &&
                        filteredData.map((item) => {
                          
                          return (
                            <tr
                              key={item?._id}
                              style={{ borderBottom: `1px solid ${border}60` }}
                              className={`text-center  h-[60px] m-auto   text-xs `}
                            >
                              <td className="">
                                <div className="flex text-left flex-col ">
                                  <p>{item?.Username}</p>
                                  <p className="text-[10px]   ">
                                    ({item?.UserId})
                                  </p>
                                </div>
                              </td>

                              <td>
                               
                              {formatDateTime(item?.BetTime).split(" ")[0]}
                                
                                </td>

                              <td className="">{item?.GpId}</td>
                          <td className="">{ item?.GameName?.slice(0,15)||"N/A" }</td>
                              <td className="">
                              <div className="flex items-center justify-center">
                              <button
                                className={`p-[6px] text-yellow-600 font-extrabold rounded-[8px] w-[60px] `}
                              >
                                {item.Amount?.toFixed(2)}
                              </button>
                            </div>
                              </td>
                              
                              <td
                            className={`font-bold  ${
                              item?.Status == "running"
                                ? "text-orange-400"
                                : item.WinLoss !== "0"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {" "}
                            {item.Status !== "running" &&
                              (item.WinLoss !== "0" ? "+" : "-")}
                            {item.Status == "running"
                              ? "0.00"
                              : item.WinLoss !== "0"
                              ? item.WinLoss
                              : item.Amount?.toFixed(2)}
                          </td>
                          <td >
                            <div className="flex justify-end items-end ">
                            <Badge
                              colorScheme={
                                item.Status === "BET"
                                  ? "orange"
                                  : item.Status === "WIN" && item.Amount > 0
                                  ? "green"
                                  : item.Status === "WIN" && item.Amount === 0
                                  ? "green"
                                  : "red"
                              }
                            >
                              {item.Status}
                            </Badge>
                            </div>
                           </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center min-h-[310px] justify-center gap-1">
                  <img
                    src={notbetimg}
                    className="w-[100px]  rounded-lg"
                    alt=""
                  />
                  <p
                    style={{ color: iconColor }}
                    className="font-semibold mt-3 text-sm"
                  >
                    {t(`Recent`)} {t(`Bet`)} {t(`Not`)} {t(`Found`)}!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-[100%] lg:w-[33%]  flex flex-col gap-5">
          {/* card */}
          <div className="w-[100%] border relative shadow-lg mt-5 pb-[20px]  bg-white rounded-lg ">
            <img src={d2} alt="" className="w-[100%] rounded-lg h-[310px]" />
            <div className="absolute bg-gray-300 bg-opacity-50  flex flex-col justify-between z-[1] w-[96%] rounded-2xl p-2 h-[240px] top-7 left-1 md:left-2">
              <div className="w-[100%] flex justify-between">
                <div className="flex flex-col ">
                  <p className="text-2xl font-bold  text-white">
                    {t(adminData?.role_type)}
                  </p>
                  <p className="text-sm font-medium text-white">
                    {t(`Profit`)} {t(`By`)} {t(`User`)}
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
                <p className="font-semibold flex items-center gap-1 text-xl text-white w-[100%]">
                
                  {adminData?.amount?.toFixed(2)} <span>{adminData?.currency}</span>
                </p>
              </div>
              <div className="flex justify-between w-[100%] px-1">
                <div className="flex flex-col ">
                  <p className="text-xs font-semibold text-white"> {t(`Username`)}</p>
                  <p className="text-[17px] font-medium text-white">
                    {" "}
                    {adminData?.username}
                  </p>
                </div>
                <div className="flex flex-col ">
                  <p className="text-xs font-semibold text-white"> {t(`LayerName`)}</p>
                  <p className="text-[16px] font-semibold text-white">
                    {" "}
                    {t(adminData?.role_type)}
                  </p>
                </div>
              </div>
            </div>

  <div className="w-full mt-4 p-6 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl">
  {/* Summary Cards */}
  <div className="grid grid-cols-2 gap-6">
    {/* Total Deposit Card */}
    <div className="flex items-center gap-4 p-2 bg-white rounded-md shadow-md hover:shadow-lg transition-shadow">
      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-200 flex items-center justify-center">
        <img src={deposit} alt="Deposit Icon" className="w-4 p-1" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">
          {adminPldata?.totalDepositAmount?.toFixed(2)}{" "}
          {/* <span className="text-sm font-medium text-gray-500">
            {adminData?.currency}
          </span> */}
        </p>
        <p className="text-sm text-gray-600">{t("Total")} {t("Deposit")}</p>
      </div>
    </div>

    {/* Total Withdraw Card */}
    <div className="flex items-center gap-4 p-2 bg-white rounded-md shadow-md hover:shadow-lg transition-shadow">
      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-200 flex items-center justify-center">
        <img src={withdraw} alt="Withdraw Icon" className="w-4 p-1" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">
          {adminPldata?.totalWithdrawAmount?.toFixed(2)}{" "}
          {/* <span className="text-sm font-medium text-gray-500">
            {adminData?.currency}
          </span> */}
        </p>
        <p className="text-sm text-gray-600">{t("Total")} {t("Withdraw")}</p>
      </div>
    </div>
  </div>

  {/* Additional Info */}
  <div className="mt-6 grid grid-cols-2 gap-6">
    {/* Pending Deposit Card */}
    <div className="flex items-center gap-4 p-2 bg-white rounded-md shadow-md hover:shadow-lg transition-shadow">
      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-200 flex items-center justify-center">
        <img src={icon} alt="Pending Icon" className="w-4 p-1" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">
          {adminPldata?.pendingDepositAmount?.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">{t("Pending")} {t("Deposit")}</p>
      </div>
    </div>

    {/* Profit/Loss Card */}
    <div className="flex items-center justify-between p-2 bg-white rounded-md shadow-md hover:shadow-lg transition-shadow">
      <span className="text-md font-semibold text-gray-700">P/L</span>
      <p
        className={`text-sm font-bold ${
          adminPldata?.totalPL > 0 ? "text-green-500" : "text-red-400"
        }`}
      >
        {adminPldata?.totalPL > 0 ? "+" : "-"}{" "}
        {adminPldata?.totalPL?.toFixed(2)}{" "}
        <span className="text-sm font-medium text-gray-500">
          {adminData?.currency}
        </span>
      </p>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="mt-6 flex justify-between gap-4">
    <button
      onClick={() => navigate("/user-deposit")}
      style={{backgroundColor:bg}}
      className="text-white font-semibold text-sm py-3 px-6 rounded-md w-full shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
    >
      {t("View")} {t("Deposit")}
    </button>
    <button
      onClick={() => navigate("/user-withdrawal")}
      className=" bg-red-600 text-white font-semibold text-sm py-3 px-6 rounded-md w-full shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
    >
      {t("View")} {t("Withdraw")}
    </button>
  </div>
</div>

          </div>
          <div className="w-full p-5 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl">
  <p className="text-xl font-semibold text-gray-800">{t('Recent')} {t('Transaction')}</p>
  
  <div className="overflow-y-auto flex flex-col gap-1 mt-5 h-[300px]">
    {transactionData.length > 0 &&
      transactionData?.map((item) => {
        return (
          <div
            key={item._id}
            className="flex justify-between items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <span
                className={`rounded-[6px] p-2 ${
                  item.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                } h-[35px] w-[35px] flex items-center justify-center shadow-sm transition-all duration-200`}
              >
                {item.type === 'deposit' ? (
                  <FaArrowRightLong
                    style={{ transform: 'rotate(400deg)' }}
                    color="green"
                    className="transition-all duration-300 transform hover:scale-110"
                  />
                ) : (
                  <FaArrowLeftLong
                    style={{ transform: 'rotate(40deg)' }}
                    color="red"
                    className="transition-all duration-300 transform hover:scale-110"
                  />
                )}
              </span>
              
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-700">{item?.username}</p>
                <p className="text-xs font-normal text-gray-500 flex gap-1 items-center">
                  {formatDateTime(item?.initiated_at).split(' ')[0]}
                  <span className="text-xs font-semibold text-gray-600">
                    ({formatDateTime(item?.initiated_at).split(' ')[1]})
                  </span>
                </p>
              </div>
            </div>
            
            <div
              className={`${
                item.type === 'withdraw' ? 'text-red-600' : 'text-green-600'
              } font-semibold text-sm`}
            >
              {item.type === 'withdraw' ? '-' : '+'}
              {item.type === 'deposit'
                ? item.deposit_amount?.toFixed(2)
                : item.withdraw_amount?.toFixed(2)}{' '}
              <span className="text-xs text-gray-500">{item?.currency}</span>
            </div>
          </div>
        );
      })}
  </div>
</div>

          <div className=" w-[100%] h-[100%] p-5 flex justify-start items-start  bg-white rounded-xl ">
            <Barchart
              title={`${t(`Layer`)} ${t(`Overview`)}`}
              // width={"100%"}
              type="pie"
              id="second"
              height={"350px"}
              data={data}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
