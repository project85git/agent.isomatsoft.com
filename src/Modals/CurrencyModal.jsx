import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  Spinner,
  Checkbox,
  Tooltip,
} from "@chakra-ui/react";
import { FaDollarSign } from "react-icons/fa"; // Currency icon example
import { sendPatchRequest, sendPostRequest } from "../api/api";
import { useSelector } from "react-redux";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { checkPermission } from "../../utils/utils";

function CurrencyModal({ adminId, roleType, username }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [parentCurrencies, setParentCurrencies] = useState([]);
  const [childCurrencies, setChildCurrencies] = useState([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);

  const {
    primaryColor,
    secondaryColor,
    textColor,
    borderColor,
    iconColor,
    primaryBg,
    border,
    bg,
  } = useSelector((state) => state.theme);
  const toast = useToast();
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen) {
      fetchCurrencies();
    }
  }, [isOpen]);

  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const parentRes = await sendPostRequest(
        `${baseUrl}/api/currency/get-currencies`
      );
      const parentData = parentRes.data;
      setParentCurrencies(parentData);

      const childRes = await sendPostRequest(
        `${baseUrl}/api/currency/get-currencies-of-child`,
        { username, role_type: roleType }
      );
      const childData = childRes.data;
      setChildCurrencies(childData);

      setLoading(false);
    } catch (error) {
      console.log(error?.message);
      setLoading(false);
    }
  };

  const handleToggleCurrency = (currency) => {
    setSelectedCurrencies((prev) => {
      const isSelected = prev.some((cur) => cur.currency === currency.currency);
      if (isSelected) {
        return prev.filter((cur) => cur.currency !== currency.currency);
      } else {
        return [...prev, currency];
      }
    });
  };

  const handleUpdateCurrencies = async () => {
    if (!selectedCurrencies.length) {
      return toast({
        description: "No currencies selected to pass to the child.",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }

    setUpdateLoading(true);

    const payload = {
      username: username,
      admin_id: adminId,
      role_type: roleType,
      updated_currency: selectedCurrencies.map((currency) => ({
        currency: currency.currency,
        label: currency.label,
        status: "active",
      })),
    };

    try {
      await sendPatchRequest(
        `${baseUrl}/api/currency/update-multiple-currencies`,
        payload
      );
      toast({
        description: "Currencies updated successfully.",
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setIsOpen(false);
      setUpdateLoading(false);
    } catch (error) {
      toast({
        description: error?.data?.message || "Something went wrong.",
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setUpdateLoading(false);
    }
  };

  const user = useSelector((state) => state.authReducer);


  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;
  const permissionDetails = user?.user?.permissions;
  let hasPermission = checkPermission(permissionDetails, "multipleCurrencyManage");
  let check = !isOwnerAdmin ? hasPermission : true;

  return (
    <>
    <Tooltip label={"Currency"} bg={bg} aria-label={`Currency`} hasArrow>  
      <button
        onClick={() => setIsOpen(true)}
        style={{ border: `1px solid ${border}60`, backgroundColor: primaryBg }}
        className={`w-[25px] flex items-center border  justify-center rounded-[6px] h-[25px]`}
      >
        <FaDollarSign fontSize={"20px"} cursor={"pointer"} color={iconColor} />
      </button>
     </Tooltip>
      <Modal isOpen={isOpen} size={"6xl"} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  height: "70vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spinner size={"lg"} />
              </div>
            ) : (
              <div className="flex gap-6">
                {/* Parent Currencies Section */}
                <div
                  style={{
                    border: `1px solid ${borderColor}`,
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "20px",
                    width: "50%",
                  }}
                >
                  <h3
                    className="font-semibold"
                    style={{
                      marginBottom: "10px",
                      fontSize: "26px",
                      color: bg,
                    }}
                  >
                    Parent
                  </h3>
                  <div
                    style={{ border: `1px solid ${bg}` }}
                    className="grid grid-cols-6 gap-2 border p-3 rounded-md"
                  >
                    {parentCurrencies.map((currency) => (
                      <div
                        key={currency.currency}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "4px",
                          gap: "10px",
                          fontSize: "12px", // Smaller text size
                        }}
                      >
                         {check&& <Checkbox
                          isChecked={selectedCurrencies.some(
                            (cur) => cur.currency === currency.currency
                          )}
                          onChange={() => handleToggleCurrency(currency)}
                          size="lg"
                          sx={{
                            ".chakra-checkbox__control": {
                              bg: "gray.200",
                              borderColor: "gray.500",
                              width: "20px", // Ensure consistent width
                              height: "20px", // Ensure consistent height
                              _checked: {
                                bg: bg,
                                borderColor: bg,
                              },
                            },
                          }}
                        />}
                        <span
                          style={{ flex: "1" }}
                        >{`${currency.currency}`}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Child Currencies Section */}
                <div
                  style={{
                    border: `1px solid ${borderColor}`,
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "10px",
                    width: "50%",
                  }}
                >
                  <h3
                    className="font-semibold"
                    style={{
                      marginBottom: "10px",
                      fontSize: "26px",
                      color: bg,
                    }}
                  >
                    {username} ({roleType})
                  </h3>
                  <div
                    style={{ border: `1px solid ${bg}` }}
                    className="grid grid-cols-6 gap-6 p-2 rounded-md"
                  >
                    {childCurrencies.map((currency) => (
                      <div
                        key={currency.currency}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          fontSize: "12px", // Smaller text size
                        }}
                      >
                       {check&& <Checkbox
                          isChecked={currency.status === "active"}
                          disabled
                          size="lg"
                          sx={{
                            ".chakra-checkbox__control": {
                              bg: "gray.200",
                              borderColor: "gray.500",
                              width: "20px", // Ensure consistent width
                              height: "20px", // Ensure consistent height
                              _checked: {
                                bg: bg,
                                borderColor: bg,
                              },
                            },
                          }}
                        />}
                        <span
                          style={{ flex: "0" }}
                        >{`${currency.currency}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          {check&&<ModalFooter>
            <div className="flex w-[100%] my-5 mt-6 gap-5 justify-between">
              <button
                onClick={handleUpdateCurrencies}
                style={{ backgroundColor: bg }}
                className={` w-[100%] text-white px-4 font-semibold py-[6px] rounded-md`}
                type="submit"
              >
                {updateLoading ? (
                  <LoadingSpinner color="white" size="sm" thickness={"2px"} />
                ) : (
                  `Update`
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 font-semibold  w-[100%] py-[6px] rounded-md mr-2"
                type="button"
              >
                Cancel
              </button>
            </div>
          </ModalFooter>}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CurrencyModal;
