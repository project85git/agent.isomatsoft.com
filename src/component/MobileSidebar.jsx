import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { RiBarChartFill, RiFileUserFill, RiMenu2Fill, RiSecurePaymentLine, RiSettings5Fill, RiUserSettingsFill, RiVipLine } from 'react-icons/ri';
import { AiFillHome } from 'react-icons/ai';
import { VscGraph } from 'react-icons/vsc';
import { FaUsers, FaUserCheck, FaPiggyBank, FaUser, FaUserTie, FaInfoCircle, FaHistory, FaGlobe, FaSearchPlus, FaFileAlt, FaTag, FaLayerGroup, FaShareAlt, FaStar, FaHandHoldingUsd, FaCog, FaGift, FaRegCreditCard, FaLockOpen, FaChartBar, FaFileInvoiceDollar, FaDollarSign, FaGamepad, FaUserAlt, FaChartLine, FaRegPlayCircle, FaExchangeAlt, FaMoneyCheckAlt, FaMoneyBillWave, FaWallet, FaUserShield, FaCogs, FaCreditCard, FaEnvelope, FaTicketAlt } from 'react-icons/fa';
import { MdCasino, MdHdrAuto, MdLiveTv, MdOutlineCalendarMonth, MdOutlineSportsCricket, MdReport, MdSportsEsports } from 'react-icons/md';
import { GiCardJackHearts, GiCardKingClubs } from 'react-icons/gi';
import { RiLuggageDepositFill } from 'react-icons/ri';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { PiBankFill, PiCubeTransparentFill, PiShoppingBagFill } from 'react-icons/pi';
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoLogoXbox, IoSettings, IoShareSocial } from 'react-icons/io5';
import { BsBank2, BsFillBagCheckFill, BsFillCalendar2DateFill } from 'react-icons/bs';
import { SiAuthelia, SiCoinmarketcap, SiGoogletagmanager, SiMapbox } from 'react-icons/si';
import { GoBlocked } from 'react-icons/go';
import { IoMdSwap } from 'react-icons/io';
import { TbReport } from 'react-icons/tb';
import { fetchGetRequest } from '../api/api';
import { useTranslation } from 'react-i18next';
import { HiMiniWallet } from 'react-icons/hi2';
import Timer from './timer/Timer';
function MobileSidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hoveredId,setHoveredId]=useState(null)
  const [active, setActive] = useState(1);
