import React, { useRef, useState } from "react";
import {
  Box,
  Input,
  Button,
  SimpleGrid,
  Image,
  VStack,
  Heading,
  Flex,
  Icon,
  useToast,
  Text,
} from "@chakra-ui/react";
import { FiUpload, FiPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import { sendPostRequest } from "../../api/api";
import { IoCloseCircleOutline } from "react-icons/io5";

// ========== Helpers ==========
const defaultCard = {
  title: "",
  sub_title: "",
  image: "",
  link: "",
};

// ========== Image Card ==========
const ImageCard = ({
  item,
  index,
  sectionKey,
  handleInputChange,
  handleImageUpload,
  handleDelete,
}) => {
  const fileInputRef = useRef(null);
  const { bg } = useSelector((state) => state.theme);

  return (
    <Box position="relative" w={{ base: "full", sm: "280px" }} maxW="300px">
      {/* Delete button */}
      <button
        onClick={() => handleDelete(sectionKey, index)}
        className="
          absolute -top-3 -right-3 z-10 shadow-sm
          text-red-600 bg-white hover:scale-110
          transition-all duration-200 rounded-full
          flex items-center justify-center p-[2px] border
        "
      >
        <IoCloseCircleOutline size={26} />
      </button>

      {/* Card */}
      <Box
        bg="white"
        borderRadius="xl"
        shadow="md"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.100"
        transition="all 0.3s ease"
        _hover={{ 
          shadow: "xl",
          transform: "translateY(-6px)",
          borderColor: "gray.200"
        }}
      >
        {/* Image */}
        <Box position="relative" h="160px">
          <Image
            src={item.image || "https://via.placeholder.com/280x160?text=No+Image"}
            alt={item.title}
            objectFit="fill"
            w="full"
            h="full"
            borderTopRadius="xl"
            fallback={<Box bg="gray.100" w="full" h="full" />}
          />
          <Flex
            position="absolute"
            inset="0"
            bg="blackAlpha.700"
            opacity="0"
            transition="opacity 0.3s ease"
            _hover={{ opacity: 1 }}
            align="center"
            justify="center"
          >
            <Button
              size="sm"
              bg={bg}
              color="white"
              leftIcon={<Icon as={FiUpload} />}
              onClick={() => fileInputRef.current.click()}
              fontSize="sm"
              px={4}
              py={2}
              borderRadius="full"
              _hover={{ bg: "blue.600" }}
              transition="all 0.2s"
            >
              Upload Image
            </Button>
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              display="none"
              onChange={(e) =>
                e.target.files[0] &&
                handleImageUpload(sectionKey, index, e.target.files[0])
              }
            />
          </Flex>
        </Box>

        {/* Editable fields */}
        <VStack p={4} spacing={3} align="stretch">
          <Input
            value={item.title || ""}
            onChange={(e) =>
              handleInputChange(sectionKey, index, "title", e.target.value)
            }
            placeholder="Enter title"
            size="sm"
            fontWeight="bold"
            bg="gray.50"
            borderRadius="md"
            _focus={{ borderColor: "blue.400", bg: "white" }}
          />
          <Input
            value={item.sub_title || ""}
            onChange={(e) =>
              handleInputChange(sectionKey, index, "sub_title", e.target.value)
            }
            placeholder="Enter subtitle"
            size="sm"
            bg="gray.50"
            borderRadius="md"
            _focus={{ borderColor: "blue.400", bg: "white" }}
          />
          <Input
            value={item.link || ""}
            onChange={(e) => {
              const value = e.target.value;
              handleInputChange(sectionKey, index, "link", value);
              if (value.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
                handleInputChange(sectionKey, index, "image", value);
              }
            }}
            placeholder="Enter link or image URL"
            size="sm"
            color="blue.500"
            bg="gray.50"
            borderRadius="md"
            _focus={{ borderColor: "blue.400", bg: "white" }}
          />
        </VStack>
      </Box>
    </Box>
  );
};

// ========== Main Component ==========
const GameCard = ({ socialData, setSocialData }) => {
  const toast = useToast();
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const { bg } = useSelector((state) => state.theme);

  // Ensure socialData is initialized with empty arrays
  if (!socialData.first_card) {
    setSocialData((prev) => ({
      ...prev,
      first_card: [defaultCard],
    }));
  }
  if (!socialData.second_card) {
    setSocialData((prev) => ({
      ...prev,
      second_card: [defaultCard],
    }));
  }

  // Update input fields
  const handleInputChange = (sectionKey, index, field, value) => {
    setSocialData((prev) => {
      const section = prev[sectionKey] || [defaultCard];
      return {
        ...prev,
        [sectionKey]: section.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      };
    });
  };

  // Upload image -> get URL -> update socialData
  const handleImageUpload = async (sectionKey, index, file) => {
    setUploadImageLoading(true);
    const formData = new FormData();
    formData.append("post_img", file);

    try {
      const response = await sendPostRequest(
        `${import.meta.env.VITE_API_URL}/api/payment/image-url`,
        formData
      );
      if (response.url) {
        toast({
          title: "Image uploaded successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        setSocialData((prev) => {
          const section = prev[sectionKey] || [defaultCard];
          return {
            ...prev,
            [sectionKey]: section.map((item, i) =>
              i === index ? { ...item, image: response.url } : item
            ),
          };
        });
      }
    } catch (error) {
      toast({
        title: "Error uploading image",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setUploadImageLoading(false);
    }
  };

  // Delete card
  const handleDelete = (sectionKey, index) => {
    setSocialData((prev) => {
      const section = prev[sectionKey] || [defaultCard];
      const newItems = section.filter((_, i) => i !== index);
      return {
        ...prev,
        [sectionKey]: newItems.length > 0 ? newItems : [defaultCard],
      };
    });
  };

  // Add card
  const handleAdd = (sectionKey) => {
    setSocialData((prev) => ({
      ...prev,
      [sectionKey]: [...(prev[sectionKey] || []), { ...defaultCard }],
    }));
  };

  return (
    <Box minH="screen" py={8} >
      {/* First Section */}
      <Box mb={12} maxW="1200px" mx="auto">
        <Flex justify="center" align="center" mb={6}>
          <Heading 
            as="h2" 
            size="md" 
            color="gray.800" 
            fontWeight="semibold"
            textAlign="center"
          >
            First Section
          </Heading>
          <Button
            size="sm"
            bg={bg}
            color="white"
            leftIcon={<FiPlus />}
            onClick={() => handleAdd("first_card")}
            isLoading={uploadImageLoading}
            ml={4}
            borderRadius="4px"
            _hover={{ bg: "blue.600" }}
          >
            Add Card
          </Button>
        </Flex>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {(socialData.first_card || [defaultCard]).map((item, index) => (
            <ImageCard
              key={index}
              item={item}
              index={index}
              sectionKey="first_card"
              handleInputChange={handleInputChange}
              handleImageUpload={handleImageUpload}
              handleDelete={handleDelete}
            />
          ))}
        </SimpleGrid>
      </Box>

      {/* Second Section */}
      <Box mb={12} maxW="1200px" mx="auto">
        <Flex justify="center" align="center" mb={6}>
          <Heading 
            as="h2" 
            size="md" 
            color="gray.800" 
            fontWeight="semibold"
            textAlign="center"
          >
            Second Section
          </Heading>
          <Button
            size="sm"
            bg={bg}
            color="white"
            leftIcon={<FiPlus />}
            onClick={() => handleAdd("second_card")}
            isLoading={uploadImageLoading}
            ml={4}
            borderRadius="4px"
            _hover={{ bg: "blue.600" }}
          >
            Add Card
          </Button>
        </Flex>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {(socialData.second_card || [defaultCard]).map((item, index) => (
            <ImageCard
              key={index}
              item={item}
              index={index}
              sectionKey="second_card"
              handleInputChange={handleInputChange}
              handleImageUpload={handleImageUpload}
              handleDelete={handleDelete}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default GameCard;