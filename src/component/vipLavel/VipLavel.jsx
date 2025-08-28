import React, { useState, useEffect, useRef } from "react";
import { GrEdit } from "react-icons/gr";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  Heading,
  Text,
  Badge,
  Button,
  useToast,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import {
  FaCrown,
  FaStar,
  FaGem,
  FaShieldAlt,
  FaHeart,
  FaRegThumbsUp,
  FaRocket,
  FaGift,
  FaLeaf,
  FaFire,
  FaThumbsUp,
} from "react-icons/fa";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import AddLevelModal from "./AddLevelModal";
import { fetchGetRequest } from "../../api/api";
import LoadingSpinner from "../loading/LoadingSpinner";
import nodatafound from "../../assets/emptydata.png";
const MotionBox = motion(Box);

const VIPLevelCard = ({ level, onEdit }) => {
  const {
    color,
    primaryBg,
    iconColor,
    secondaryBg,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);

  const toast = useToast();

  const validateWithdrawAmount = (amount) => {
    if (amount <= level.withdraw_limit) {
      toast({
        title: "Withdrawal Approved",
        description: `You can withdraw up to ${level.withdraw_limit}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Withdrawal Limit Exceeded",
        description: `Max limit is ${level.withdraw_limit}. Try a lower amount.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const iconMapping = {
    FaShieldAlt: FaShieldAlt,
    FaStar: FaStar,
    FaGem: FaGem,
    FaCrown: FaCrown,
    FaHeart: FaHeart,
    FaRegThumbsUp: FaRegThumbsUp,
    FaRocket: FaRocket,
    FaGift: FaGift,
    FaLeaf: FaLeaf,
    FaFire: FaFire,
    FaThumbsUp: FaThumbsUp,
  };

  // Utility function to check for overflow
  const ConditionalTooltip = ({ label, children }) => {
    const textRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
      if (textRef.current) {
        const { scrollWidth, clientWidth } = textRef.current;
        setIsOverflowing(scrollWidth > clientWidth);
      }
    }, [label]);

    return isOverflowing ? (
      <Tooltip label={label} hasArrow>
        <Box
          ref={textRef}
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          {children}
        </Box>
      </Tooltip>
    ) : (
      <Box
        ref={textRef}
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
      >
        {children}
      </Box>
    );
  };

  return (
    <MotionBox
      whileHover={{ scale: 1.02 }}
      transition="0.1s"
      as={Card}
      p={{ base: 1, md: 1 }}
      shadow="lg"
      borderWidth="1px"
      borderRadius="lg"
      bgGradient={level.bg_gradient}
      color="white"
      maxW={{ base: "100%" }}
      mx="auto"
      overflow="hidden" // Ensure content stays inside
    >
      <CardHeader pb={2}>
        <Flex align="center" justify="space-between" mb={2}>
          <Heading size={{ base: "sm", md: "md" }}>{level.level_name}</Heading>
          <Icon
            as={iconMapping[level.icon]}
            w={6}
            h={6}
            color={level.iconColor}
          />
          <Box
            _hover={{
              cursor: "pointer",
              transition: "transform 0.3s",
              transform: "scale(1.2) translate(2px, 2px)", // Adjust the translate values as needed
            }}
            _focus={{ boxShadow: "outline" }}
            onClick={() => onEdit(level)}
          >
            <GrEdit />
          </Box>
        </Flex>
        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.200">
          Created By: {level.parent_admin_username} (
          {level.parent_admin_role_type})
        </Text>
      </CardHeader>

      <CardBody>
        <Flex justify="space-between" align="center" mb={4}>
          <Badge colorScheme="yellow" fontSize={{ base: "xs", md: "sm" }}>
            Wager: {level.wager_points}
          </Badge>
          <Badge colorScheme="green" fontSize={{ base: "xs", md: "sm" }}>
            Deposit: {level.deposit_points}
          </Badge>
        </Flex>

        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(1, 1fr)" }}
          gap={2}
          // Padding to prevent items from touching edges
        >
          {[
            { label: "Bonus Reward", value: level.total_bonus_reward },
            { label: "Cashback", value: `${level.cashback_percent}` },
            { label: "Withdraw Limit", value: `$${level.withdraw_limit}` },
            { label: "Process Time", value: level.withdraw_process_time },
            {
              label: "Bonus Wager Multiplier",
              value: level.bonus_wager_multiplier,
            },
            { label: "VIP Manager", value: level.vip_manager },
            { label: "Support 24/7", value: level.dedicated_support_24_7 },
            {
              label: "Priority Withdraw Queue",
              value: level.priority_withdrawal_queue,
            },

            {
              label: "Increased Withdrawal Limit",
              value: level.increased_withdrawal_limits,
            },
          ].map((item, idx) => (
            <Flex
              key={idx}
              align="center"
              justify="space-between"
              fontWeight={600}
              p={1}
              bgGradient={level.bg_gradient}
              borderWidth="1px"
              borderRadius="md"
              overflow="hidden" // Prevent content overflow
            >
              <Tooltip label={item.label}>
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.100"
                  noOfLines={1}
                  cursor="pointer"
                >
                  {item.label}
                </Text>
              </Tooltip>
              {typeof item.value === "boolean" ? (
                <Icon
                  as={item.value ? FiCheckCircle : FiXCircle}
                  color={item.value ? "green.400" : "red.400"}
                  boxSize={4}
                />
              ) : (
                <Tooltip label={item.value}>
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    color="white"
                    noOfLines={1}
                    cursor="pointer"
                  >
                    {item.value}
                  </Text>
                </Tooltip>
              )}
            </Flex>
          ))}
        </Grid>
      </CardBody>
    </MotionBox>
  );
};

export { VIPLevelCard };

// VIP Level Component with API Integration
const VIPLevel = () => {
  const [vipLevels, setVipLevels] = useState([]); // Initially empty
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle error state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleEditVipLevel = (item) => {};
  const {
    color,
    primaryBg,
    iconColor,
    secondaryBg,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);
  const toast = useToast();

  // Fetching VIP levels from API
  const fetchVIPLevels = async () => {
    try {
      const response = await fetchGetRequest(
        `${import.meta.env.VITE_API_URL}/api/vip-level/get-vip-level`
      );
      if (response.success) {
        setVipLevels(response.data); // Store the fetched data in state
        setLoading(false);
      } else {
        setError(response.message); // Handle error response
        setLoading(false);
      }
    } catch (error) {
      setError("Failed to fetch VIP levels");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVIPLevels();
  }, []); // Empty dependency array means this runs only once, when the component mounts

  // Function to open the modal for adding a new level
  const handleAddLevel = () => {
    setSelectedLevel(null);
    setIsModalOpen(true);
  };

  // Function to open the modal for editing an existing level
  const handleEditLevel = (level) => {
    setSelectedLevel(level);
    setIsEditModalOpen(true);
  };

  // Function to handle saving a level (both add and edit)
  const handleSaveLevel = (updatedLevel) => {
    if (selectedLevel) {
      // Edit an existing level
      setVipLevels((prevLevels) =>
        prevLevels.map((level) =>
          level.level_name === selectedLevel.level_name ? updatedLevel : level
        )
      );
    } else {
      // Add a new level
      setVipLevels((prevLevels) => [...prevLevels, updatedLevel]);
    }
  };
  const handleUpdateLevel = () => {
    fetchVIPLevels();
  };

  return (
    <Box mx="auto" p={{ base: 1, md: 1 }}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        pb={4}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Heading fontSize={{ base: "lg", md: "24px" }} mb={{ base: 4, md: 0 }}>
          VIP Levels
        </Heading>

        {/* Button to open the Add New Level modal */}
        <Button
          colorScheme="blue"
          backgroundColor={bg}
          onClick={handleAddLevel}
          size={{ base: "sm", md: "md" }}
        >
          Add New Level
        </Button>
      </Flex>

      {/* Display the VIP levels */}
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
          xl: "repeat(4, 1fr)",
          "2xl": "repeat(5, 1fr)",
        }}
        gap={{ base: 2, md: 2 }}
      >
        {vipLevels.map((level) => (
          <VIPLevelCard
            key={level._id}
            level={level}
            onEdit={handleEditLevel}
          />
        ))}
      </Grid>

      {/* Loading spinner in center */}
      {loading && (
        <Flex height="60vh" justify="center" align="center">
          <LoadingSpinner thickness={3} size="lg" />
        </Flex>
      )}

      {/* No data found message */}
      {vipLevels?.length === 0 && !loading && (
        <Flex justify="center" align="center">
          <imghandleEditVipLevel
            src={nodatafound}
            style={{ width: "300px", borderRadius: "50%" }}
            alt="No data found"
          />
        </Flex>
      )}

      {/* Modal for adding/editing VIP levels */}
      <AddLevelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        levelData={selectedLevel}
        onSave={handleSaveLevel}
        type={"add"}
      />
      <AddLevelModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        levelData={selectedLevel}
        onSave={handleUpdateLevel}
        type={"update"}
      />
    </Box>
  );
};

export default VIPLevel;