const [websiteDetails,setWebsiteDetails]=useState({})
const user = useSelector((state) => state.authReducer);
const adminData = user.user || {};
  const btnRef = React.useRef();
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

  const adminPermission = adminData?.permissions||[];
  const { siteDetails } = useSelector((state) => state.websiteReducer);
  let filteredSite = siteDetails.filter((item) => item.selected === true);
  const navigate=useNavigate()
  const hasPermission = (name) => {
    const permission = permissionDetails?.find(permission => permission.name === name);
    return permission ? permission.value : false;
  };

  // Filter sidebarData based on permissions
  const permissionDetails=user?.user?.permissions
  const sidebarData = [
    {
      id: 2,
      title: "Manage",
      icon: <FaCog fontSize={"25px"} />,
      icon1: <FaCog fontSize={"20px"} color="gray" />,
      subTitle: [
        {
          id: 15,
          title: "Users",
          icon1: <FaUsers fontSize={"20px"} />,
          route: "/usermanage",
          name: "userView",
        },
        {
          id: 16,
          title: "Admins",
          icon1: <FaUserShield fontSize={"20px"} />,
          route: "/adminmanage",
          name: "adminView",
        },
        {
          id: 170,
          title: "Casinos",
          icon1: <MdCasino fontSize={"20px"} />,
          route: "/casinomanage",
          name: "providerView",
        },
        {
          id: 171,
          title: "All Users",
          icon1: <FaUsers fontSize={"20px"} />,
          route: "/all-user",
          name: "allUserView",
        },
        {
          id: 172,
          title: "All Admins",
          icon1: <FaUserShield fontSize={"20px"} />,
          route: "/all-admin",
          name: "allAdminView",
        },
        {
          id: 173,
          title: "Messages",
          icon1: <FaEnvelope fontSize={"20px"} />, // Replaced with a message-related icon
          route: "/messages",
          name: "messageView",
        },
        {
          id: 174,
          title: "Tickets",
          icon1: <FaTicketAlt fontSize={"20px"} />, // Replaced with a ticket-related icon
          route: "/tickets",
          name: "ticketView",
        },
      ],
    },
    {
      id: 3,
      title: "User Bank",
      icon: <FaWallet fontSize={"25px"} />,
      icon1: <FaWallet fontSize={"20px"} />,
      subTitle: [
        {
          id: 189,
          title: "Deposits",
          icon1: <FaMoneyBillWave fontSize={"20px"} />,
          route: "/user-deposit",
          name: "userDepositView",
        },
        {
          id: 2090,
          title: "Withdrawals",
          icon1: <FaMoneyCheckAlt fontSize={"20px"} />,
          route: "/user-withdrawal",
          name: "userWithdrawView",
        },
        {
          id: 2100,
          title: "Transactions",
          icon1: <FaExchangeAlt fontSize={"20px"} />,
          route: "/user-transaction",
          name: "userTransactionView",
        },
      ],
    },
    {
      id: 7,
      title: "Admin Bank",
      icon: <HiMiniWallet fontSize={"25px"} />,
      icon1: <HiMiniWallet fontSize={"20px"} />,
      subTitle: [
        {
          id: 19,
          title: "Upline Deposits",
          icon1: <FaMoneyBillWave fontSize={"20px"} />,
          route: "/admin-upline-deposit",
          name: "uplineDepositView",
        },
        {
          id: 190,
          title: "Downline Deposits",
          icon1: <FaMoneyBillWave fontSize={"20px"} />,
          route: "/admin-downline-deposit",
          name: "downlineDepositView",
        },
        {
          id: 20,
          title: "Upline Withdraws",
          icon1: <FaMoneyCheckAlt fontSize={"20px"} />,
          route: "/admin-upline-withdrawal",
          name: "uplineWithdrawView",
        },
        {
          id: 209,
          title: "Downline Withdrawals",
          icon1: <FaMoneyCheckAlt fontSize={"20px"} />,
          route: "/admin-downline-withdrawal",
          name: "downlineWithdrawView",
        },
        {
          id: 21,
          title: "Admin Transactions",
          icon1: <FaExchangeAlt fontSize={"20px"} />,
          route: "/admin-transaction",
          name: "adminTransactionView",
        },
      ],
    },
    {
      id: 4,
      title: "Bet Manage",
      icon: <FaHandHoldingUsd fontSize={"25px"} />,
      icon1: <FaHandHoldingUsd fontSize={"20px"} />,
      subTitle: [
        {
          id: 23,
          title: "Bet History",
          icon1: <FaHistory fontSize={"20px"} />,
          route: "/bet-history",
          name: "betHistoryView",
        },
        {
          id: 25,
          title: "Live Bets",
          icon1: <MdLiveTv fontSize={"20px"} />,
          route: "/live-report",
          name: "liveBetView",
        },
      ],
    },
    {
      id: 5,
      title: "Reports",
      icon: <FaChartLine fontSize={"25px"} />,
      icon1: <FaChartLine fontSize={"20px"} color="gray" />,
      subTitle: [
        {
          id: 27,
          title: "Player Reports",
          icon1: <FaUserAlt fontSize={"20px"} />,
          route: "player-wise-report",
          name: "playerReportView",
        },
        {
          id: 28,
          title: "Game Reports",
          icon1: <FaGamepad fontSize={"20px"} />,
          route: "game-wise-report",
          name: "gameReportView",
        },
        {
          id: 29,
          title: "GGR Reports",
          icon1: <FaDollarSign fontSize={"20px"} />,
          route: "/ggr-wise-report",
          name: "ggrReportView",
        },
        {
          id: 33,
          title: "Generate Reports",
          icon1: <FaFileInvoiceDollar fontSize={"20px"} />,
          route: "/generate-amount-report",
          name: "generateAmountView",
        },
        {
          id: 30,
          title: "All Statistics",
          icon1: <FaChartBar fontSize={"20px"} />,
          route: "/all-statistics",
          name: "allStatisticsOverviewView",
        },
      ],
    },
    {
      id: 101,
      title: "Payment Gateways",
      icon: <FaLockOpen fontSize={"25px"} />,
      icon1: <FaLockOpen fontSize={"20px"} />,
      subTitle: [
        {
          id: 201,
          title: "Manual Deposit",
          icon1: <FaPiggyBank fontSize={"20px"} />,
          route: "/manual-deposit-getway",
          name: "manualDepositView",
        },
        
        {
          id: 203,
          title: "Manual Withdrawal",
          icon1: <PiBankFill fontSize={"20px"} />,
          route: "/manual-withdrawal-getway",
          name: "manualWithdrawView",
        },
        {
          id: 202,
          title: "Auto Payment",
          icon1: <FaRegCreditCard fontSize={"20px"} />,
          route: "/auto-deposit-getway",
          name: "autoDepositView",
        },
        // {
        //   id: 204,
        //   title: "Auto Withdrawal Gateway",
        //   icon1: <FaRegCreditCard fontSize={"20px"} />,
        //   route: "/auto-withdrawal-getway",
        //   name: "autoWithdrawView",
        // },
      ],
    },
    {
      id: 1002,
      title: "Bonus",
      icon: <FaGift fontSize={"25px"} />,
      icon1: <FaGift fontSize={"20px"} color="gray" />,
      subTitle: [
        {
          id: 405,
          title: "Bonus History",
          icon1: <FaHistory fontSize={"20px"} />,
          route: "/bonus-history",
          name: "bonusHistoryView",
        },
        {
          id: 406,
          title: "Manage Bonus",
          icon1: <FaCog fontSize={"20px"} />,
          route: "/bonus-manage",
          name: "bonusManage",
        },
        {
          id: 4006,
          title: "Refer & Earn",
          icon1: <FaHandHoldingUsd fontSize={"20px"} />,
          route: "/refer-earn",
          name: "referAndEarnView",
        },
        {
          id: 4007,
          title: "VIP Levels",
          icon1: <FaStar fontSize={"20px"} />,
          route: "/vip-level",
          name: "allStatisticsOverviewView",
        },
      ],
    },
    {
      id: 102,
      title: "Settings",
      icon: <FaCogs fontSize={"25px"} />,
      icon1: <FaCogs fontSize={"20px"} color="gray" />,
      subTitle: [
        {
          id: 402,
          title: "Social Media",
          icon1: <FaShareAlt fontSize={"20px"} />,
          route: "/social-setting",
          name: "socialMediaView",
        },
        {
          id: 403,
          title: "Owner Layer & Logo ",
          icon1: <FaLayerGroup fontSize={"20px"} />,
          route: "/admin-layer-logo-signup",
          name: "isOwnerAdmin",
        },
        {
          id: 406,
          title: "Logo & Banner",
          icon1: <FaTag fontSize={"20px"} />,
          route: "/logo-banner",
          name: "logoBannerView",
        },
        {
          id: 407,
          title: "Footer Content",
          icon1: <FaFileAlt fontSize={"20px"} />,
          route: "/footer-data",
          name: "footerContentView",
        },
        {
          id: 408,
          title: "SEO",
          icon1: <FaSearchPlus fontSize={"20px"} />,
          route: "/seo-manage",
          name: "seoView",
        },
        {
          id: 409,
          title: "Site Settings",
          icon1: <FaGlobe fontSize={"20px"} />,
          route: "/site-manage",
          name: "siteView",
        },
        {
          id: 410,
          title: "Admin Login History",
          icon1: <FaHistory fontSize={"20px"} />,
          route: "/login-history",
          name: "adminLoginHistoryView",
        },
        {
          id: 412,
          title: "Provider Info",
          icon1: <FaInfoCircle fontSize={"20px"} />,
          route: "/secondary-provider-information",
          name: "providerInformationView",
        },
        {
          id: 413,
          title: "Payment Credentials",
          icon1: <FaCreditCard fontSize={"20px"} />,  // You can also use FaKey if it fits better
          route: "/auto-payment-credential",
          name: "autoPaymentCredentialView",
        },
        {
          id: 414,
          title: "Email Settings",
          icon1: <SiAuthelia fontSize={"20px"} />,  // You can also use FaKey if it fits better
          route: "/auth-credential",
          name: "authCredentialView",
        },
        {
          id: 415,
          title: "Message Credentials",
          icon1: <SiAuthelia fontSize={"20px"} />,  // You can also use FaKey if it fits better
          route: "/message-credential",
          name: "messageCredentialView",
        }
      ],
    }
    
    
  ];
  

  const filteredSidebarData = sidebarData
  .map((item) => {
    if (item.subTitle) {
      const filteredSubTitle = item.subTitle.filter((subItem) =>
        hasPermission(subItem.name)
      );

      // Only return the item if it has at least one permitted subTitle
      if (filteredSubTitle.length > 0) {
        return { ...item, subTitle: filteredSubTitle };
      }

      // If no permitted subTitles, skip this item
      return null;
    }

    // If no subTitle and hasPermission for main item (optional)
    return hasPermission(item.name) ? { ...item } : null;
  })
  .filter(Boolean); // Removes null items
  const finalSidebarData = filteredSidebarData;
  const handleNavigate=(route)=>{
    if(route){
      navigate(route)
      onClose()
    }
  }
  const getSocailData = async () => {
    let url = `${import.meta.env.VITE_API_URL}/api/setting/get-setting/6532c132ed5efb8183a66703`;
    try {
      let response = await fetchGetRequest(url);
      setWebsiteDetails(response.data);
    } catch (error) {
      // toast({
      //   description: `${error?.data?.message}`,
      //   status: "error",
      //   duration: 4000,
      //   position: "top",
      //   isClosable: true,
      // });
    }
  };

  useEffect(()=>{
    getSocailData()
  },[])
  return (
    <>
      <RiMenu2Fill
        ref={btnRef}
        onClick={onOpen}
        color={iconColor}
        fontSize={'30px'}
        className="lg:hidden"
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader style={{color:iconColor}} >
            <div className="">
              <img
                src={websiteDetails?.logo}
                alt=""
                className="w-[160px]  cursor-pointer h-[30px] object-fill"
              />
            </div>
            <div className="mt-4">
              <Timer/>
              </div>
            </DrawerHeader>

          <DrawerBody>
            <div
            style={{borderBottom:`1px solid ${border}60`}}
            className={`flex items-center space-x-2 p-2 mb-6 `}>
              <div>
                <p  
                style={{color:iconColor}}
                className={`text-sm font-semibold  `}>{adminData?.username}</p>
                <p className="text-xs text-gray-500">{t(filteredSite[0]?.site_name)}</p>
              </div>
            </div>
            <div>
            <Accordion >
                <AccordionItem className='border-none mt-5'>
                  <h2>
                    <AccordionButton className={`w-[100%] border-none flex justify-between  `}>
                      <div onClick={()=>{
                        navigate('/')
                        onClose()
                        }} className="flex items-center space-x-2 px-4">
                        <span style={{color:iconColor}}  ><AiFillHome  fontSize={"25px"}/></span>
                        <p className="text-[16px]">{t('Dashboard')}</p>
                      </div>
                     </AccordionButton>
                  </h2>
                 
                </AccordionItem>
              </Accordion>
            </div>
            {finalSidebarData?.map((item) => (
              <Accordion key={item.id} allowToggle>
                <AccordionItem className='border-none mt-5'>
                  <h2>
                    <AccordionButton className={`w-[100%] border-none flex justify-between  `}>
                      <div onClick={()=>handleNavigate(item.route)} className="flex items-center space-x-2 px-4">
                        <span style={{color:iconColor}}  >{item.icon1}</span>
                        <p className="text-[16px]">{t(item.title)}</p>
                      </div>
                    {item?.subTitle?.length>0&&  <AccordionIcon />}
                    </AccordionButton>
                  </h2>
                  {item?.subTitle?.length>0&&<AccordionPanel>
                    {item.subTitle &&
                      item.subTitle.map((subItem) => (
                        <div onClick={()=>handleNavigate(subItem.route)}
                        onMouseEnter={() => setHoveredId(subItem.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{
                          backgroundColor: hoveredId === subItem.id ? hoverColor : "white",
                          color: hoveredId === subItem.id ? "white" : (subItem.id === active ? "white" : bg)
    
                          // Add other styles as needed
                        }}
                        key={subItem.id} className={`p-2  rounded-md font-semibold`}>
                          <div  className="flex items-center space-x-2 px-4">
                            <span  >{subItem.icon1}</span>
                            <p className="text-[15px]">{t(subItem.title)}</p>
                          </div>
                        </div>
                      ))}
                  </AccordionPanel>}
                </AccordionItem>
              </Accordion>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default MobileSidebar;