import React, { useState } from "react";
import { useToast, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { IoLogOut } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { MdOutlineLogout } from "react-icons/md";

function UserLogout() {
  const toast = useToast();
  const { t } = useTranslation();
  const { color, primaryBg, iconColor, secondaryBg, bg, hoverColor, hover, text, font, border } = useSelector(state => state.theme);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast({
          description: "Logged out successfully",
          status: "success",
          duration: 4000,
          position: "top",
          isClosable: true,
        });
        handleClose();
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      toast({
        description: "Error logging out",
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }
  };

  return (
    <>
        <button
        onClick={handleOpen}
        style={{
            border: `1px solid ${border}60`,
            backgroundColor: primaryBg,
        }}
        className={`w-[25px] flex items-center border justify-center rounded-[6px] h-[25px]`}>
        <MdOutlineLogout fontSize={"20px"} cursor={"pointer"}  />
      </button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent style={{ backgroundColor: secondaryBg }}>
          <ModalHeader style={{ color: text }}>{t("Are You Sure?")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p style={{ color: text }}>
              {t("Are you sure you want to log out?")}
            </p>
          </ModalBody>
          <ModalFooter>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button
                colorScheme="red"
                onClick={handleLogout}
                className="w-[100px]"
              >
                {t("Logout")}
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                style={{ color: text, borderColor: border }}
              >
                {t("Cancel")}
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UserLogout;