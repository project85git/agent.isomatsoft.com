import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiLuggageDepositFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { Avatar, Switch, useEditable, useToast } from "@chakra-ui/react";
import logo from "../assets/user-logo.png";
import AdminChangePassword from "../component/AdminChangePassword";
import AddAdminBalance from "../Modals/AddAdminBalance";
import { fetchGetRequest, sendPatchRequest, sendPostRequest } from "../api/api";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { updateAdminSuccess } from "../redux/auth-redux/actions";
import { useTranslation } from "react-i18next";
import { checkPermission } from "../../utils/utils";
import AdminRequestDeposit from "../Modals/AdminRequestDeposit";
import AdminRequestWithdraw from "../Modals/AdminRequestWithdraw";

const MyProfile = () => {
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

  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const [is2faEnabled, setIs2faEnabled] = useState(adminData.is_2fa_enabled);
  // const [adminData,setProfileData]=useState(adminData)
  const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;
  const permissionDetails = user?.user?.permissions;

  let hasPermission = checkPermission(
    permissionDetails,
    "generateAmountManage"
  );
  let check = !isOwnerAdmin ? hasPermission : true;
  let adminCheck= isOwnerAdmin? true : false;
  const dispatch = useDispatch();
  const toast = useToast();
  const [formData, setFormData] = useState({
    email: adminData?.email,
    profile_picture: adminData?.profile_picture,
    phone: adminData?.phone,
    country: adminData?.country,
  });
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [adminSelfPldata, setSelfAdminPlData] = useState({});
  const [adminPlLoading, setAdminPlLoading] = useState(false);
  const { t, i18n } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleImageUpload = async (file) => {
    setImageLoading(true);
    const formData = new FormData();
    formData.append("post_img", file);
    try {
      const response = await sendPostRequest(
        `${import.meta.env.VITE_API_URL}/api/payment/image-url`,
        formData
      );
      if (response.url) {
        toast({
          title: "Image uploaded successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setFormData({ ...formData, profile_picture: response.url });
      }
      setImageLoading(false);
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({
        title: "Error uploading image",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setImageLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    handleImageUpload(file);
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/admin/update-single-admin-self`;
    try {
      let response = await sendPatchRequest(url, {
        ...formData,
        is_2fa_enabled: is2faEnabled,
      });
      const data = response.data;
      setLoading(false);
      if (response.data) {
        dispatch(updateAdminSuccess(response.data));
      }
      toast({
        description: `Updated Succesfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    } catch (error) {
      toast({
        description: `${error?.response?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };
  const getAdminPlDetails = async () => {
    setAdminPlLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/transaction/get-admin-pl-details-self`;

    try {
      let response = await fetchGetRequest(url);
      setSelfAdminPlData(response);
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

  useEffect(() => {
    getAdminPlDetails();
  }, []);

  return (
    <div className="w-[100%]">
      <div className="w-[100%] flex justify-between pr-2 items-center">
        <p
          style={{ color: iconColor }}
          className={`font-bold mt-8 lg:flex md:flex sm:flex hidden items-center gap-2 rounded-[6px] pl-[6px] text-lg`}
        >
          <CgProfile  style={{ color: iconColor }} fontSize={"30px"} />
          {t(`My`)} {t(`Profile`)}
        </p>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 text-sm gap-2 px-2">
            <AdminRequestDeposit />
            <AdminRequestWithdraw />
            <AdminChangePassword code="2" />
          {check && (
              <AddAdminBalance code="2" />
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-start mt-4 px-2 gap-4">
        <div className="w-[100%] gap-4  lg:w-[30%] grid   lg:grid-cols-1">
          <div
            style={{ border: `1px solid ${border}60` }}
            className={`bg-white  flex flex-col p-4 rounded-lg shadow-md mb-4`}
          >
            <div className="flex items-center gap-3">
              <img
                src={adminData?.profile_picture || logo}
                name="prfile"
                alt=""
                className="w-[100px] "
              />

              <p className="text-[16px] font-bold">{adminData?.role_type}</p>
            </div>
            <div className="flex border-b  items-center justify-between">
              <h2 className="text-lg font-semibold mb-2">{t(`Username`)}</h2>
              <h2 className="text-[15px] font-medium mb-2">
                {adminData?.username}
              </h2>
            </div>
            <div className="flex border-b  items-center justify-between">
              <h2 className="text-lg font-semibold mb-2">{t(`Email`)}</h2>
              <h2 className="text-[15px] font-medium mb-2">
                {adminData?.email}
              </h2>
            </div>
            <div className="flex border-b  items-center justify-between">
              <h2 className="text-lg font-semibold mb-2">{t(`Country`)}</h2>
              <h2 className="text-[15px] font-medium mb-2">
                {adminData?.country}
              </h2>
            </div>
            <div className="flex border-b  items-center justify-between">
              <h2 className="text-lg font-semibold mb-2">
                {t(`Phone`)} {t(`No`)}
              </h2>
              <h2 className="text-[15px] font-medium mb-2">
                {adminData?.phone}
              </h2>
            </div>
            <div className="flex border-b  items-center justify-between">
              <h2 className="text-lg font-semibold mb-2">{t(`Balance`)}</h2>
              <h2 className="text-[15px] font-medium mb-2">
                {adminData?.amount?.toFixed(2)}{" "}
                <span className="text-sm font-bold">{adminData?.currency}</span>
              </h2>
            </div>
            {adminCheck&&
            <div
              className={`flex justify-between cursor-pointer items-center gap-3 pb-2 pt-1 text-xs rounded-2xl`}
            >
              <p className="font-semibold text-[16px]">
                {t(`2FA Authentication`)}
              </p>
              <Switch
                colorScheme="green"
                name="is_2fa_enabled"
                isChecked={is2faEnabled}
                onChange={() => setIs2faEnabled(!is2faEnabled)}
              />
            </div>}
          </div>
          <div className="flex flex-col -mt-2 ">
            <div
              style={{ border: `1px solid ${border}60` }}
              className={`bg-white p-2   rounded-lg shadow-md mb-2`}
            >
              <h2 className="text-lg font-semibold mb-2">
                {t(`Deposit`)} {t(`Amonut`)}
              </h2>
              <p className="text-green-600 font-semibold">
                {adminSelfPldata?.totalDepositAmount?.toFixed(2)}{" "}
                {adminData?.currency}
              </p>
            </div>
            <div
              style={{ border: `1px solid ${border}60` }}
              className={`bg-white  p-2 rounded-lg shadow-md mb-2`}
            >
              <h2 className="text-lg font-semibold mb-2">
                {t(`Withdraw`)} {t(`Amount`)}
              </h2>
              <p className="text-red-600 font-semibold">
                {" "}
                {adminSelfPldata?.totalWithdrawAmount?.toFixed(2)}{" "}
                {adminData?.currency}
              </p>
            </div>
            <div
              style={{ border: `1px solid ${border}60` }}
              className={`bg-white p-2   rounded-lg shadow-md mb-2`}
            >
              <h2 className="text-lg font-semibold mb-2">
                {t(`Profit`)} / {t(`Loss`)}
              </h2>
              <p
                className={`${
                  adminSelfPldata?.totalPL > 0
                    ? "text-green-600 "
                    : "text-red-600 "
                } font-semibold`}
              >
                {" "}
                {adminSelfPldata?.totalPL} {adminData?.currency}
              </p>
            </div>
          </div>
        </div>
        <div className="w-[100%]">
          <div
            style={{ border: `1px solid ${border}60` }}
            className={`bg-white p-4  rounded-lg shadow-md`}
          >
            <h2 className="text-lg font-semibold mb-4">
              {t(`Update`)} {t(`Details`)}
            </h2>
            <div>
              <img
                src={formData?.profile_picture || logo}
                className="w-[110px] rounded-[50%] h-[110px]"
                alt="Selected"
              />

              {imageLoading && (
                <LoadingSpinner
                  size={"sm"}
                  color="orange.400"
                  thickness="2px"
                />
              )}
              <div className="mb-4">
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full"
                />
              </div>
            </div>
            {/* <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="name"
                name="username"
                value={formData.username}
                onChange={handleChange}
      style={{border:`1px solid ${border}60`}}

                className={`mt-1 p-2 outline-none border block w-full rounded-md  shadow-sm`}
              />
            </div> */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t(`Email`)}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly={
                  adminData?.role_type === import.meta.env.VITE_ROLE_SUPER
                    ? false
                    : true
                }
                style={{ border: `1px solid ${border}60` }}
                className={`mt-1 p-2 block w-full border  outline-none rounded-md  shadow-sm`}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t(`Country`)}
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                style={{ border: `1px solid ${border}60` }}
                readOnly={
                  adminData?.role_type === import.meta.env.VITE_ROLE_SUPER
                    ? false
                    : true
                }
                className={`mt-1 p-2 block w-full border  outline-none rounded-md  shadow-sm`}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                {t(`Phone`)} {t(`Number`)}
              </label>
              <input
                type="number"
                id="number"
                name="phone"
                readOnly={
                  adminData?.role_type === import.meta.env.VITE_ROLE_SUPER
                    ? false
                    : true
                }
                value={formData.phone}
                onChange={handleChange}
                style={{ border: `1px solid ${border}60` }}
                className={`mt-1 p-2 block w-full border  outline-none rounded-md  shadow-sm`}
              />
            </div>

            <button
              disabled={loading}
              style={{ backgroundColor: bg }}
              onClick={handleUpdateProfile}
              className={`cursor-pointer ${loading?"cursor-not-allowed":"cursor-pointer"} text-white py-2 px-2 w-[10%] rounded-md `}
            >
              {loading ? (
                <LoadingSpinner size="sm" thickness={"2px"} color="white" />
              ) : (
                `${t(`Update`)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;