import React, { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa6";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import AddNewContribution from "../Modals/AddNewContribution";
import { fetchGetRequest, sendPatchRequest } from "../api/api";
import { Badge, Switch, useToast, Button, Box, Flex, IconButton, Tooltip, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { checkPermission, formatBonusText, formatDateTime } from "../../utils/utils";

const BonusContribution = () => {
  const { color, iconColor, text, font, border, bg } = useSelector((state) => state.theme);
  const { t } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [promotionData, setPromotionData] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null); // For modal

  // Fetch all promotions
  const getAllPromotion = async () => {
    setLoading(true);
    try {
      const response = await fetchGetRequest(`${import.meta.env.VITE_API_URL}/api/promotion/get-all-promotion`);
      setPromotionData(response.promotions);
      setLoading(false);
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

  // Open modal for more details
  const openDetailsModal = (promotion) => {
    setSelectedPromotion(promotion);
  };

  // Close modal
  const closeDetailsModal = () => {
    setSelectedPromotion(null);
  };

  // Update promotion status (activate/deactivate)
  const UpdateStatus = async (updateId, newStatus) => {
    try {
      await sendPatchRequest(
        `${import.meta.env.VITE_API_URL}/api/promotion/update-promotion-status/${updateId}`,
        { status: newStatus }
      );
      toast({
        title: `Promotion ${newStatus ? "activated" : "deactivated"}`,
        status: newStatus ? "success" : "error",
        duration: 2000,
        isClosable: true,
      });
      getAllPromotion(); // Refresh promotions
    } catch (error) {
      toast({
        title: error?.data?.message || error?.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Copy promotion ID
  const copyPromotion = (id) => {
    navigator.clipboard.writeText(id);
    toast({
      description: t("Promotion ID copied!"),
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  useEffect(() => {
    getAllPromotion();
  }, []);

  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === "owneradmin";
  const permissionDetails = user?.user?.permissions;
  const hasPermission = checkPermission(permissionDetails, "bonusManage");
  const check = !isOwnerAdmin ? hasPermission : true;

  return (
    <Box className="w-full mx-auto py-8" bg={text} color={font}>
      <Flex justify="space-between" align="center" mb={6} px={4}>
        <h1 className="text-2xl font-bold" style={{ color: iconColor }}>
          {t("Bonus Contribution")}
        </h1>
        {check && <AddNewContribution id={1} getAllPromotion={getAllPromotion} />}
      </Flex>

      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {promotionData?.map((data) => (
          <Box
            key={data._id}
            className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
            border={`1px solid ${border}60`}
            p={6}
          >
            {/* Smaller Image */}
            <Box className="w-full mb-4">
              <img
                src={data?.image}
                alt="Promotion"
                className="w-full h-32 object-cover rounded-lg"
              />
            </Box>

            {/* Promotion Details */}
            <Box mb={4}>
              <Text className="text-lg font-semibold" color={iconColor}>
                {formatBonusText(data?.category)}
              </Text>
              <Text className="text-sm">{formatBonusText(data?.sub_category)}</Text>
            </Box>

            <Flex justify="space-between" align="center" mb={4}>
              <Text className="font-medium">{t("Wagered")}</Text>
              <Text>{data?.wager_required || 0}</Text>
            </Flex>
            <Flex justify="space-between" align="center" mb={4}>
              <Text className="font-medium">{t("Reward Type")}</Text>
              <Badge colorScheme="green">
                {data?.reward_type} ({data?.reward_amount?.toFixed(2)})
              </Badge>
            </Flex>

            {/* Display Dates Directly */}
            <Flex justify="space-between" align="center" mb={4}>
              <Text className="font-medium">{t("Start Date")}</Text>
              <Text>{formatDateTime(data?.start_date)}</Text>
            </Flex>
            <Flex justify="space-between" align="center" mb={4}>
              <Text className="font-medium">{t("End Date")}</Text>
              <Text>{formatDateTime(data?.end_date)}</Text>
            </Flex>

            <Box className="flex items-center gap-2">
              {/* View More Button */}
              <Button
                style={{ backgroundColor:color}}
                size="sm"
                colorScheme="teal"
                variant="solid"
                onClick={() => openDetailsModal(data)}
              >
                {t("View More")}
              </Button>

              {/* Copy Promotion Button */}
              <Tooltip label={t("Copy Promotion Info")} placement="top">
                <IconButton
                  aria-label="Copy Promotion"
                  icon={<FaCopy />}
                  size="sm"
                  style={{backgroundColor:bg, color:"white"}}
                  onClick={() => copyPromotion(data.description)}
                />
              </Tooltip>
              <span >
             <AddNewContribution id="2" data={data} getAllPromotion={getAllPromotion} />
             </span>
              {/* Toggle Switch */}
              {check && (
                <Switch
                  isChecked={data?.status}
                  onChange={() => UpdateStatus(data?._id, !data?.status)}
                  colorScheme="purple"
                
                />
              )}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Modal for More Details */}
{selectedPromotion && (
  <Modal isOpen={true} onClose={closeDetailsModal} size="lg">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{formatBonusText(selectedPromotion.category)}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Flex justify="space-between" align="center" mb={4}>
          <Text className="font-medium">{t("Category")}</Text>
          <Text>{formatBonusText(selectedPromotion.category)}</Text>
        </Flex>
        <Flex justify="space-between" align="center" mb={4}>
          <Text className="font-medium">{t("Sub Category")}</Text>
          <Text className="flex flex-col items-center">{formatBonusText(selectedPromotion.sub_category)}

          {selectedPromotion.title&&<Badge color={color} className="p-1 w-[80%] text-center"> {selectedPromotion.title}</Badge>}
          </Text>
        </Flex>
        <Flex justify="space-between" align="center" mb={4}>
          <Text className="font-medium">{t("Wagered")}</Text>
          <Text>{selectedPromotion.wager_required}</Text>
        </Flex>
        <Flex justify="space-between" align="center" mb={4}>
          <Text className="font-medium">{t("Reward Type")}</Text>
          <Badge colorScheme="green">
            {selectedPromotion.reward_type} ({selectedPromotion.reward_amount})
          </Badge>
        </Flex>
        <Text className="font-medium">{t("Promotion Rules")}</Text>
        {/* Render HTML content, ensuring lists are styled properly */}
        <div
          contentEditable="false"
          className="mb-2"
          dangerouslySetInnerHTML={{ __html: selectedPromotion.rules }}
          style={{ paddingLeft: "20px" }} // Optional indentation for list
        ></div>
        <Text className="font-medium">{t("Promotion Description")}</Text>
        <Text>{selectedPromotion.description}</Text>
      </ModalBody>
    </ModalContent>
  </Modal>
)}

    </Box>
  );
};

export default BonusContribution;
