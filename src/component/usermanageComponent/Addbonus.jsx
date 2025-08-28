"use client";
import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
  Select,
  Divider,
  Switch,
  Box,
  Text,
  Tooltip,
  VStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../loading/LoadingSpinner";
import { useTranslation } from "react-i18next";

// Dummy deposit data
const depositList = [
  {
    id: "DEP123",
    amount: 500,
    method: "UPI",
    status: "success",
    created_at: "2024-06-01 14:00",
  },
  {
    id: "DEP456",
    amount: 1000,
    method: "Bank Transfer",
    status: "pending",
    created_at: "2024-06-02 11:30",
  },
  {
    id: "DEP789",
    amount: 200,
    method: "Crypto",
    status: "success",
    created_at: "2024-06-03 09:15",
  },
];

// Dummy bonus options
const bonusOptions = [
  {
    id: "BONUS100",
    name: "Welcome Bonus",
    amount: 100,
    wagerMultiplier: 10,
    wagerType: "fixed",
    durationDays: 7,
    maxWin: 1000,
    description: "Given to new users on first deposit.",
    requiresDeposit: true,
  },
  {
    id: "BONUS50",
    name: "Referral Bonus",
    amount: 50,
    wagerMultiplier: 5,
    wagerType: "percentage",
    durationDays: 3,
    maxWin: 300,
    description: "Given when a referred user signs up.",
    requiresDeposit: false,
  },
  {
    id: "BONUS200",
    name: "Lose Bet Bonus",
    amount: 200,
    wagerMultiplier: 15,
    wagerType: "fixed",
    durationDays: 10,
    maxWin: 1500,
    description: "Given to loyal players weekly.",
    requiresDeposit: true,
  },
  {
    id: "BONUS75",
    name: "Lose Bet Bonus",
    amount: 75,
    wagerMultiplier: 8,
    wagerType: "percentage",
    durationDays: 5,
    maxWin: 500,
    description: "Given to users after a losing bet.",
    requiresDeposit: false,
  },
];

