import React, { useEffect, useState } from "react";
import { AiFillHome, AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { VscGraph } from "react-icons/vsc";
import { BiMoneyWithdraw, BiSolidWalletAlt } from "react-icons/bi";

import {
  SiAuthelia,
} from "react-icons/si";
import {
  MdCasino,
  MdLiveTv,
} from "react-icons/md";
import { PiBankFill } from "react-icons/pi";

import { SiMapbox } from "react-icons/si";
import {
  RiExpandLeftFill,
} from "react-icons/ri";
import {
  FaChartBar,
  FaChartLine,
  FaCog,
  FaCogs,
  FaCreditCard,
  FaDollarSign,
  FaEnvelope,
  FaExchangeAlt,
  FaFileAlt,
  FaFileInvoiceDollar,
  FaGamepad,
  FaGift,
  FaGlobe,
  FaHandHoldingUsd,
  FaHandshake,
  FaHistory,
  FaImage,
  FaInfoCircle,
  FaKey,
  FaLayerGroup,
  FaLockOpen,
  FaMoneyBillWave,
  FaMoneyCheckAlt,
  FaRegCreditCard,
  FaSearch,
  FaSearchPlus,
  FaShareAlt,
  FaStar,
  FaTag,
  FaThemeco,
  FaTicketAlt,
  FaUserAlt,
  FaUserCheck,
  FaUserCog,
  FaUserShield,
  FaUserTie,
  FaUserTimes,
  FaVimeo,
  FaWallet,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa6";
import { MdSportsEsports } from "react-icons/md";
import { GiCardJackHearts, GiCardKingClubs } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { RiSecurePaymentLine } from "react-icons/ri";
import { FaPiggyBank } from "react-icons/fa";
import { MdHdrAuto } from "react-icons/md";
import { IoLogoXbox, IoSettings, IoShareSocial } from "react-icons/io5";
import {
  BsBank2,
  BsFillBagCheckFill,
  BsFillCalendar2DateFill,
  BsWallet2,
  BsWalletFill,
} from "react-icons/bs";
import { GoBlocked } from "react-icons/go";
import { IoMdSwap } from "react-icons/io";
import { TbReport } from "react-icons/tb";
import { setSidebarVisibility } from "../redux/action";
import { useTranslation } from "react-i18next";
import { HiMiniWallet, HiWallet } from "react-icons/hi2";

export const Sidebar = () => {
  const [active, setActive] = useState(1);
  const [active1, setActive1] = useState(1);
  const navigate = useNavigate();
  const { color, bg, hoverColor, hover, text, font, secondaryBg,  border, iconColor } =
    useSelector((state) => state.theme);
  const sidebarVisible = useSelector((state) => state.theme.sidebarVisible);
  const sidebarVisibleAlways = useSelector(
    (state) => state.theme.sidebarVisibleAlways
  );
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const [hoveredId, setHoveredId] = useState(1);
      const [title, setTitle] = useState("");
  const permissionDetails = user?.user?.permissions;
  const hasPermission = (name) => {
    const permission = permissionDetails?.find(
      (permission) => permission.name === name
    );
    return permission ? permission.value : false;
  };
  const [secondSidebarData, setSecondSidebarData] = useState([
    // {
    //   id: 15,
    //   title: "User Manage",
    //   icon1: <FaUsers fontSize={"20px"} />,
    //   route: "/usermanage",
    // },
    // {
    //   id: 16,
    //   title: "Admin Manage",
    //   icon1: <FaUserCheck fontSize={"20px"} />,
    //   route: "/adminmanage",
    // },
    // {
    //   id: 17,
    //   title: "Sport Manage",
    //   icon1: <MdSportsEsports fontSize={"20px"} />,
    //   route: "/sportmanage",
    // },
    // {
    //   id: 170,
    //   title: "Casino Manage",
    //   icon1: <GiCardKingClubs fontSize={"20px"} />,
    //   route: "/casinomanage",
    // },
    // // {
    // //   id: 171,
    // //   title: "Secondary Casino Manage",
    // //   icon1: <GiCardKingClubs fontSize={"20px"} />,
    // //   route: "/secondary-provider-information",
    // // },
  ]);

  // Filter sidebarData based on permissions

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
          id: 40,
          title: "Affiliate Manage",
          icon1: <FaHandshake fontSize={"20px"} />,
          route: "/affiliate-manage",
          name: "ticketView",
        },
        {
          id: 174,
          title: "Tickets",
          icon1: <FaTicketAlt fontSize={"20px"} />, // Replaced with a ticket-related icon
          route: "/tickets",
          name: "ticketView",
        },
        {
          id: 39,
          title: "Theme Manage",
          icon1: <FaThemeco fontSize={"20px"} />,
          route: "/theme-manage",
          name: "messageCredentialView",
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
          icon1: <FaEnvelope fontSize={"20px"} />,  // Classic email envelope icon
          route: "/auth-credential",
          name: "authCredentialView",
        },
        {
          id: 415,
          title: "Message Credentials",
          icon1: <FaKey fontSize={"20px"} />,  // Key icon for credentials
          route: "/message-credential",
          name: "messageCredentialView",
        },
        {
          id: 416,
          title: "Permission Setting",
          icon1: <FaUserShield fontSize={"20px"} />,  // Shield icon for user permissions
          route: "/permission-setting",
          name: "permissionSettingView",
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
  
  const handleActive = (id, route, subtitle, title) => {
    setActive(id);
    if (id !== 1) {
      dispatch(setSidebarVisibility(true));
    }
    if (id === 1 || id === 1900) {
      setActive1(1);
      dispatch(setSidebarVisibility(false));
    }
    navigate(route);
    setSecondSidebarData(subtitle);
    setTitle(title);
  };
  const handleActive1 = (id, route) => {
    setActive1(id);
    navigate(route);
    if (sidebarVisibleAlways === true) {
      dispatch(setSidebarVisibility(true));
    } else {
      dispatch(setSidebarVisibility(false));
    }
  };
 
  const handleToggleSidebar = (value) => {
    if (active !== 1) {
      dispatch(setSidebarVisibility(value))(1);
    }
  };

  const handleRedirectHome = () =>{
    setHoveredId(1)
    navigate("/")
    setActive(1)
    dispatch(setSidebarVisibility(false))
  }
  return (
    <div className="flex min-h-[100vh] ">
      <div
        style={{ backgroundColor: bg, border: border }}
        className={` p-0 
      duration-500 ease-in-out w-[100px] 
           text-white  `}
      >
        <div className=" w-[100%]">
      <div className="flex items-center justify-center p-4">
        {sidebarVisible ? (
          <AiOutlineMenuUnfold
            cursor="pointer"
            fontSize="30px"
            onClick={() => handleToggleSidebar(false)}
            className="transform transition-transform duration-300 hover:scale-110"
            title="Close Sidebar"
          />
        ) : (
          <AiOutlineMenuFold
            cursor="pointer"
            onClick={() => handleToggleSidebar(true)}
            fontSize="30px"
            className="transform rotate-180 transition-transform duration-300 hover:scale-110"
            title="Open Sidebar"
          />
        )}
      </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="90%"
            height="1"
            viewBox="0 0 234 1"
            fill="none"
          >
            <path d="M0 0.5H233.25" stroke="url(#paint0_linear_2_23558)" />
            <defs>
              <linearGradient
                id="paint0_linear_2_23558"
                x1="0"
                y1="0.5"
                x2="231"
                y2="0.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#E0E1E2" stop-opacity="0" />
                <stop offset="0.5" stop-color="#E0E1E2" />
                <stop offset="1" stop-color="#E0E1E2" stop-opacity="0.15625" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className={`overflow-scroll  h-[90vh] pb-[15px]`}>
          <div className={`flex flex-col mt-6 gap-8  p-2`}>
            <div
            style={{
              backgroundColor:
                hoveredId === 1
                  ? hoverColor
                  :1 === active
                  ? hover
                  : "",
              // Add other styles as needed
            }}
              onClick={handleRedirectHome}
              className={`flex flex-col cursor-pointer   rounded-lg  duration-500 ease-in-out  items-center gap-1 p-[6px] text-xs `}
            >
              <span className={`rounded-[40%] p-[6px] `}>
                {" "}
                <AiFillHome fontSize={"25px"} />
              </span>
              <p className="font-medium  text-[12px] text-center ">
                {t("Dashboard")}
              </p>
            </div>
            {finalSidebarData?.map((item) => {
              return (
                <div
                  style={{
                    backgroundColor:
                      hoveredId === item.id
                        ? hoverColor
                        : item.id === active
                        ? hover
                        : "",
                    // Add other styles as needed
                  }}
                  key={item.id}
                  onClick={() =>
                    handleActive(item.id, item.route, item.subTitle, item.title)
                  }
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`flex flex-col cursor-pointer   rounded-lg  duration-500 ease-in-out  items-center gap-1 p-[6px] text-xs `}
                >
                  <span className={`rounded-[40%] p-[6px] `}>{item.icon}</span>
                  <p className="font-medium  text-[12px] text-center ">
                    {t(item.title)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {secondSidebarData && sidebarVisible && (
        <div
          className={`min-h-[100vh] mt-[80px] bg-white  duration-500 ease-in-out w-[250px]    `}
        >
          <div className=" w-[100%]">
            <div className="flex p-2 pt-6 w-[100%]  justify-start items-start">
              <p
                style={{ color: iconColor }}
                className="text-sm   pl-2 font-bold "
              >
                {t(title)}
              </p>
              <div className={` `}>
                {!sidebarVisible && (
                  <RiExpandLeftFill
                    cursor="pointer"
                    onClick={() => dispatch(setSidebarVisibility(false))}
                    fontSize={"25px"}
                  />
                )}
              </div>
            </div>
          </div>
          <div className={`overflow-scroll  h-[80vh] pb-[15px]`}>
          <div className="flex flex-col items-start justify-start gap-4 px-4 mt-4">
        {secondSidebarData.map((item) => (
          <div
            key={item.id}
            onClick={() => handleActive1(item.id, item.route)}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              backgroundColor:
                hoveredId === item.id
                  ? hoverColor // light hover color (can adjust)
                  : item.id === active1
                  ? bg // active state color
                  : 'transparent', // no background by default
              color:
                hoveredId === item.id || item.id === active1
                  ? 'white'
                  : 'rgba(55, 65, 81, 1)', // light grey text (default)
            }}
            className={`relative flex items-center gap-4 px-4 py-3 rounded-lg w-full cursor-pointer group transition-all duration-300 ease-in-out
              ${item.id === active1 ? 'bg-indigo-600 text-white scale-105 shadow-lg' : ''}
              hover:scale-105 hover:bg-indigo-700 hover:text-white hover:shadow-md`}
          >
            {/* Icon */}
            <span className="transition-all transform group-hover:scale-110 group-hover:rotate-3">
              {item.icon1}
            </span>

            {/* Text */}
            <p className="transition-all font-semibold text-sm group-hover:text-white">{t(item.title)}</p>

            {/* Animated underline for hover (you can remove this if not needed) */}
            <span
              style={{backgroundColor:bg}}
              className={`absolute bottom-0 left-0 w-0 h-[2px]  transition-all duration-300 group-hover:w-full`}
            ></span>
          </div>
        ))}
        </div>
          </div>
        </div>
      )}
    </div>
  );
};
