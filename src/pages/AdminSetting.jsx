import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchGetRequest, sendPatchRequest, sendPostRequest } from "../api/api";
import { AiFillPlusCircle } from "react-icons/ai";
import {
  Button,
  Checkbox,
  Input,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from "@chakra-ui/react";
import {
  IoLogoFacebook,
  IoLogoWhatsapp,
  IoLogoInstagram,
} from "react-icons/io5";
import { HiOutlineLink } from "react-icons/hi";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import img1 from "../assets/admin.jpeg";
import { MdDelete, MdKeyboardArrowUp } from "react-icons/md";
import CreateLink from "../Modals/CreateLink";
import { FaEdit, FaTwitterSquare } from "react-icons/fa";
import GameCategorySetting from "./adminSettingComponent/GameCategorySetting";
import FooterManage from "./adminSettingComponent/FooterManage";
import { useTranslation } from "react-i18next";
import { checkPermission } from "../../utils/utils";
import { BsLinkedin } from "react-icons/bs";
import {
  FaFacebook,
  FaWhatsapp,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaTelegram,
} from "react-icons/fa";
import GameCard from "../component/builder/GameCard";
const AdminSetting = () => {
  const [socialData, setSocialData] = useState({});
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [gameCategory, setGameCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState("");
  const [categoryName, setNewCategoryName] = useState("");
  const { t, i18n } = useTranslation();

  const toast = useToast();
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

  const handleLinkChange = (id, value) => {
    setSocialData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleUpdateCard = (name, value) => {
    setSocialData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const data = [
    {
      id: "facebook",
      title: "Facebook",
      icon: <FaFacebook size={24} color="#1877F2" />,
      link: socialData.facebook,
    },
    {
      id: "whatsapp",
      title: "WhatsApp",
      icon: <FaWhatsapp size={24} color="#25D366" />,
      link: socialData.whatsapp,
    },
    {
      id: "instagram",
      title: "Instagram",
      icon: <FaInstagram size={24} color="#E1306C" />,
      link: socialData.instagram,
    },
    {
      id: "twitter",
      title: "Twitter",
      icon: <FaTwitter size={24} color="#1DA1F2" />,
      link: socialData.twitter,
    },
    {
      id: "linkedin",
      title: "LinkedIn",
      icon: <FaLinkedin size={24} color="#0077B5" />,
      link: socialData.linkedin,
    },
    {
      id: "telegram",
      title: "Telegram",
      icon: <FaTelegram size={24} color="#0088CC" />,
      link: socialData.telegram,
    },
  ];

  const getSocailData = async () => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/setting/get-setting/6532c132ed5efb8183a66703`;
    try {
      let response = await fetchGetRequest(url);
      setSocialData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/setting/update-setting/6532c132ed5efb8183a66703`;
    try {
      let response = await sendPatchRequest(url, socialData);
      setSocialData(response.data);
      toast({
        description: `Updated Successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      getSocailData();
      setUpdateLoading(false);
    } catch (error) {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    getSocailData();
  }, []);

  const user = useSelector((state) => state.authReducer);

  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;

  const permissionDetails = user?.user?.permissions;

  let hasPermission = checkPermission(permissionDetails, "socialMediaManage");
  let check = !isOwnerAdmin ? hasPermission : true;

  let hasPermission1 = checkPermission(permissionDetails, "gameNavigationView");
  let check1 = !isOwnerAdmin ? hasPermission1 : true;

  //

  return (
    <div className="w-[100%] px-2">
      <div className="bg-white shadow-md rounded px-3 lg:px-8  pt-6 pb-8 mb-4 border ">
        <form  className={``}>
          <h2 className="text-lg font-semibold mb-4">
            {t(`Social`)} {t(`Media`)} {t(`Setting`)}
          </h2>
          {data.map((item) => (
            <div key={item.id} className="mb-4">
              <p className="block text-sm font-medium text-gray-700">
                {t(item.title)} {t(`Link`)}
              </p>
              <div className="flex items-center mt-2">
                <span className="mr-2  w-[30px]">{item.icon}</span>
                <input
                  type="text"
                  style={{ border: `1px solid ${border}60` }}
                  value={item.link}
                  onChange={(e) => handleLinkChange(item.id, e.target.value)}
                  className={`shadow appearance-none border rounded sm:w-[70%] md:w-[80%] lg:w-[85%]   py-1 px-3 text-gray-700 leading-tight outline-none`}
                  placeholder={`Enter ${item.title} link`}
                />
              </div>
            </div>
          ))}
        </form>
        <GameCard socialData={socialData} setSocialData={setSocialData} />
        {check && (
          <button
            onClick={handleUpdate}
            style={{ backgroundColor: bg }}
            className={`  text-white font-bold py-2 text-xs px-8 rounded focus:outline-none focus:shadow-outline`}
          >
            {updateLoading ? (
              <LoadingSpinner size="sm" color="white" thickness={"2px"} />
            ) : (
              `${t(`Update`)}`
            )}
          </button>
        )}
      </div>

      {check1 && (
        <>
          <GameCategorySetting />
        </>
      )}
    </div>
  );
};

export default AdminSetting;