function AddBonus({ userData }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBonus, setSelectedBonus] = useState("");
  const [selectedDeposit, setSelectedDeposit] = useState("");
  const [requiresDeposit, setRequiresDeposit] = useState(true);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { t } = useTranslation();
  const { bg, iconColor, border } = useSelector((state) => state.theme);

  const selectedBonusData = bonusOptions.find((b) => b.id === selectedBonus);
  const selectedDepositData = depositList.find((d) => d.id === selectedDeposit);

  const handleSubmit = async () => {
    if (!selectedBonus) {
      toast({
        description: "Please select a bonus before submitting.",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      return;
    }

    if (requiresDeposit && !selectedDeposit) {
      toast({
        description: "Please select a deposit for this bonus.",
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      return;
    }

    const requestData = {
      userId: userData.user_id,
      bonus: selectedBonusData,
      deposit: requiresDeposit ? selectedDepositData : null,
    };

    console.log("POST /api/admin/add-bonus", requestData);

    toast({
      description: "Bonus added successfully (simulated)",
      status: "success",
      duration: 4000,
      position: "top",
      isClosable: true,
    });

    setSelectedBonus("");
    setSelectedDeposit("");
    setRequiresDeposit(true);
    onClose();
  };

  return (
    <>
      <Button
        onClick={onOpen}
        bg={bg}
        color="white"
        size="sm"
        fontWeight="semibold"
        rounded="md"
        w="full"
        _hover={{ transform: "translateY(-1px)", boxShadow: "sm" }}
        transition="all 0.2s"
      >
        {t("Add")} {t("Bonus")}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="white" color="black" rounded="lg" p={4}>
          <ModalHeader color={iconColor} textAlign="center" fontSize="xl">
            {t("Add Bonus to User")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6}>
              {/* Toggle Section */}
              <Box w="full">
                <Text fontWeight="bold" mb={2}>
                  Bonus Type
                </Text>
                <FormControl display="flex" alignItems="center" bg="gray.50" p={3} rounded="md">
                  <FormLabel mb="0" fontSize="sm">
                    Link to Deposit?
                  </FormLabel>
                  <Tooltip
                    label="Toggle to choose between deposit-linked or standalone bonuses"
                    placement="top"
                  >
                    <Switch
                      isChecked={requiresDeposit}
                      onChange={(e) => setRequiresDeposit(e.target.checked)}
                      colorScheme="teal"
                    />
                  </Tooltip>
                </FormControl>
              </Box>

              {/* Deposit Selection */}
              {requiresDeposit && (
                <Box w="full">
                  <Text fontWeight="bold" mb={2}>
                    Deposit Selection
                  </Text>
                  <FormControl>
                    <FormLabel fontSize="sm">Select Deposit</FormLabel>
                    <Select
                      value={selectedDeposit}
                      onChange={(e) => setSelectedDeposit(e.target.value)}
                      borderColor={border}
                      bg="white"
                      _hover={{ borderColor: "teal.500" }}
                      transition="all 0.2s"
                    >
                      <option value="">-- Select Deposit --</option>
                      {depositList.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.id} - ₹{d.amount} ({d.method})
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  {selectedDepositData && (
                    <Box
                      mt={4}
                      p={4}
                      border="1px"
                      borderColor="gray.200"
                      rounded="md"
                      bg="gray.50"
                      fontSize="sm"
                    >
                      <Text fontWeight="semibold" mb={2}>
                        Deposit Details
                      </Text>
                      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                        <GridItem>
                          <Text>
                            <strong>ID:</strong> {selectedDepositData.id}
                          </Text>
                          <Text>
                            <strong>Amount:</strong> ₹{selectedDepositData.amount}
                          </Text>
                        </GridItem>
                        <GridItem>
                          <Text>
                            <strong>Method:</strong> {selectedDepositData.method}
                          </Text>
                          <Text>
                            <strong>Status:</strong> {selectedDepositData.status}
                          </Text>
                          <Text>
                            <strong>Date:</strong> {selectedDepositData.created_at}
                          </Text>
                        </GridItem>
                      </Grid>
                    </Box>
                  )}
                </Box>
              )}

              <Divider />

              {/* Bonus Selection */}
              <Box w="full">
                <Text fontWeight="bold" mb={2}>
                  Bonus Selection
                </Text>
                <FormControl>
                  <FormLabel fontSize="sm">Select Bonus</FormLabel>
                  <Select
                    value={selectedBonus}
                    onChange={(e) => setSelectedBonus(e.target.value)}
                    borderColor={border}
                    bg="white"
                    _hover={{ borderColor: "teal.500" }}
                    transition="all 0.2s"
                  >
                    <option value="">-- Select Bonus --</option>
                    {bonusOptions
                      .filter((b) => b.requiresDeposit === requiresDeposit)
                      .map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} - ₹{b.amount}
                        </option>
                      ))}
                  </Select>
                </FormControl>

                {selectedBonusData && (
                  <Box
                    mt={4}
                    p={4}
                    border="1px"
                    borderColor="gray.200"
                    rounded="md"
                    bg="gray.50"
                    fontSize="sm"
                  >
                    <Text fontWeight="semibold" mb={2}>
                      Bonus Details
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                      <GridItem>
                        <Text>
                          <strong>ID:</strong> {selectedBonusData.id}
                        </Text>
                        <Text>
                          <strong>Name:</strong> {selectedBonusData.name}
                        </Text>
                        <Text>
                          <strong>Amount:</strong> ₹{selectedBonusData.amount}
                        </Text>
                        <Text>
                          <strong>Wager Multiplier:</strong> {selectedBonusData.wagerMultiplier}
                        </Text>
                      </GridItem>
                      <GridItem>
                        <Text>
                          <strong>Wager Type:</strong> {selectedBonusData.wagerType}
                        </Text>
                        <Text>
                          <strong>Duration:</strong> {selectedBonusData.durationDays} day(s)
                        </Text>
                        <Text>
                          <strong>Max Win:</strong> ₹{selectedBonusData.maxWin}
                        </Text>
                        <Text>
                          <strong>Description:</strong> {selectedBonusData.description}
                        </Text>
                      </GridItem>
                    </Grid>
                  </Box>
                )}
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button
              onClick={handleSubmit}
              bg={bg}
              color="white"
              fontWeight="bold"
              size="md"
              rounded="md"
              w="90px"
              isLoading={loading}
              loadingText={<LoadingSpinner color="white" size="sm" thickness="2px" />}
              _hover={{ transform: "translateY(-1px)", boxShadow: "sm" }}
              transition="all 0.2s"
            >
              {t("Submit")}
            </Button>
            <Button
              bg="gray.300"
              fontWeight="bold"
              size="md"
              rounded="md"
              w="90px"
              onClick={onClose}
              _hover={{ transform: "translateY(-1px)", boxShadow: "sm" }}
              transition="all 0.2s"
            >
              {t("Cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddBonus;