"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  Select,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { PiHandWithdrawBold, PiHandDepositBold } from "react-icons/pi";
import { useSelector } from "react-redux";
import { sendPostRequest } from "../../api/api";
import LoadingSpinner from "../loading/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { GrTransaction } from "react-icons/gr";

function BalanceAction({ userData, getData, title, type = "profile" }) {
  const {
    color,
    primaryBg,
    secondaryBg,
    bg,
    iconColor,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);
  const { t } = useTranslation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState("deposit"); // Action type (deposit/withdraw)
  const [responseMessage, setResponseMessage] = useState(""); // For remarks input
  const toast = useToast();
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};

  // Function to handle both deposit and withdraw actions
  const handleBalanceAction = async () => {
    // Check if actionType is selected, if not show an error toast
    if (!actionType) {
      toast({
        description: "Please select a valid action type (Deposit/Withdraw)",
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      return; // Exit the function early
    }
    if (amount <= 0) return;

    setLoading(true);

    let url;
    let userKey;

    // Set URL and userKey based on title and action type
    if (userData.role_type === "user") {
      if (actionType === "withdraw") {
        url = `${import.meta.env.VITE_API_URL}/api/admin/withdraw-amount-user`;
        userKey = "user_id";
      } else if (actionType === "deposit") {
        url = `${import.meta.env.VITE_API_URL}/api/admin/deposit-amount-user`;
        userKey = "user_id";
      } else {
        throw new Error("Invalid action type provided");
      }
    } else {
      if (actionType === "withdraw") {
        url = `${import.meta.env.VITE_API_URL}/api/admin/withdraw-amount`;
        userKey = "admin_id";
      } else if (actionType === "deposit") {
        url = `${import.meta.env.VITE_API_URL}/api/admin/deposit-amount`;
        userKey = "admin_id";
      } else {
        throw new Error("Invalid action type provided");
      }
    }

    // Request data to send to API
    const requestData = {
      username: userData.username,
      admin_response: responseMessage,
      parent_admin_id: adminData.admin_id,
      [userKey]: userData[userKey],
      user_type: userData.role_type,
      currency: userData?.currency,
      // Dynamically set the amount key
      [actionType === "deposit" ? "deposit_amount" : "withdraw_amount"]: amount,
    };

    try {
      const response = await sendPostRequest(url, requestData);
      toast({
        description: `${amount} ${t(actionType)} successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
      setAmount(0);
      setResponseMessage("");
      getData();
      onClose();
    } catch (error) {
      setLoading(false);
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }
  };

  return (
    <>
      {type === "profile" ? (
        <button
          onClick={onOpen}
          style={{ backgroundColor: bg }}
          className={`w-[100%] font-semibold text-white text-xs rounded-[5px] p-[7px]`}
        >
          {t(`${actionType === "deposit" ? "Deposit" : "Withdraw"} Balance`)}
        </button>
      ) : (
        <Tooltip
          label={"Transaction"}
          bg={bg}
          aria-label={`Transaction`}
          hasArrow
        >
          <button
            onClick={onOpen}
            style={{
              border: `1px solid ${border}60`,
              backgroundColor: primaryBg,
            }}
            className={`w-[25px] flex items-center border justify-center rounded-[6px] h-[25px]`}
          >
            <GrTransaction
              fontSize={"20px"}
              cursor={"pointer"}
              color={iconColor}
            />
          </button>
        </Tooltip>
      )}

      <Modal size={["full", "md"]} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent style={{ backgroundColor: "white", color: "black" }}>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col items-center justify-center mt-5">
              <div className="flex items-center flex-col">
                {actionType === "deposit" ? (
                  <PiHandDepositBold
                    style={{ color: iconColor }}
                    fontSize={"40px"}
                  />
                ) : (
                  <PiHandWithdrawBold
                    style={{ color: iconColor }}
                    fontSize={"40px"}
                  />
                )}
                <p className="text-sm mt-4 font-bold">
                  {t(`Please`)} {t(`Enter`)} {t(`Your`)} {t(`Amount`)}
                </p>
              </div>
              <div className="w-[100%] mt-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleBalanceAction();
                  }}
                >
                  <div className="mb-4 flex flex-col gap-4">
                    <label
                      className="block mb-1 font-semibold text-sm"
                      htmlFor="available_balance"
                    >
                      {t(`Available Balance`)}: {userData?.amount?.toFixed(2)}
                    </label>
                    <div>
                      <label
                        className="block mb-1 font-semibold text-sm"
                        htmlFor="amount"
                      >
                        {t(`Enter Amount`)}:
                      </label>
                      <input
                        style={{ border: `1px solid ${border}60` }}
                        className="w-full px-3 py-1 outline-none rounded-md"
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            setAmount(value);
                          }
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block mb-1 font-semibold text-sm"
                        htmlFor="remarks"
                      >
                        {t(`Remarks`)}:
                      </label>
                      <textarea
                        style={{ border: `1px solid ${border}60` }}
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        className="w-full px-3 py-1 outline-none rounded-md"
                      />
                    </div>
                    <div>
                      <label
                        className="block mb-1 font-semibold text-sm"
                        htmlFor="action_type"
                      >
                        {t(`Action Type`)}:
                      </label>
                      <Select
                        value={actionType}
                        onChange={(e) => setActionType(e.target.value)}
                        placeholder={t("Select Action")}
                      >
                        <option value="deposit">{t("Deposit")}</option>
                        <option value="withdraw">{t("Withdraw")}</option>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col my-5 mt-6 gap-5 justify-between">
                    <button
                      disabled={amount <= 0}
                      style={{ backgroundColor: bg }}
                      className={`w-[100%] text-white px-4 font-semibold py-[6px] rounded-md`}
                      type="submit"
                    >
                      {loading ? (
                        <LoadingSpinner
                          color="white"
                          size="sm"
                          thickness={"2px"}
                        />
                      ) : (
                        `${t(
                          actionType === "deposit" ? "Deposit" : "Withdraw"
                        )}`
                      )}
                    </button>
                    <button
                      onClick={onClose}
                      className="bg-gray-300 font-semibold w-[100%] py-[6px] rounded-md mr-2"
                      type="button"
                    >
                      {t(`Cancel`)}
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

export default BalanceAction;
