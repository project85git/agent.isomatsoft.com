import React, { useEffect, useState } from "react";
import NotificationModal from "./NotificationModal";
import Timer from "../component/timer/Timer";
import userLogo from "../assets/user-logo.png";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  useToast,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminChangePassword from "./AdminChangePassword";
import AddAdminBalance from "../Modals/AddAdminBalance";
import {
  removeFromLocalStorage,
} from "../redux/middleware/localstorageconfig";
import { useTranslation } from "react-i18next";
import { fetchGetRequest } from "../api/api";
import userlogo from "../assets/user-logo.png";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { checkPermission } from "../../utils/utils";
const TopNavbar = () => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const {
    color,
    primaryBg,
    secondaryBg,
    iconColor,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);
  const naviagte = useNavigate();
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const goBack = () => {
    navigate(-1); // Navigate back one step in history
  };
  const handleChange = (e) => {
    const lang = e.target.value;
    localStorage.setItem("adminDashLanguage", lang);

    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
  };
  const [websiteDetails, setWebsiteDetails] = useState({});
  const [hoveredId, setHoveredId] = useState(false);
  const toast = useToast();
  const [globalLoad, setGlbalLoading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;

  const permissionDetails = user?.user?.permissions;

  let hasPermission = checkPermission(
    permissionDetails,
    "generateAmountManage"
  );
  let check = !isOwnerAdmin ? hasPermission : true;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Adjust the scroll limit to your desired value
      const scrollLimit = 5;

      // Hide the navbar if the scroll position exceeds the limit
      setIsNavbarVisible(scrollPosition < scrollLimit);
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    navigate("/login");
    removeFromLocalStorage("adminData")
    removeFromLocalStorage("adminauth");
    toast({
      title: "Logout Successfully",
      status: "success",
      duration: 2000,
      position: "top",
      isClosable: true,
    });
  };
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };
  const [adminLoading, setAdminLoading] = useState();
  const [admin, setAdmin] = useState({});
  const { siteDetails } = useSelector((state) => state.websiteReducer);
  let filteredSite = siteDetails.filter((item) => item.selected === true);
  const getAdmin = async () => {
    setAdminLoading(true);
    try {
      const response = await fetchGetRequest(
        `${import.meta.env.VITE_API_URL}/api/admin/get-single-admin/${
          adminData.admin_id
        }`
      );
      setAdminLoading(false);
      setAdmin(response.data);
    } catch (error) {
    }
    setAdminLoading(false);
  };
  const getSocailData = async () => {
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/setting/get-setting/6532c132ed5efb8183a66703`;
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

  const handleRedirect = () => {
    navigate(`/`);
  };

  
  useEffect(() => {
    getSocailData();
  }, []);

  return (
    <>

    <div
      className={`flex gap-3 md:gap-5   ${
        !isNavbarVisible ? "shadow-md" : ""
      } h-[60px] lg:h-[80px]   px-1 lg:px-5 justify-between w-[100%] items-center`}
    >
      <div className="flex items-center justify-between  md:gap-3   lg:w-[100%]  ">
        <div className="lg:contents hidden">
          <div className="flex md:gap-4  items-center">
            <div onClick={goBack} className="   cursor-pointer">
              <FaCircleArrowLeft
                style={{ color: iconColor }}
                fontSize={"20px"}
              />
            </div>
            <div className="">
              <img
                onClick={handleRedirect}
                src={websiteDetails?.logo}
                alt=""
                className="w-[150px]  cursor-pointer h-[46px] object-fill"
              />
            </div>
          </div>
        </div>
        {filteredSite[0]?.site_name&&(
          <div
            style={{ color: bg }}
            className="rounded-md py-1 text-nowrap font-bold hidden sm:contents   text-[12px] sm:text-[18px] lg:text-[30px]  fade-in"
          >
            {filteredSite[0]?.site_name}
          </div>
        )}
      </div>
      <div className="w-[100%]  flex justify-between lg:justify-end items-center gap-2 md:gap-4">
        <div className="hidden lg:flex">
          <Timer />
        </div>

        <select
          // onChange={handleChange}
          value={selectedLanguage}
          onChange={handleChange}
          style={{ border: `1px solid ${border}60` }}
          className="sm:ml-5 text-xs md:px-5  py-[6px] outline-none p-1 sm:mr-8 rounded-[4px]"
        >
          <option value="en">🇺🇸 English</option>
          <option value="de">🇩🇪 German</option>
          <option value="fr">🇫🇷 French</option>
          <option value="tr">🇹🇷 Turkish</option>
          <option value="pt">🇵🇹 Portuguese</option>
          <option value="tn">🇹🇳 Tunisian</option>
          <option value="ru">🇷🇺 Russian</option>
        </select>
        <NotificationModal />
        <Popover>
          <PopoverTrigger>
            <div
              style={{ border: `1px solid ${border}60` }}
              className={` rounded-[50%]`}
            >
              <img
                className={` w-[40px] h-[40px] lg:w-[40px] lg:h-[40px] cursor-pointer rounded-full`}
                src={adminData?.profile_picture || userlogo}
                alt=""
              />
            </div>
          </PopoverTrigger>
          <PopoverContent
            style={{
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            }}
            className=" "
          >
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>
              <div className="flex items-center p-3 gap-4">
                <img
                  className="w-[40px] h-[40px] cursor-pointer rounded-full"
                  src={adminData?.profile_picture || userLogo}
                  alt=""
                />
                <div>
                  <p style={{ color: iconColor }} className={`font-bold `}>
                    {adminData?.username}
                  </p>
                  <p className="font-medium text-xs ">{adminData?.email}</p>
                </div>
              </div>
            </PopoverHeader>
            <PopoverBody>
              <div className="p-3 flex flex-col ">
                <p
                  onClick={() => naviagte("/my-profile")}
                  onMouseEnter={() => setHoveredId(true)}
                  onMouseLeave={() => setHoveredId(false)}
                  style={{
                    backgroundColor: hoveredId ? hoverColor : "",
                    // Add other styles as needed
                  }}
                  className={`w-[100%] cursor-pointer duration-500  ease-in-out  hover:text-white rounded-lg p-3  text-sm font-semibold`}
                >
                  {t(`My`)} {t(`Profile`)}
                </p>
                {check && <AddAdminBalance code="1" getAdmin={getAdmin} />}
                <AdminChangePassword code="1" />
              </div>
            </PopoverBody>
            <PopoverFooter>
              <div className="p-3 pl-6 flex flex-col gap-4">
                <p
                  style={{ color: iconColor }}
                  onClick={handleLogout}
                  className={` text-sm cursor-pointer hover:underline duration-500 ease-in-out font-semibold`}
                >
                  {t(`Sign`)} {t(`Out`)}{" "}
                </p>
              </div>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </div>
    </div>
    {globalLoad && (
  <div
    style={{ backgroundColor: "rgba(255, 255, 255, 0.90)" }}
    className="fixed inset-0 flex flex-col items-center justify-center opacity-100 z-50"
  >
    <div className="w-[100%] flex items-center justify-center mb-4">
      <svg className="pl" width="240" height="240" viewBox="0 0 240 240">
        <circle
          className="pl__ring pl__ring--a"
          cx="120"
          cy="120"
          r="105"
          fill="none"
          stroke="#000"
          strokeWidth="20"
          strokeDasharray="0 660"
          strokeDashoffset="-330"
          strokeLinecap="round"
        ></circle>
        <circle
          className="pl__ring pl__ring--b"
          cx="120"
          cy="120"
          r="35"
          fill="none"
          stroke="#000"
          strokeWidth="20"
          strokeDasharray="0 220"
          strokeDashoffset="-110"
          strokeLinecap="round"
        ></circle>
        <circle
          className="pl__ring pl__ring--c"
          cx="85"
          cy="120"
          r="70"
          fill="none"
          stroke="#000"
          strokeWidth="20"
          strokeDasharray="0 440"
          strokeLinecap="round"
        ></circle>
        <circle
          className="pl__ring pl__ring--d"
          cx="155"
          cy="120"
          r="70"
          fill="none"
          stroke="#000"
          strokeWidth="20"
          strokeDasharray="0 440"
          strokeLinecap="round"
        ></circle>
      </svg>
    </div>
    <p style={{color}} className="text-lg font-bold text-center">
      Loading your experience...
    </p>
    <p style={{color:color}} className="text-center mt-2">
      Please wait while we prepare everything for you.
    </p>
  </div>
)}

    </>
  );
};

export default TopNavbar;
