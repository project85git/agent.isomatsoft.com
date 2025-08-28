import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Checkbox,
  VStack,
  useToast,
  Box,
  Text,
  Stack,
  Icon,
  Container,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { sendPostRequest } from "../api/api";

const UpdateMultipleGameCategory = ({
  isOpen,
  onClose,
  allCategories,
  selectedIds,
  getAllGamesByProviderID,
}) => {
  const [selected, setSelected] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const toast = useToast();
  const { color, primaryBg, iconColor, bg, border } = useSelector(
    (state) => state.theme
  );

  const handleCheckboxChange = (category) => {
    if (category === "all") {
      if (selected.includes("all")) {
        setSelected([]);
      } else {
        setSelected(["all", ...allCategories.map((cat) => cat.name)]);
      }
    } else {
      let newSelected = selected.includes(category)
        ? selected.filter((item) => item !== category)
        : [...selected, category];

      if (newSelected.length === allCategories.length) {
        newSelected = ["all", ...allCategories.map((cat) => cat.name)];
      } else {
        newSelected = newSelected.filter((item) => item !== "all");
      }
      setSelected(newSelected);
    }
  };

  const handleAddMultipleCategory = async () => {
    if(!Array.isArray(selected)||selected.length === 0||!Array.isArray(selectedIds)||selectedIds.length===0) {
        toast({
            description: "IDs or Category must be a non-empty array.",
            status: "error",
            duration: 4000,
            position: "top",
            isClosable: true,
          });
          return;
    }
    setUpdateLoading(true);
    const payload = {
      category: selected.map((cat) => cat.toLowerCase()),
      ids: selectedIds,
    };
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/secondary-game/add-multiple-game-category`;

    try {
      const response = await sendPostRequest(url, payload);
      toast({
        description: response?.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      getAllGamesByProviderID()
      setUpdateLoading(false);
      onClose();
    } catch (error) {
      setUpdateLoading(false);
      console.error("Error:", error);
      toast({
        description: error?.data?.message || error?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      {/* <ModalOverlay /> */}
      <ModalContent className=" text-white rounded-lg">
        <ModalHeader className="border-b">
          <Text fontSize="xl" fontWeight="bold">
            Select Game Categories
          </Text>
        </ModalHeader>
        <ModalCloseButton className="text-gray-400 hover:text-white" />
        <ModalBody className="px-6 py-4">
          <VStack align="start" className="space-y-4">
            <Checkbox
              isChecked={selected.includes("all")}
              onChange={() => handleCheckboxChange("all")}
              className="text-lg"
              size="lg"
              sx={{
                ".chakra-checkbox__control": {
                  bg: "gray.200", // A slightly darker gray for better visibility
                  borderColor: "gray.500", // Darker border for contrast
                  _checked: {
                    bg: bg, // A universally appealing color that contrasts well with both light and dark backgrounds
                    borderColor: bg,
                  },
                  _hover: {
                    bg: "", // Darker shade of the checked color for hover state
                    borderColor: bg,
                  },
                },
              }}
            >
              <Text className="text-sm md:text-base">All</Text>
            </Checkbox>
            <Container>
              <Box className="grid gap-1 grid-cols-3">
                {allCategories.map((category) => (
                  <Box
                    style={
                      selected.includes(category.name)
                        ? { background: bg, color: "white" }
                        : {}
                    }
                    key={category._id}
                    className={`flex items-center p-2 rounded-md ${
                      selected.includes(category.name)
                        ? "bg-opacity-20"
                        : ""
                    }`}
                  >
                    <Checkbox
                      isChecked={selected.includes(category.name)}
                      onChange={() =>
                        handleCheckboxChange(category.name)
                      }
                      size="lg"
                      sx={{
                        ".chakra-checkbox__control": {
                          bg: "gray.200", // A slightly darker gray for better visibility
                          borderColor: "gray.500", // Darker border for contrast
                          _checked: {
                            bg: bg, // A universally appealing color that contrasts well with both light and dark backgrounds
                            borderColor: "white",
                          },
                          _hover: {
                            bg: "", // Darker shade of the checked color for hover state
                            borderColor: bg,
                          },
                        },
                      }}
                    />
                    <Stack direction="row" alignItems="center" ml={3}>
                      <Icon as={FaCheckCircle} color="green.400" />
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        className="text-sm md:text-base"
                      >
                        {category.name}
                      </Text>
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Container>
          </VStack>
        </ModalBody>
        <ModalFooter className="border-t  gap-4">
          <button
            onClick={handleAddMultipleCategory}
            style={{ backgroundColor: bg }}
            className="p-2 h-10  w-[100px] text-xs font-bold text-white rounded-md "
          >
            {updateLoading ? (
              <LoadingSpinner size="sm" thickness={"3px"} color={"white"} />
            ) : (
              "Save"
            )}
          </button>

          <button
            onClick={onClose}
            className="p-2 h-10  w-[100px] text-xs font-bold text-black border rounded-md "
          >
            Cancel
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateMultipleGameCategory;
