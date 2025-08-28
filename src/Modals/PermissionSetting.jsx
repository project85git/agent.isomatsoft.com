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
  FormControl,
  FormLabel,
  Switch,
  Tooltip,
} from "@chakra-ui/react";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";

import adduser from "../assets/addnewuser.png";
import { useCallback, useEffect, useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { RiFolderSettingsFill, RiFolderSettingsLine, RiLockPasswordFill } from "react-icons/ri";
import changePassword from "../assets/changePassword.png";
import { useSelector } from "react-redux";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { fetchGetRequest, sendPatchRequest } from "../api/api";
import { useTranslation } from "react-i18next";
import { checkPermission } from "../../utils/utils";

function updateArr2BasedOnArr1(arr1, arr2) {
  const updatedArr2 = arr1
    .map((item2) => {
      const correspondingItem1 = arr2?.find(
        (item1) => item1.name === item2.name
      );
      if (correspondingItem1 && correspondingItem1.value) {
        return { ...item2, value: true };
      } else return { ...item2, value: false };
    })
    .sort((a, b) => b.value - a.value);

  return updatedArr2;
}

function PermissionSetting({ adminid, singledata, permissionsData }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { primaryBg, iconColor, bg, border } = useSelector(
    (state) => state.theme
  );
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [singleLoading, setSingleLoading] = useState(false);
  const [allPermission, setAllPermission] = useState([]);
  const [switchStates, setSwitchStates] = useState({});
  const [groupPermissionData, setGroupPermissionData] = useState({});
  const [lowerGroupPermissionData, setLowerGroupPermissionData] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");

  const [allLowerPermission, setAllLowerPermission] = useState(
    permissionsData || []
  );

  const { t, i18n } = useTranslation();

  const getSinglePermission = async () => {
    setSingleLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/permission/get-single-permission?role_type=${singledata?.role_type}`;

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      setSingleLoading(false);
      const check = updateArr2BasedOnArr1(response?.data, allLowerPermission);
      setAllPermission(check);
      const initialSwitchStates = {};
      check?.forEach((switchItem) => {
        initialSwitchStates[switchItem.name] = switchItem.value;
      });
      setSwitchStates(initialSwitchStates);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setSingleLoading(false);
    }
  };
  const user = useSelector((state) => state.authReducer);

  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;
  const permissionDetails = user?.user?.permissions;
  let hasPermission = checkPermission(permissionDetails, "permissionManage");
  let check = !isOwnerAdmin ? hasPermission : true;

  useEffect(() => {
    getSinglePermission();
  }, []);
  // Initialize switch states based on permissions data
  useEffect(() => {
    const initialSwitchStates = {};
    if(allPermission){
    allPermission?.forEach((switchItem) => {
      initialSwitchStates[switchItem.name] = switchItem.value;
    });
    setSwitchStates(initialSwitchStates);
  }
  }, [allPermission]);

  const toggleSwitch = (name, data) => {
    setSwitchStates((prevSwitchStates) => ({
      ...prevSwitchStates,
      [name]: !prevSwitchStates[name],
    }));

    if (!switchStates[name]) {
      setAllLowerPermission((prev) => [...prev, { ...data, value: true }]);
    } else if (switchStates[name]) {
      setAllLowerPermission((prev) =>
        prev.filter((ele) => ele.name !== data.name)
      );
    }
  };
  const handleUpdate = async () => {
    setLoading(true);
    const payload = allLowerPermission;
    const finalpayload = {
      ...singledata,
      permissions: payload,
    };
    
    try {
      let url = `${
        import.meta.env.VITE_API_URL
      }/api/admin/update-single-admin/${adminid}`;
      let response = await sendPatchRequest(url, finalpayload);
      const data = response.data;

      toast({
        description: response?.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      getSinglePermission();
      setLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  function getGroupName(permissionName) {
    const lowerCaseName = permissionName.toLowerCase();

    if (lowerCaseName.includes("user")) return "User Management";
    if (lowerCaseName.includes("admin")) return "Admin Management";
    if (lowerCaseName.includes("sport")) return "Sports Management";
    if (lowerCaseName.includes("deposit")) return "Deposit Management";
    if (lowerCaseName.includes("withdraw")) return "Withdrawal Management";
    if (lowerCaseName.includes("transaction")) return "Transaction Management";
    if (lowerCaseName.includes("bet")) return "Bet Management";
    if (lowerCaseName.endsWith("reportview")) return "Reports Management";
    if (lowerCaseName.includes("generateamount")) return "Amount Management";
    if (lowerCaseName.includes("bonus")) return "Bonus Management";
    if (
      lowerCaseName.includes("socialmedia") ||
      lowerCaseName.includes("logobanner") ||
      lowerCaseName.includes("footercontent") ||
      lowerCaseName.includes("seo") ||
      lowerCaseName.includes("layermanage")
    )
      return "Content Management";
    if (lowerCaseName.includes("site")) return "Site Management";
    if (lowerCaseName.includes("provider")) return "Provider Management";
    if (lowerCaseName.includes("game") || lowerCaseName.includes("clonegame"))
      return "Game Management";
    if (lowerCaseName.includes("permission")) return "Permission Management";
    if (lowerCaseName.includes("supportticket")) return "Support Management";
    if (lowerCaseName.includes("cloneprovider"))
      return "Clone Provider Management";

    return "Other";
  }

  const convertToGroup = (permissions) => {
    const groupedPermissions = {};
    permissions.forEach((permission) => {
      if (!groupedPermissions[getGroupName(permission.name)]) {
        groupedPermissions[getGroupName(permission.name)] = [];
      }
      groupedPermissions[getGroupName(permission.name)].push(permission);
    });
    return groupedPermissions;
  };
  useEffect(() => {
    if(allPermission){
    const groupedPermissions = convertToGroup(allPermission);
    setGroupPermissionData(groupedPermissions);
    }
  }, [allPermission]);

  useEffect(() => {
    const groupedPermissions = convertToGroup(allLowerPermission);
    setLowerGroupPermissionData(groupedPermissions);
  }, [allLowerPermission]);

  return (
    <>
      <Tooltip label={"Permission"} bg={bg} aria-label={`Permission`} hasArrow>         
      <button
        onClick={onOpen}
        style={{ border: `1px solid ${border}60`, backgroundColor: primaryBg }}
        className={`w-[25px] flex items-center border  justify-center rounded-[6px] h-[25px]`}
      >
        <RiFolderSettingsLine
          onClick={onOpen}
          fontSize={"20px"}
          cursor={"pointer"}
          color={iconColor}
        />
      </button>
      </Tooltip>
      <Modal size={["full", "6xl", "6xl"]} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div className=" flex flex-col items-center justify-center mt-5">
              <div className="flex items-center flex-col">
                <img className="w-[60px]" src={changePassword} alt="" />
                <p className="text-lg mt-4 font-bold">
                  {t(`Permission`)} {t(`access`)}
                </p>
                <p className="text-sm font-medium">
                  {t(`Give the Permission to the Admin`)}
                </p>
              </div>
              <div className="flex gap-5 mt-8 flex-col sm:flex-row w-[100%] items-center justify-between">
                <div
                  style={{ border: `1px solid ${border}60` }}
                  className="flex w-[100%]  p-2 rounded-lg  flex-col gap-4"
                >
                  <p
                    style={{ color: iconColor }}
                    className="text-center border-b pb-2  w-[100%] font-semibold"
                  >
                    {t(`Your`)} {t(`Permissions`)}
                  </p>
                  <div className="h-[400px] flex flex-col gap-2 overflow-scroll">


                  {Object.entries(groupPermissionData).map(
                      ([groupName, permissions]) => (
                        <div key={groupName} className="mb-1">
                          <p style={{color:bg}} className="font-bold text-xl ">
                            {groupName?.toUpperCase()}
                          </p>
                          <div className="grid grid-cols-1">
                            {permissions.map((permission, index) => (
                              <FormControl
                                key={permission.name}
                                className="flex justify-between items-center"
                              >
                                <FormLabel className="text-sm">
                                  {t(permission?.name)}
                                </FormLabel>
                               {check&&<Switch
                                  size={"sm"}
                                  onChange={() => toggleSwitch(permission.name, permission)}
                                  isChecked={switchStates[permission.name]}
                                />}
                              </FormControl>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                   </div>
                </div>
                <div
                  style={{ border: `1px solid ${border}60` }}
                  className="flex  w-[100%] border p-2 rounded-lg  flex-col gap-4"
                >
                  <p
                    style={{ color: iconColor }}
                    className="text-center border-b pb-2 w-[100%] font-semibold"
                  >
                    {singledata?.username} {t(`Permissions`)}
                  </p>
                  <div className="h-[400px] flex flex-col gap-2 overflow-scroll">
                    {Object.entries(lowerGroupPermissionData).map(
                      ([groupName, permissions]) => (
                        <div key={groupName} className="mb-1">
                          <p style={{color:bg}} className="font-bold text-xl ">
                            {groupName?.toUpperCase()}
                          </p>
                          <div className="grid grid-cols-1">
                            {permissions.map((permission, index) => (
                              <FormControl
                                key={permission.name}
                                className="flex justify-between items-center"
                              >
                                <FormLabel className="text-sm">
                                  {t(permission?.name)}
                                </FormLabel>
                                <Switch
                                  size={"sm"}
                                  isChecked={switchStates[permission.name]}
                                  readOnly
                                />
                              </FormControl>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

             {check&& <div className="flex w-[100%] my-5 mt-6 gap-5 justify-between">
                <button
                  onClick={handleUpdate}
                  style={{ backgroundColor: bg }}
                  className={` w-[100%] text-white px-4 font-semibold py-[6px] rounded-md`}
                  type="submit"
                >
                  {loading ? (
                    <LoadingSpinner color="white" size="sm" thickness={"2px"} />
                  ) : (
                    `${t(`Update`)}`
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-300 font-semibold  w-[100%] py-[6px] rounded-md mr-2"
                  type="button"
                >
                  {t(`Cancel`)}
                </button>
              </div>}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PermissionSetting;
