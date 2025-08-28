import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import adduser from "../assets/addnewuser.png";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { fetchGetRequest, sendPostRequest } from "../api/api";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import Select from "react-select";
import countryList from "react-select-country-list";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useTranslation } from "react-i18next";
import { currencyOptions } from "../../utils/utils";

const initialState = {
  username: "",
  phone: "",
  email: "",
  password: "",
  confirm_password: "",
  amount: 0,
  role_type: "",
  country: "",
  exposure_limit: "",
  currency: "",
  min_payout: 0,
  platform_fee: 0,
  max_payout: 0,
  share_percentage: "",
};

function AddNewUserAdmin({ setAllAdminData }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [filteredCurrency, setFilteredCurrency] = useState([]);
  const {
    color,
    primaryBg,
    secondaryBg,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [phone, setPhoneNumber] = useState();
  const [valid, setValid] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [value, setValue] = useState("");
  const [assignedRoles, setAssignedRoles] = useState();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const { selectedWebsite, siteDetails } = useSelector((state) => state.websiteReducer);
  let filteredData = siteDetails?.filter((item) => item?.selected === true);

  const CreateAdmin = async (e) => {
    e.preventDefault();
    if (formData?.password !== formData?.confirm_password) {
      toast({
        description: "Both passwords are not the same",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      return;
    } else if (userExist) {
      toast({
        description: "Username should be unique",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      return;
    } else if (valid) {
      toast({
        description: "Not a valid username",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      return;
    }

    let currencyLabelData = [];
    if (filteredCurrency.length > 1) {
      currencyLabelData = filteredCurrency.filter((ele) => ele.currency === formData.currency);
    } else if (filteredCurrency && filteredCurrency.length === 1) {
      currencyLabelData = filteredCurrency.filter((ele) => ele.currency === adminData.currency);
    }

    const payload = {
      password: formData?.password,
      role_type: formData?.role_type,
      username: formData?.username,
      amount: Number(formData?.amount) || 0,
      parent_admin_id: adminData?.admin_id,
      email: formData?.email,
      exposure_limit: formData?.exposure_limit,
      country: formData.country,
      phone: formData?.phone,
      share_percentage: formData?.share_percentage,
      currency_label: currencyLabelData[0]?.label,
      currency: formData?.currency,
      site_auth_key: filteredData[0]?.site_auth_key||adminData?.site_auth_key,
    };
    if (formData.role_type === "Affiliate") {
      payload.platform_fee = formData?.platform_fee || 0;
      payload.min_payout = formData?.min_payout || 0;
      payload.max_payout = formData?.max_payout || 0;
    }

    const url = `${import.meta.env.VITE_API_URL}/api/admin/create-admin-user`;
    setLoading(true);
    try {
      let response = await sendPostRequest(url, payload);
      toast({
        description: response.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
      setAllAdminData((prev) => [response.data, ...prev]);
      setFormData(initialState);
      onClose();
    } catch (error) {
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      currency: adminData.currency,
    }));
  }, [adminData]);

  const CheckUsernameExistence = async () => {
    const payload = {
      username: formData.username,
      type: "admin",
    };
    let url = `${import.meta.env.VITE_API_URL}/api/admin/exist-or-not`;
    try {
      let response = await sendPostRequest(url, payload);
      setUserExist(response?.data?.exists || response?.exists);
    } catch (error) {
      setUserExist(error?.data?.exists || error?.exists);
    }
  };

  function checkUsername(username) {
    let hasAlpha = false;
    let hasNum = false;

    for (let char of username) {
      if (!isNaN(char)) {
        hasNum = true;
      } else {
        hasAlpha = true;
      }

      if (hasAlpha && hasNum) {
        return true;
      }
    }

    return false;
  }
  useEffect(() => {
    // Define a function to perform username validation
    const validateUsername = () => {
      if (formData.username.length > 3 && checkUsername(formData.username)) {
        setValid(false);
        CheckUsernameExistence();
      } else {
        setValid(true);
      }
    };

    let timer;
    if (formData.username.length > 3) {
      timer = setTimeout(validateUsername, 300);
    } else {
      setValid(false);
    }

    return () => clearTimeout(timer); // Cleanup function to clear the timer
  }, [formData.username]);

  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (value) => {
    setValue(value);
    setFormData((prevFormData) => ({ ...prevFormData, country: value?.label }));
  };
  useEffect(() => {
    changeHandler();
    setFormData((prevFormData) => ({ ...prevFormData, phone: phone }));
  }, [phone]);

  const getCurrencies = async () => {
    setLoading(true);
    try {
      const parentRes = await sendPostRequest(
        `${import.meta.env.VITE_API_URL}/api/currency/get-currencies`
      );
      const parentData = parentRes.data;
      setFilteredCurrency(parentData);
      setLoading(false);
    } catch (error) {
     console.log(error?.message);
      setLoading(false);
    }
  };

  const getAdminLevel = async () => {
    try {
      const response = await fetchGetRequest(
        `${import.meta.env.VITE_API_URL}/api/level/get-admin-level`);
      setAssignedRoles(response.data || []);
    } catch (error) {
     console.log(error?.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getCurrencies(), getAdminLevel()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Common fields for both forms
  const renderCommonFields = () => (
    <>
      <div className="col-span-1 md:col-span-2">
        <label className="block mb-1 font-semibold text-sm" htmlFor="username">
          {t(`Username`)}:
        </label>
        <input
          className={`w-full px-3 py-2 border ${
            valid ? "border-red-500" : "border-gray-300"
          } rounded-md outline-none text-sm`}
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        {userExist ? (
          <p className="text-xs text-red-500 font-semibold mt-1">
            {t(`username already exist`)}
          </p>
        ) : (
          <p className="text-xs text-gray-600 mt-1">
            {t(`User name must contain alphabet and numeric value, e.g., xyz123`)}
          </p>
        )}
      </div>
      <div>
        <label className="block mb-1 text-sm font-semibold" htmlFor="password">
          {t(`Password`)}:
        </label>
        <div className="relative">
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
          >
            {showPassword ? (
              <IoEyeSharp cursor="pointer" fontSize="18px" color="gray" />
            ) : (
              <IoEyeOffSharp cursor="pointer" fontSize="18px" color="gray" />
            )}
          </button>
        </div>
      </div>
      <div>
        <label className="block mb-1 text-sm font-semibold" htmlFor="confirm_password">
          {t(`Confirm Password`)}:
        </label>
        <div className="relative">
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
            type={showConfirmPassword ? "text" : "password"}
            id="confirm_password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            type="button"
          >
            {showConfirmPassword ? (
              <IoEyeSharp cursor="pointer" fontSize="18px" color="gray" />
            ) : (
              <IoEyeOffSharp cursor="pointer" fontSize="18px" color="gray" />
            )}
          </button>
        </div>
      </div>
      <div>
        <label className="block mb-1 text-sm font-semibold" htmlFor="select_layer">
          {t(`Select Layer`)}:
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
          id="select_layer"
          name="role_type"
          value={formData.role_type}
          onChange={handleChange}
          required
        >
          <option>{t(`Select Layer`)}</option>
          {assignedRoles?.map((ele) => (
            <option key={ele?.name} value={ele?.name}>
              {t(ele?.label || ele?.name)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 text-sm font-semibold" htmlFor="share_percentage">
          {t(`Share`)} {t(`%`)}:
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
          type="number"
          id="share_percentage"
          name="share_percentage"
          min={0}
          max={100}
          value={formData?.share_percentage}
          onChange={handleChange}
          required
        />
      </div>
    </>
  );

  // Additional fields for long form
  const renderLongFormFields = () => (
    <>
      <div>
        <label className="block mb-1 text-sm font-semibold" htmlFor="email">
          {t(`Email`)}:
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-semibold" htmlFor="phone">
          {t(`Phone`)}:
        </label>
        <PhoneInput
          placeholder="Enter phone number"
          value={phone}
          className="w-full p-2 text-sm rounded-md border border-gray-300"
          onChange={setPhoneNumber}
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-semibold" htmlFor="country">
          {t(`Country`)}:
        </label>
        <Select
          options={options}
          value={value}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: "36px",
              height: "36px",
              border: "1px solid #e5e7eb",
              fontSize: "0.875rem",
            }),
            valueContainer: (base) => ({
              ...base,
              padding: "0 8px",
            }),
            input: (base) => ({
              ...base,
              margin: "0",
              padding: "0",
            }),
            indicatorsContainer: (base) => ({
              ...base,
              height: "36px",
            }),
          }}
          onChange={changeHandler}
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-semibold" htmlFor="exposure_limit">
          {filteredData[0]?.site_name ? t(`Company Site:`) : "Owner:"}
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm bg-gray-100"
          type="text"
          id="exposure_limit"
          disabled
          name="exposure_limit"
          value={filteredData[0]?.site_name || adminData.username}
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-semibold" htmlFor="deposit_amount">
          {t(`Deposit`)} {t(`Amount`)}:
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
          type="number"
          id="deposit_amount"
          name="amount"
          value={formData?.amount?.toFixed(2)}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-semibold" htmlFor="currency">
          {t(`Select`)} {t(`Currency`)}:
        </label>
        <select
          value={filteredCurrency.length === 1 ? filteredCurrency[0]?.currency : formData?.currency}
          onChange={handleChange}
          disabled={filteredCurrency.length === 1}
          name="currency"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none"
        >
          <option value="">
            {t(`Select`)} {t(`Currency`)}
          </option>
          {filteredCurrency
            .slice()
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((option) => (
              <option key={option.currency} value={option.currency}>
                {option.label}
              </option>
            ))}
        </select>
      </div>
      {formData.role_type === "Affiliate" && (
        <>
          <div>
            <label className="block mb-1 text-sm font-semibold" htmlFor="min_payout">
              {t(`Min Payout`)}:
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
              type="number"
              id="min_payout"
              name="min_payout"
              min={0}
              max={100}
              value={formData.min_payout}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold" htmlFor="max_payout">
              {t(`Max Payout`)}:
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
              type="number"
              id="max_payout"
              name="max_payout"
              min={0}
              max={100}
              value={formData.max_payout}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-1 text-sm font-semibold" htmlFor="platform_fee">
              {t(`Platform Fee`)}:
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
              type="number"
              id="platform_fee"
              name="platform_fee"
              value={formData.platform_fee}
              onChange={handleChange}
              required
            />
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      <div onClick={onOpen} className="flex items-end p-[2px] rounded-[6px] justify-end">
        <button
          style={{ backgroundColor: bg }}
          className={`flex items-center p-2 gap-2 rounded-[6px] text-xs md:text-sm text-white font-bold`}
        >
          {/* <Perso fontSize="20px" /> */}
          {t(`Add`)} {t(`New`)} {t(`Admin`)}
        </button>
      </div>
      <Modal size={["full", "lg"]} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={["95%", "90%", "2xl"]} mx="auto" p={[3, 4, 6]}>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col items-center justify-center mt-2">
              <div className="flex items-center flex-col mb-2">
                <img className="w-12 md:w-12" src={adduser} alt="Add Admin" />
                <p  style={{fontSize:"14px"}} className=" md:text-base font-semibold mt-1">
                  {t(`Add`)} {t(`New`)} {t(`Admin`)}
                </p>
              </div>
              <div className="w-full">
                <Tabs variant="enclosed">
                  <TabList>
                    <Tab  _selected={{
                      color: "white",
                      bg:bg,
                      boxShadow: "md",
                    }}>{t(`Short Form`)}
                 </Tab>
                 <Tab _selected={{
                      color: "white",
                      bg:bg,
                      boxShadow: "md",
                    }}>{t(`Long Form`)}</Tab>
                  </TabList>
                  <TabPanels>
                    {/* Short Form */}
                    <TabPanel px={0}>
                      <form onSubmit={CreateAdmin}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {renderCommonFields()}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                          <button
                            className="w-full bg-gray-300 font-semibold py-2 rounded-md hover:bg-gray-400 transition-colors"
                            type="button"
                            onClick={onClose}
                          >
                            {t(`Cancel`)}
                          </button>
                          <button
                            style={{ backgroundColor: bg }}
                            className="w-full text-white font-semibold py-2 rounded-md hover:opacity-90 transition-opacity"
                            type="submit"
                          >
                            {loading ? (
                              <LoadingSpinner color="white" size="sm" thickness="2px" />
                            ) : (
                              `${t(`Create`)}`
                            )}
                          </button>
                        </div>
                      </form>
                    </TabPanel>
                    {/* Long Form */}
                    <TabPanel px={0}>
                      <form onSubmit={CreateAdmin}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {renderCommonFields()}
                          {renderLongFormFields()}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                          <button
                            className="w-full bg-gray-300 font-semibold py-2 rounded-md hover:bg-gray-400 transition-colors"
                            type="button"
                            onClick={onClose}
                          >
                            {t(`Cancel`)}
                          </button>
                          <button
                            style={{ backgroundColor: bg }}
                            className="w-full text-white font-semibold py-2 rounded-md hover:opacity-90 transition-opacity"
                            type="submit"
                          >
                            {loading ? (
                              <LoadingSpinner color="white" size="sm" thickness="2px" />
                            ) : (
                              `${t(`Create`)}`
                            )}
                          </button>
                        </div>
                      </form>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddNewUserAdmin;