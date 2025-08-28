import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { useState } from "react";
import changePassword from "../../assets/changePassword.png";
import { useSelector } from "react-redux";
import LoadingSpinner from "../loading/LoadingSpinner";
import { sendPatchRequest } from "../../api/api";
import { useTranslation } from "react-i18next";

function PasswordReset({ type = "user", id = "owneradmin", isOpen, onClose }) {
  const { primaryBg, bg, border, iconColor } = useSelector(
    (state) => state.theme
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { t } = useTranslation();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      const payload = {
        password: password,
        [type === "user" ? "user_id" : "admin_id"]: id,
      };

      setLoading(true);

      try {
        let url;
        if (type === "user") {
          url = `${import.meta.env.VITE_API_URL}/api/admin/user-reset-password`;
        } else {
          url = `${import.meta.env.VITE_API_URL}/api/admin/admin-reset-password`;
        }

        const response = await sendPatchRequest(url, payload);

        toast({
          title: response.message,
          status: "success",
          duration: 2000,
          position: "top",
          isClosable: true,
        });

        setPassword("");
        setConfirmPassword("");
        setLoading(false);
        onClose();
      } catch (error) {
        toast({
          title: error?.response?.data?.message || "Something went wrong",
          status: "error",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
        setLoading(false);
      }
    } else {
      toast({
        title: "Both passwords are not the same",
        status: "warning",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
    }
  };

  return (
    <Modal size={["sm", "sm"]} isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col items-center justify-center mt-5">
            <div className="flex items-center flex-col">
              <img className="w-[60px]" src={changePassword} alt="reset" />
              <p className="text-sm mt-4 font-bold">
                {t("Please")} {t("Enter")} {t("Your")} {t("Password")}
              </p>
              
            </div>

            <div className="w-full mt-6">
              <form onSubmit={handleUpdatePassword}>
                <div className="mb-4 flex flex-col gap-4">
                  {/* Password */}
                  <div>
                    <label className="block mb-1 font-semibold text-sm">
                      {t("Password")}:
                    </label>
                    <div className="relative">
                      <input
                        className="w-full px-3 py-1 outline-none border rounded-md"
                        type={showPassword ? "text" : "password"}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 mr-2 mt-1 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <IoEyeSharp fontSize="20px" color="gray" />
                        ) : (
                          <IoEyeOffSharp fontSize="20px" color="gray" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block mb-1 font-semibold text-sm">
                      {t("Confirm Password")}:
                    </label>
                    <div className="relative">
                      <input
                        className="w-full px-3 py-1 outline-none border rounded-md"
                        type={showConfirmPassword ? "text" : "password"}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        required
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 mr-2 mt-1 text-gray-500"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <IoEyeSharp fontSize="20px" color="gray" />
                        ) : (
                          <IoEyeOffSharp fontSize="20px" color="gray" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col my-5 mt-6 gap-5">
                  <button
                    style={{ backgroundColor: bg }}
                    className="w-full text-white px-4 font-semibold py-[6px] rounded-md"
                    type="submit"
                  >
                    {loading ? (
                      <LoadingSpinner color="white" size="sm" thickness="2px" />
                    ) : (
                      t("Confirm")
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="bg-gray-300 font-semibold w-full py-[6px] rounded-md"
                    type="button"
                  >
                    {t("Cancel")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default PasswordReset;