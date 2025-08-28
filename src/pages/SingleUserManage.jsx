import React, { useEffect, useState } from 'react'
import { AiOutlineBell, AiOutlineFileText, AiOutlineGift, AiOutlineHistory, AiOutlineShareAlt, AiOutlineTransaction } from 'react-icons/ai';
import { BiHistory, BiMoneyWithdraw } from 'react-icons/bi';
import { RiLuggageDepositLine } from 'react-icons/ri';
import { CgProfile } from "react-icons/cg";
import { Avatar, Badge, Switch, useToast } from '@chakra-ui/react';
import AddBalance from '../component/usermanageComponent/AddBalance';
import SubtractBalance from '../component/usermanageComponent/SubtractBalance';
import SendMail from '../component/usermanageComponent/SendMail';
import logo from '../assets/logo.png'
import Profile from '../component/usermanageComponent/Profile';
import Deposit from '../component/usermanageComponent/Deposit';
import WithDrawl from '../component/usermanageComponent/WithDrawl';
import Transaction from '../component/usermanageComponent/Transaction';
import BetHistory from '../component/usermanageComponent/BetHistory';
import { useSelector } from 'react-redux';
import Referral from '../component/usermanageComponent/Referral';
import { MdLogin, MdOutlineAccountBalanceWallet } from 'react-icons/md';
import UserBonus from '../component/usermanageComponent/UserBonus';
import { useParams } from 'react-router-dom';
import { fetchGetRequest, sendPatchRequest } from '../api/api';
import { useTranslation } from 'react-i18next';
import { formatDate, formatDateTime } from '../../utils/utils';
import SingleLoginHistory from '../component/usermanageComponent/SingleLoginHistory';
import KYCDocument from '../component/usermanageComponent/KYCDocument';
import Wallet from '../component/usermanageComponent/Wallet';
import SendNotification from '../component/usermanageComponent/SendNotification';
import UserNotification from './UserNotification';
import { IoVolumeHighOutline } from 'react-icons/io5';
import { BsFillShareFill } from 'react-icons/bs';
import getColorFromUsername from '../../utils/getColorFromUsername';
import AddBonus from '../component/usermanageComponent/Addbonus';
const SingleUserManage = () => {
  const { color,primaryBg,iconColor,secondaryBg, bg,hoverColor,hover,text, font, border } = useSelector(state => state.theme);
  const { t, i18n } = useTranslation();

    const [active, setActive] = useState(1);
    const [userData, setUserData] = useState({});
    const [plData, setPlData] = useState({});
    const param = useParams();
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
  const toast=useToast()
    const [statusLoading, setStatusLoading] = useState(false);
    const data = [
      { id: 1, title: "Profile", icon: <CgProfile /> },
      { id: 5, title: "Wallet", icon: <MdOutlineAccountBalanceWallet /> },
      { id: 4, title: "Transactions", icon: <AiOutlineTransaction /> },
      { id: 2, title: "Deposit", icon: <RiLuggageDepositLine /> },
      { id: 3, title: "Withdraw", icon: <BiMoneyWithdraw /> },
      { id: 7, title: "Bets", icon: <BiHistory /> },
      { id: 8, title: "Bonuses", icon: <AiOutlineGift /> },
      { id: 9, title: "Logins", icon: <MdLogin /> },
      { id: 6, title: "Referrals", icon: <BsFillShareFill /> },
      { id: 10, title: "KYC", icon: <AiOutlineFileText /> },
      { id: 11, title: "Notifications", icon: <AiOutlineBell /> },
    ];

      const getUserData = async () => {
        setLoading(true);
        let url = `${import.meta.env.VITE_API_URL}/api/admin/get-single-user/${param.id}`;
        try {
          let response = await fetchGetRequest(url);
          const data = response.data;
    
          setLoading(false);
          const receivedData = response.data;
          if (receivedData) {
            setUserData(receivedData);
          }
        } catch (error) {
          setLoading(false);
          toast({
            description: `${error?.data?.message||error?.message}`,
            status: "error",
            duration: 4000,
            position: "top",
            isClosable: true,
          });
        }
      };
    
    
    
      const profitLossData = async () => {
        if(!Object.keys(userData).length){
          return
        }
         setLoading1(true);
        let url = `${import.meta.env.VITE_API_URL}/api/transaction/get-transaction-pl/${userData?.user_id}?username=${userData?.username}&type=user`;
    
        try {
          let response = await fetchGetRequest(url);
          setLoading1(false);
          if (response) {
            setPlData(response);
          }
        } catch (error) {
          setLoading1(false);
          toast({
            description: `${error?.data?.message|| error?.message}`,
            status: "error",
            duration: 4000,
            position: "top",
            isClosable: true,
          });
        }
      };
    
      useEffect(() => {
        getUserData();
      }, [param.id]);
    
    
      useEffect(()=>{
        profitLossData();
    
      },[userData])
    
      const handleActive = (id) => {
        setActive(id);
      };
    
      const handleStatusChange = async (name) => {
        setStatusLoading(true);
        let url = `${
          import.meta.env.VITE_API_URL
        }/api/admin/toggle-user-status/${param.id}`;
    
        try {
          let response = await sendPatchRequest(url, { name });
          const data = response.data;
    
          getUserData();
    
          toast({
            description: `${response.message}`,
            status: "success",
            duration: 4000,
            position: "top",
            isClosable: true,
          });
        } catch (error) {
          toast({
            description: `${error.message}`,
            status: "error",
            duration: 4000,
            position: "top",
            isClosable: true,
          });
          setStatusLoading(false);
        }
      };
  return (
    <div className="flex flex-col md:flex-row justify-between mt-4 gap-4 w-[98%] m-auto  ">
          <div className=" w-[100%] md:w-[22%]">
        <div className="flex flex-col-reverse  md:flex-col gap-6">
          {/* first box */}
          <div
            style={{border:`1px solid ${border}60`}}
            className={`w-[100%] bg-white p-4 rounded-md`}
          >
            <div className="flex flex-row gap-1 overflow-scroll md:flex-col  mt-2">
              {data.map((item) => {
                return (
                  <div
                    key={item.id}
                    style={{backgroundColor:item.id==active?bg:''}}
                    onClick={() => handleActive(item.id)}
                    className={`flex cursor-pointer  items-center font-semibold   min-w-[130px] md:w-[100%] px-4 md:px-0 lg:gap-3 md:p-[6px] text-xs ${
                      item.id == active ? ` text-white` : ""
                    }  rounded-md p-2`}
                  >
                    <span
                    style={{backgroundColor:item.id==active?bg:''}}

                      className={`rounded-[30%] md:p-2 mr-1 ${
                        item.id == active ? "" : bg
                      }  `}
                    >
                      {item.icon}
                    </span>
                    <p className='text-nowrap p-0'>{t(item.title)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* second box */}

          <div
           style={{border:`1px solid ${border}60`}}
            className={` w-[100%] flex flex-col gap-3 bg-white p-4 rounded-md `}
          >
            <p className="text-xs font-medium">{t(`User`)} {t(`Action`)}</p>
            <div className="grid w-[100%] grid-cols-2 md:grid-cols-1 gap-3">
              <AddBalance userData={userData} getData={getUserData} title="user"/>
            <SubtractBalance userData={userData} getData={getUserData} title="user"/>
            <SendMail userData={userData}/>
            <AddBonus userData={userData}/>
            {Object.keys(userData).length>0&&<SendNotification userData={userData}/>}
            </div>
          </div>

          {/* third box */}


          <div
          style={{border:`1px solid ${border}60`}}
            
            className={` w-[100%] bg-white p-4 rounded-md`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-2 mt-2">
              <div
                className={`flex justify-between cursor-pointer items-center gap-3 p-[6px] text-xs rounded-2xl`}
              >
                <p className='font-semibold'>{t(`Bet`)} {t(`Suported`)}</p>
                <Switch
                  colorScheme="green"
                  name="bet_supported"
                  isChecked={userData?.bet_supported == true ? true : false}
                  onChange={() => handleStatusChange("bet_supported")}
                />
              </div>

              <div
                className={`flex justify-between cursor-pointer items-center gap-3 p-[6px] text-xs rounded-2xl`}
              >
                <p className='font-semibold'>{t(`Status`)}</p>
                <Switch
                  colorScheme="green"
                  name="status"
                  isChecked={userData?.status == true ? true : false}
                  onChange={() => handleStatusChange("status")}
                />
              </div>

              <div
                className={`flex justify-between cursor-pointer items-center gap-3 p-[6px] text-xs rounded-2xl`}
              >
                <p className='font-semibold'>{t(`Block`)} {t(`A/C`)}</p>
                <Switch
                  colorScheme="green"
                  name="is_blocked"
                  isChecked={userData?.is_blocked == true ? true : false}
                  defaultValue={"checked"}
                  onChange={() => handleStatusChange("is_blocked")}
                />
              </div>

              <div
                className={`flex justify-between cursor-pointer items-center gap-3 p-[6px] text-xs rounded-2xl`}
              >
                <p className='font-semibold'>{t(`Email Verification`)}</p>
                <Switch
                  name="email_verified"
                  colorScheme="green"
                  defaultChecked={userData?.email_verified==true?true:false}
                  onChange={() => handleStatusChange("email_verified")}
                />
              </div>

              <div
                className={`flex justify-between cursor-pointer items-center gap-3 p-[6px] text-xs rounded-2xl`}
              >
                <p className='font-semibold'>{t(`SMS Verification`)}</p>
                <Switch
                  name="sms_verified"
                  colorScheme="green"
                  isChecked={userData?.sms_verified == true ? true : false}
                  onChange={() => handleStatusChange("sms_verified")}
                />
              </div>

              <div
                className={`flex justify-between cursor-pointer items-center gap-3 p-[6px] text-xs rounded-2xl`}
              >
                <p className='font-semibold'>{t(`KYC Verification`)}</p>
                <Switch
                  name="kyc_verified"
                  colorScheme="green"
                  isChecked={userData?.kyc_verified == true ? true : false}
                  onChange={() => handleStatusChange("kyc_verified")}
                />
              </div>
            </div>
          </div>


        </div>
      </div>
      <div className="w-[100%]   md:w-[90%] mx-auto">
        <div 
        style={{border:`1px solid ${border}60`}}
        className={`w-[100%] flex  flex-wrap lg:flex-nowrap bg-[white] rounded-md   justify-between items-center p-1 md:p-3   `}>
          <div className="flex w-[150px] lg:w-[100%] flex-col items-start gap-1">
            <div className='flex justify-center items-center gap-2'>
            <div>
            {userData?.username&&<Avatar name={userData?.username||""} size={"md"} style={{ backgroundColor: getColorFromUsername(userData?.username), color:"black" }} />}
            </div>
            <div className="flex flex-col">
              <p className=" text-xs  md:text-lg font-semibold">
              {userData?.username}
              </p>
            </div>
            </div>
            <p 
            style={{backgroundColor:bg}}
            className={`px-2 text-xs py-[2px] mt-1 rounded-[5px] text-center text-white`}>{t(userData?.role_type=="user"?"Player":"user")}</p>
          </div>
          <div className="flex w-[160px] lg:w-[100%] justify-center items-center flex-col gap-1">
          <p
           style={{color:iconColor}}
          className={` text-[12px]  md:text-xl font-semibold `}>{t(`Total`)} {t(`Balance`)} :
           {/* <span className="text-gray-500 text-xs md:text-lg"> &#8377; {userData?.amount.toFixed(2)}</span> */}
           {userData?.amount?.toFixed(2)}
           </p>

            <p className=" text-[10px] md:text-xs font-semibold  ">
              {t(`Profit`)} / {t(`Loss`)} :{" "}
              <span className={`text-xs ${plData?.totalAmount>0?"text-green-400":"text-red-400"} text-green-400 text-[10px] md:text-xs`}>
                {" "}
               {plData?.totalAmount?.toFixed(2)}
              </span>
            </p>
            <p className='text-sm font-bold mt-1'>{t(`Currency`)}: <Badge colorScheme='green' style={{fontSize:'10px'}} className='font-bold rounded-sm px-2'>{userData?.currency}</Badge>

            </p>
          </div>
          

          <div className="flex  w-[100%] flex-col justify-between items-center gap-2">
            <button className=" flex items-center gap-1 p-1 md:p-[6px]  px-4 text-xs text-white font-semibold bg-[#01B574] rounded-md">
              {t(`Onilne`)}
            </button>

            <div className="flex flex-col items-center justify-center font-medium text-[10px]">
            <p>{formatDateTime(userData?.joined_at).split(" ")[0]}</p>
            </div>
          </div>
        </div>
        {active === 1 && userData && <Profile type={"user"} userData={userData} />}
         {active === 2 && <Deposit id={userData?.user_id} />}
        {active === 3 && <WithDrawl id={userData?.user_id} />}
        {active === 4 && <Transaction id={userData?.user_id} />}
        {active === 5 && <Wallet id={userData?.username}/>}
        {active === 6 && <Referral />}

        {active === 7 && <BetHistory userData={userData} type="user" />} 
        {active === 8 && <UserBonus />} 
        {active===19&&<SingleLoginHistory userData={userData} role="user"/>}
        {active===10&&<KYCDocument userData={userData} role="user"/>}
        {active===11&&<UserNotification userData={userData} role="user"/>}



        

      </div>

        </div>
  )
}

export default SingleUserManage