import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  useToast,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  Tooltip,
} from "@chakra-ui/react";
import nodatafound from "../../assets/nodatafound.png";
import {
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
} from "@chakra-ui/react";
import { useSteps } from "@chakra-ui/react";
import { FiGift } from "react-icons/fi";
import { useSelector } from "react-redux";
import { formatBonusText } from "../../../utils/utils";
import { fetchGetRequest } from "../../api/api";

const BonusHistoryModal = ({ user }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [bonusHistory, setBonusHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { primaryBg, border, bg } = useSelector((state) => state.theme);

  // Fetch Bonus and Deposit History data from API
  const getBonusHistoryData = async () => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/bonus-history/get-updated-bonus-wager-list-user/${user.username}`;
    try {
      const response = await fetchGetRequest(url);
      setLoading(false);
      if (response.success) {
        setBonusHistory(response.data);
      } else {
        toast({
          description: response.message,
          status: "error",
          duration: 4000,
          position: "top",
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      getBonusHistoryData();
    }
  }, [isModalOpen]);

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className="flex w-[25px] items-center justify-center rounded-[6px] h-[25px]"
        style={{ border: `1px solid ${border}60`, backgroundColor: primaryBg }}
      >
        <Tooltip label={"Bonus"} bg={bg} aria-label={`Bonus`} hasArrow>
        <div>
        <FiGift fontSize="20px" color={bg} />
        </div>
        </Tooltip>
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="lg" py={4}>
          <ModalHeader>Bonus History</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxHeight="70vh" overflowY="auto">
            {bonusHistory.length == 0 ? (
              <div className="flex justify-center h-[70vh] items-center">
                <img
                  src={nodatafound}
                  className="w-[300px] rounded-[50%]"
                  alt="No user found"
                />
              </div>
            ) : (
              <Box>
                <Example bonusHistory={bonusHistory} />
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default BonusHistoryModal;
function Example({ bonusHistory }) {
  // Initialize the Stepper state with the length of bonusHistory
  const { activeStep, setActiveStep } = useSteps({
    index: 0, // Start from the first step (index 0)
    count: bonusHistory.length, // Set the total number of steps
  });

  // Calculate the progress percentage
  const max = bonusHistory.length - 1;

  return (
    <Box position="relative" height={"100vh"}>
      <Stepper index={1} orientation="vertical" height="300px" gap="4">
        {bonusHistory.map((step, index) => (
          <Step key={index}>
            <StepIndicator className="text-center font-bold">
              {/* Step Status based on active, completed, and incomplete states */}
              <StepStatus
                complete={<StepIcon color="white" />}
                active={<StepNumber boxSize={6} color="blue.500" />}
                incomplete={<StepNumber boxSize={6} />}
              />
            </StepIndicator>
            <Box
              flexShrink="0"
              bg="gray.100"
              mb={2}
              h="auto"
              borderRadius="md"
              padding="4"
              boxShadow="sm"
            >
              {/* Step Title */}
              <StepTitle fontWeight="bold" fontSize="lg">
                {formatBonusText(step.sub_category)}
              </StepTitle>
              <StepDescription fontSize="sm" color="gray.600">
                {step.status === "success" ? (
                  <span style={{ color: "green" }}>
                    Bonus Status: {step.status}
                  </span>
                ) : (
                  <span style={{ color: "red" }}>
                    Bonus Status: {step.status}
                  </span>
                )}
              </StepDescription>
              {/* Display the bonus details */}
              <Box mt={2} className="text-sm w-[380px]">
                <p>
                  <strong>Bonus Amount:</strong> {step.bonus_amount}
                </p>
                <p>
                  <strong>Reward Amount:</strong> {step.reward_amount}
                </p>
                <p>
                  <strong>Minimum Deposit:</strong> {step.min_deposit}
                </p>
                <p>
                  <strong>Minimum Bet:</strong> {step.min_bet}
                </p>
                <p>
                  <strong>Wager Required:</strong> {step.wager_required}
                </p>
                <p>
                  <strong>Wager Status:</strong> {step.wager_status}
                </p>
                <p>
                  <strong>Bonus Added to User:</strong>{" "}
                  {step.bonus_added_to_user ? "Yes" : "No"}
                </p>
              </Box>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
