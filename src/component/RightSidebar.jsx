import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  Button,
  Radio,
  RadioGroup,
  Switch,
  useToast,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  StatDownArrow,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarAlwaysOpen, updateTheme } from "../redux/action";
import { SketchPicker } from "react-color";
import { setSidebarVisibility } from "../redux/action";
import { useTranslation } from "react-i18next";
import { fetchGetRequest, sendPatchRequest } from "../api/api";
import { Navigate, useNavigate } from "react-router-dom";
import { detailsOfSite } from "../redux/switch-web/action";
import { checkPermission } from "../../utils/utils";
function RightSidebar({globalLoad,setGlbalLoading}) {
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
  const sidebarVisibleAlways = useSelector(
    (state) => state.theme.sidebarVisibleAlways
  );
  const sidebarVisible = useSelector((state) => state.theme.sidebarVisible);
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const [active, setActive] = useState(1);
  const [activeWebsite, setActiveWebsite] = useState(1);
  const [loading, setLoading] = useState();
  const [siteDetails, setSiteDetails] = useState([]);
  const toast = useToast();
  const naviagte = useNavigate();
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const getAdminDetails = JSON.parse(localStorage.getItem("adminauth"));
  if (!getAdminDetails || !getAdminDetails?.token) {
    return <Navigate to="/login" />;
  }
  // const [adminData,setProfileData]=useState(adminData)
  const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;
  const permissionDetails=user?.user?.permissions

let hasPermission=checkPermission(permissionDetails,"siteSwitchView")
  let check=!isOwnerAdmin?hasPermission:true

  let hasPermission1=checkPermission(permissionDetails,"siteSwitchManage")
  let check1=!isOwnerAdmin?hasPermission:true
  const lightenColor = (color, percent) => {
    color = color.replace(/^#/, "");

    let num = parseInt(color, 16);

    let amt = Math.round(2.55 * percent);

    let R = (num >> 16) + amt;
    let B = ((num >> 8) & 0x00ff) + amt;
    let G = (num & 0x0000ff) + amt;

    R = R > 255 ? 255 : R < 0 ? 0 : R;
    B = B > 255 ? 255 : B < 0 ? 0 : B;
    G = G > 255 ? 255 : G < 0 ? 0 : G;

    return "#" + ((1 << 24) | (R << 16) | (B << 8) | G).toString(16).slice(1);
  };

  const [primaryColor, setPrimaryColor] = useState("#6b7280");

  const handlePrimaryChange = (newColor) => {
    setPrimaryColor(newColor.hex);

    const payload = {
      color: newColor.hex,
      bg: newColor.hex,
      hoverColor: lightenColor(newColor.hex, 15),
      hover: lightenColor(newColor.hex, 15),
      border: newColor.hex,
      iconColor: newColor.hex,
      primaryBg: "#fff",
      secondaryBg: "#E9ECEF",
    };
    localStorage.setItem("saveTheme", JSON.stringify(payload));

    dispatch(updateTheme(payload));
  };

  const getSiteDetails = async () => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/site-switch/get-all-site-record`;

    try {
      let response = await fetchGetRequest(url);
      setSiteDetails(response?.data);
      dispatch(detailsOfSite(response?.data))
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const handleWebsite = async (id) => {
    setActiveWebsite(id);
    setGlbalLoading(true)
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/site-switch/toggle-selected/${id}`;
    onClose()
    try {
      let response = await sendPatchRequest(url);
      getSiteDetails();
      setTimeout(()=>{    
      window.location.reload()
          },5000)
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }finally{
      setTimeout(()=>{    
        setGlbalLoading(false)
      },4000)
    }
  };

  useEffect(() => {
    getSiteDetails();
  }, []);

  // useEffect(()=>{
  //   
  //     },[toagleLoading])

  const handleToggleSidebar = useCallback(() => {
    dispatch(setSidebarAlwaysOpen(!sidebarVisibleAlways));
    dispatch(setSidebarVisibility(!sidebarVisible));
  }, [sidebarVisibleAlways, sidebarVisible]);

  return (
    <>
      {/* <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ... p-[1px]   rounded-[4px] lg:rounded-[6px]"> */}

      <div
        ref={btnRef}
        onClick={onOpen}
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          border: `1px solid ${border}60`,
        }}
        className={`p-2 border  cursor-pointer  rounded-[4px] lg:rounded-[6px] `}
      >
        <IoMdSettings
          cursor="pointer"
          fontSize="20px"
          color={iconColor}
          className=" duration-500 ease-in-out"
        />
      </div>
      {/* </div> */}

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader className="flex justify-between items-center">{t(`Setting`)}
          <RxCross2
            onClick={onClose}
            className="cursor-pointer"
            style={{ fontSize: "24px" }}
          />
          </DrawerHeader>
          <DrawerBody>
            <div className="">
            <div
              className="flex flex-col items-start justify-start mt-3 gap-2 p-2 rounded-md"
              style={{ backgroundColor: "#F9FAFB", border: "1px solid #E2E8F0" }} // Light background with border
            >
            <p
              style={{ color: iconColor }}
              className="font-medium text-xxs text-gray-800"
            >
              Pick Theme Color:
            </p>
            <div className="w-full flex justify-center items-center">
              <SketchPicker
                color={primaryColor || ""}
                className="mt-1 rounded-md shadow-sm"
                onChange={handlePrimaryChange}
              />
            </div>
            <p className="font-medium text-xxs text-gray-600 mt-1">
              Color Code:{" "}
              <span className="text-gray-800">{primaryColor}</span>
            </p>
          </div>

              {/* <div>
        <p className="font-bold">Secondary Color:</p>
        <SketchPicker color={secondaryColor} onChange={handleSecondaryChange} />
        <p className="font-bold">Secondary Color Code: {secondaryColor}</p>
      </div> */}
            </div>
            {check&&adminData?.role_type===import.meta.env.VITE_ROLE_SUPER && (
              <div className="mt-8">
                <p
                  style={{ color: iconColor }}
                  className={`font-bold ${iconColor} mt-5`}
                >
                  {t(`Select`)} {t(`Website`)}
                </p>
                <Menu>
      <MenuButton as={Button} rightIcon={<StatDownArrow bgSize={"sm"} color={bg}/>} className="w-full text-left border rounded-md p-2">
        Select Site
      </MenuButton>
      <MenuList className=" max-h-60 overflow-y-auto border rounded-md">
        {siteDetails.map((site) => (
          <MenuItem
            key={site._id}
            onClick={() => handleWebsite(site._id)}
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all duration-200 
              ${site.selected ? "font-semibold" : ""} hover:bg-gray-100`}
          >
            <Tooltip label={site.site_name} hasArrow>
              <span className="truncate w-full text-sm">{site.site_name}</span>
            </Tooltip>
            <Radio isChecked={!!site.selected} />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
              </div>
            )}
             <div
                className="flex  items-center justify-between mt-5 gap-2 p-3 rounded-lg"
                style={{ backgroundColor: secondaryBg }} // Custom background color
              >
              <p style={{ color: iconColor }} className="font-bold text-md">
                {t(`Sidebar`)} 2
              </p>  
              <Switch
                colorScheme="teal"
                size="md"
                isChecked={sidebarVisible}
                onChange={handleToggleSidebar}
              />
            </div>
          </DrawerBody>

          
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default RightSidebar;
