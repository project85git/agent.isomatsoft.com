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
} from "@chakra-ui/react";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";

import adduser from "../assets/addnewuser.png";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { fetchGetRequest, sendPostRequest } from "../api/api";
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
  country: "",
  exposure_limit: 0,
  // currency:''
};
function AddNewUser({ setAllUserData, allUserData }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhoneNumber] = useState();
  const { t, i18n } = useTranslation();

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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [valid, setValid] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [value, setValue] = useState("");
  const [filteredCurrency, setFilteredCurrency] = useState([]);
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
  const adminLayer = user.adminLayer;
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '30px', // Set the desired height
    }),
  };
  
  const CreateUser = async (e) => {
    e.preventDefault();
    if (formData?.password !== formData?.confirm_password) {
      toast({
        description: "Both password are not same",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      return;
    } else if (userExist) {
      toast({
        description: "User name should be unique",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });

      return;
    } else if (valid) {
      toast({
        description: "Not a valid user name",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });

      return;
    }
    const currencyLabel = currencyOptions.filter(
      (ele) => ele.value == adminData.currency
    );
    const payload = {
      password: formData?.password,
      role_type: "user",
      username: formData?.username,
      amount: formData?.amount,
      parent_admin_id: adminData?.admin_id,
      email: formData?.email,
      exposure_limit: formData?.exposure_limit,
      country: formData.country,
      phone: formData?.phone,
      currency_label:filteredCurrency[0]?.label,
      currency:formData?.currency||filteredCurrency[0]?.value
    };

    const url = `${import.meta.env.VITE_API_URL}/api/admin/create-admin-user`;
    try {
      setLoading(true);
      let response = await sendPostRequest(url, payload);
      toast({
        description: response.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
      setAllUserData((prev) => [response.data, ...prev]);
      // SecondaryCreateUser()
      // onClose();
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

  const SecondaryCreateUser = async () => {
  if (userExist) {
      toast({
        description: "User name should be unique",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });

      return;
    } else if (valid) {
      toast({
        description: "Not a valid user name",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });

      return;
    }
    const payload = {
      userCode: formData?.username,
      currency:formData?.currency
    };

    const url = `${import.meta.env.VITE_API_URL}/api/secondary-game/create-user`;
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
      // setAllUserData((prev) => [response.data, ...prev]);
      onClose();
      setFormData(initialState);
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
  }

  const CheckUsernameExistence = async () => {
    const paylaod = {
      username: formData.username,
      type: "user",
    };
    let url = `${import.meta.env.VITE_API_URL}/api/admin/exist-or-not`;
    try {
      let response = await sendPostRequest(url, paylaod);

      setUserExist(response?.data?.exists || response?.exists);
    } catch (error) {
      setUserExist(error?.data?.exists || error?.exists);
      // toast({
      //   description: `${error?.data?.message}`,

      //   status: "error",
      //   duration: 4000,
      //   position: "top",
      //   isClosable: true,
      // });
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
      timer = setTimeout(validateUsername, 700);
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

  useEffect(() => {
    const flag= adminData.role_type !== import.meta.env.VITE_ROLE_SUPER 
    const filteredCurrency = flag
      ? currencyOptions.filter((item) => item.value === adminData.currency) 
      : currencyOptions;
    
    setFilteredCurrency(filteredCurrency);
    setFormData((prevFormData) => ({
      ...prevFormData,
      currency:flag?adminData.currency: ""
    }));
  }, [adminData]);
  console.log(filteredCurrency[0])
  return (
    <>
      <div
        onClick={onOpen}
        // className="flex items-end bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ... p-[2px]   rounded-[6px] justify-end"
      >
        <button
          style={{ backgroundColor: bg }}
          className={`flex items-center p-2 gap-2 rounded-[6px] text-xs md:text-sm text-white font-bold `}
        >
          <IoIosPersonAdd fontSize="20px" />
          {t(`Add`)} {t(`New`)} {t(`User`)}
        </button>
      </div>
      <Modal size={["full", "lg"]} isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent maxW={["95%", "90%", "2xl"]} mx="auto" p={[2, 4, 6]}>
    <ModalCloseButton />
    <ModalBody>
      <div className="flex flex-col items-center justify-center mt-4">
        <div className="flex items-center flex-col mb-6">
          <img className="w-12 md:w-16" src={adduser} alt="Add User" />
          <p className="text-sm md:text-base font-semibold mt-2">
            {t(`Add`)} {t(`New`)} {t(`User`)}
          </p>
        </div>
        <div className="w-full">
          <form onSubmit={CreateUser}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="col-span-1 md:col-span-2">
                <label
                  className="block mb-1 font-semibold text-sm"
                  htmlFor="username"
                >
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
                    {t(`User name must be contains alphabet amd numeric value eg. xyz123`)}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block mb-1 text-sm font-semibold"
                  htmlFor="email"
                >
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
                <label
                  className="block mb-1 text-sm font-semibold"
                  htmlFor="phone"
                >
                  {t(`Phone`)}:
                </label>
                <PhoneInput
                  placeholder="Enter phone number"
                  style={{ border: `1px solid #e5e7eb` }}
                  value={phone}
                  className="w-full p-2 text-sm rounded-md outline-none"
                  onChange={setPhoneNumber}
                />
              </div>

              <div>
                <label
                  className="block mb-1 text-sm font-semibold"
                  htmlFor="country"
                >
                  {t(`Country`)}:
                </label>
                <Select
                  options={options}
                  value={value}
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '36px',
                      height: '36px',
                      border: '1px solid #e5e7eb',
                      fontSize: '0.875rem',
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      padding: '0 8px',
                    }),
                    input: (base) => ({
                      ...base,
                      margin: '0',
                      padding: '0',
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      height: '36px',
                    }),
                  }}
                  onChange={changeHandler}
                />
              </div>

              <div>
                <label
                  className="block mb-1 text-sm font-semibold"
                  htmlFor="exposure_limit"
                >
                  {t(`Exposure Limit`)}:
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
                  type="number"
                  id="exposure_limit"
                  name="exposure_limit"
                  value={formData.exposure_limit || 0}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>

              <div>
                <label
                  className="block mb-1 text-sm font-semibold"
                  htmlFor="password"
                >
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
                <label
                  className="block mb-1 text-sm font-semibold"
                  htmlFor="confirm_password"
                >
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
                <label
                  className="block mb-1 text-sm font-semibold"
                  htmlFor="deposit_amount"
                >
                  {t(`Deposit`)} {t(`Amount`)}:
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none text-sm"
                  type="number"
                  id="deposit_amount"
                  name="amount"
                  value={formData?.deposit_amount?.toFixed(2)}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label
                  className="block mb-1 text-sm font-semibold"
                  htmlFor="currency"
                >
                  {t(`Currency`)}:
                </label>
                <select
                  value={
                    filteredCurrency.length === 1
                      ? filteredCurrency[0]?.value
                      : formData?.currency
                  }
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
                      <option
                        key={option.currency}
                        value={option.value || option.currency}
                      >
                        {option.label}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={onClose}
                className="w-full bg-gray-300 font-semibold py-2 rounded-md hover:bg-gray-400 transition-colors"
                type="button"
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
        </div>
      </div>
    </ModalBody>
  </ModalContent>
     </Modal>
    </>
  );
}

export default AddNewUser;
