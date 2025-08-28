import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Switch,
  useToast,
  Input,
  Textarea,
  Select,
  Flex,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  Tooltip,
} from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTimes } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { sendPostRequest, sendPatchRequest } from "../../api/api";
import { useTranslation } from "react-i18next";
import { formatBonusText } from "../../../utils/utils";
import { InfoIcon } from "@chakra-ui/icons";
import LoadingSpinner from "../loading/LoadingSpinner";

const bonusTypes = [
  { value: "welcome", label: "Welcome Bonus", icon: FaPlus },
  { value: "reload", label: "Reload Bonus", icon: FaPlus },
  { value: "referral", label: "Referral Bonus", icon: FaPlus },
  { value: "cashback", label: "Cashback Bonus", icon: FaPlus },
  { value: "free_bet", label: "Free Bet Bonus", icon: FaPlus },
  { value: "free_spin", label: "Free Spin Bonus", icon: FaPlus },
  { value: "loss", label: "Loss Bonus", icon: FaPlus },
];

const applicableToOptions = [
  { value: "casino", label: "Casino" },
  { value: "sports", label: "Sports" },
  { value: "both", label: "Both" },
];

const autoTriggerOptions = [
  { value: "manual", label: "Manual" },
  { value: "first_deposit", label: "First Deposit" },
  { value: "any_deposit", label: "Any Deposit" },
  { value: "first_bet", label: "First Bet" },
  { value: "loss_threshold", label: "Loss Threshold" },
  { value: "referral_signup", label: "Referral Signup" },
  { value: "referral_deposit", label: "Referral Deposit" },
  { value: "trending", label: "Trending" },
];

function AddOrUpdateBonus({ id, data, setOpenType, getAllPromotion }) {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation();
  const toast = useToast();

  const {
    iconColor,
    bg,
  } = useSelector((state) => state.theme);

  const initialState = {
    _id: "",
    title: "",
    description: "",
    bonus_type: "welcome",
    applicable_to: "both",
    reward_type: "fixed",
    reward_amount: "",
    percentage: "",
    min_reward: "",
    max_reward: "",
    min_deposit: "",
    min_bet: 0,
    wager_multiplier: 0,
    max_cashout: "",
    auto_trigger: "manual",
    promo_code: "",
    eligible_games: [],
    eligible_providers: [],
    wagering_contribution: {
      slots: "100",
      table_games: "10",
      live_casino: "10",
      sports_betting: "100",
    },
    usage_limit: "0",
    per_user_limit: "1",
    start_date: "",
    end_date: "",
    is_active: false,
    poster: null,
    site_auth_key: "OxsAuthKey237",
  };

  const [formData, setFormData] = useState({
    ...initialState,
    _id: data?._id?.$oid || "",
    title: data?.title || "",
    description: data?.description || "",
    bonus_type: data?.bonus_type || "welcome",
    applicable_to: data?.applicable_to || "both",
    reward_type: data?.reward_type || "fixed",
    reward_amount: data?.reward_amount || "",
    percentage: data?.percentage || "",
    min_reward: data?.min_reward || "",
    max_reward: data?.max_reward || "",
    min_deposit: data?.min_deposit || "",
    min_bet: data?.min_bet || 0,
    wager_multiplier: data?.wager_multiplier || 0,
    max_cashout: data?.max_cashout || "",
    auto_trigger: data?.auto_trigger || "manual",
    promo_code: data?.promo_code || "",
    eligible_games: data?.eligible_games || [],
    eligible_providers: data?.eligible_providers || [],
    wagering_contribution: {
      slots: data?.wagering_contribution?.slots || "100",
      table_games: data?.wagering_contribution?.table_games || "10",
      live_casino: data?.wagering_contribution?.live_casino || "10",
      sports_betting: data?.wagering_contribution?.sports_betting || "100",
    },
    usage_limit: data?.usage_limit || "0",
    per_user_limit: data?.per_user_limit || "1",
    start_date: data?.start_date ? data.start_date.slice(0, 16) : "",
    end_date: data?.end_date ? data.end_date.slice(0, 16) : "",
    is_active: data?.is_active || false,
    poster: data?.poster || null,
    site_auth_key: data?.site_auth_key || "OxsAuthKey237",
  });


  useEffect(()=>{
setFormData({
    ...initialState,
    _id: data?._id?.$oid || "",
    title: data?.title || "",
    description: data?.description || "",
    bonus_type: data?.bonus_type || "welcome",
    applicable_to: data?.applicable_to || "both",
    reward_type: data?.reward_type || "fixed",
    reward_amount: data?.reward_amount || "",
    percentage: data?.percentage || "",
    min_reward: data?.min_reward || "",
    max_reward: data?.max_reward || "",
    min_deposit: data?.min_deposit || "",
    min_bet: data?.min_bet || 0,
    wager_multiplier: data?.wager_multiplier || 0,
    max_cashout: data?.max_cashout || "",
    auto_trigger: data?.auto_trigger || "manual",
    promo_code: data?.promo_code || "",
    eligible_games: data?.eligible_games || [],
    eligible_providers: data?.eligible_providers || [],
    wagering_contribution: {
      slots: data?.wagering_contribution?.slots || "100",
      table_games: data?.wagering_contribution?.table_games || "10",
      live_casino: data?.wagering_contribution?.live_casino || "10",
      sports_betting: data?.wagering_contribution?.sports_betting || "100",
    },
    usage_limit: data?.usage_limit || "0",
    per_user_limit: data?.per_user_limit || "1",
    start_date: data?.start_date ? data.start_date.slice(0, 16) : "",
    end_date: data?.end_date ? data.end_date.slice(0, 16) : "",
    is_active: data?.is_active || false,
    poster: data?.poster || null,
    site_auth_key: data?.site_auth_key || "OxsAuthKey237",
  })
  },[data])

  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const onClose = ()=>{
    setIsOpen(false)
    setOpenType(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = async (file) => {
    setImageLoading(true);
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
        setImageLoading(false);
        return response.url;
      }
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({
        title: "Error uploading image",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setImageLoading(false);
    }
  };

  const handleBonusImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const logo = await handleImageUpload(file);
      setFormData({
        ...formData,
        poster: logo,
      });
    }
  };

  const addContribution = async (e) => {
    e.preventDefault();
    const url = `${import.meta.env.VITE_API_URL}/api/bonus/add-new-bonus`;
    setLoading(true);

    try {
      let response = await sendPostRequest(url, formData);
      toast({
        description: response.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
      setFormData(initialState);
      getAllPromotion();
      onClose();
    } catch (error) {
      toast({
        description: `${error?.response?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const UpdateContribution = async (updateId) => {
    setUpdateLoading(true);
    try {
      const response = await sendPatchRequest(
        `${import.meta.env.VITE_API_URL}/api/bonus/update-bonus/${updateId}`,
        formData
      );
      toast({
        title: "Updated Successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setUpdateLoading(false);
      getAllPromotion();
      onClose();
    } catch (error) {
      setUpdateLoading(false);
      toast({
        title: error?.response?.data?.message || error?.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent className="max-h-[90vh] rounded-md">
          <ModalHeader>
            <div className="flex items-center justify-center gap-2">
              <Heading
                size="lg"
                className="text-lg font-semibold text-gray-800"
                style={{ color: iconColor, textAlign: "center" }}
              >
                {id === 1
                  ? `${t(`Add`)} ${t(`New`)} ${t(`Promotion`)}`
                  : `${t(`Edit`)} ${t(`Promotion`)}`}
              </Heading>
              <Tooltip
                label="This bonus is applicable only to casino games. Make sure players meet all conditions before applying."
                hasArrow
                bg="gray.700"
                color="white"
                fontSize="sm"
                placement="right"
              >
                <span>
                  <InfoIcon color="gray.500" cursor="pointer" boxSize={4} />
                </span>
              </Tooltip>
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box as="form" onSubmit={addContribution} className="space-y-6">
              <Tabs isFitted variant="subtle" colorScheme="white" className="space-y-6">
                <TabList
                  className="grid w-full grid-cols-4 bg-gray-100 p-2 rounded-md"
                  _selected={{ bg: "white", boxShadow: "sm", rounded: "md" }}
                >
                  <Tab
                    className="flex items-center gap-2 data-[selected]:bg-white data-[selected]:shadow-sm rounded-md py-2"
                    _selected={{ bg: "white", boxShadow: "sm", rounded: "md" }}
                  >
                    Basic Info
                  </Tab>
                  <Tab
                    className="flex items-center gap-2 data-[selected]:bg-white data-[selected]:shadow-sm rounded-md py-2"
                    _selected={{ bg: "white", boxShadow: "sm", rounded: "md" }}
                  >
                    Wagering
                  </Tab>
                  <Tab
                    className="flex items-center gap-2 data-[selected]:bg-white data-[selected]:shadow-sm rounded-md py-2"
                    _selected={{ bg: "white", boxShadow: "sm", rounded: "md" }}
                  >
                    Restrictions
                  </Tab>
                  <Tab
                    className="flex items-center gap-2 data-[selected]:bg-white data-[selected]:shadow-sm rounded-md py-2"
                    _selected={{ bg: "white", boxShadow: "sm", rounded: "md" }}
                  >
                    Conditions
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel className="space-y-4" p={0}>
                    {/* Basic Info Tab */}
                    <Box className="space-y-4">
                      <Box className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700">
                          {t(`Bonus Poster`)} *
                        </FormLabel>
                        <input
                          type="file"
                          accept="image/*"
                          name="poster"
                          id="poster"
                          onChange={handleBonusImage}
                          className="mt-1 p-2 border-dashed border-2 border-gray-300 outline-none rounded-md w-full transition duration-200 ease-in-out focus:border-blue-500"
                          required
                        />
                        {formData?.poster && (
                          <img
                            src={formData?.poster}
                            alt="Bonus Poster"
                            className="mt-2 w-full h-[200px] object-cover rounded-md shadow-md"
                          />
                        )}
                      </Box>
                      <Box className="grid grid-cols-2 gap-4">
                        <Box className="space-y-2">
                          <FormLabel
                            m={0}
                            htmlFor="title"
                            className="text-sm font-medium text-gray-700"
                          >
                            {t(`Bonus Name`)} *
                          </FormLabel>
                          <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Welcome Bonus"
                            focusBorderColor="blue.500"
                            required
                          />
                        </Box>
                        <Box className="space-y-2">
                          <FormLabel
                            htmlFor="bonus_type"
                            className="text-sm font-medium text-gray-700"
                          >
                            {t(`Bonus Type`)} *
                          </FormLabel>
                          <Select
                            name="bonus_type"
                            value={formData.bonus_type}
                            onChange={handleInputChange}
                            className="border-gray-300 rounded-md"
                            focusBorderColor="blue.500"
                            required
                          >
                            {bonusTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </Select>
                        </Box>
                      </Box>
                      <Box className="grid grid-cols-2 gap-4">
                        <Box className="space-y-2">
                          <FormLabel
                            htmlFor="applicable_to"
                            className="text-sm font-medium text-gray-700"
                          >
                            {t(`Applicable To`)} *
                          </FormLabel>
                          <Select
                            name="applicable_to"
                            value={formData.applicable_to}
                            onChange={handleInputChange}
                            className="border-gray-300 rounded-md"
                            focusBorderColor="blue.500"
                            required
                          >
                            {applicableToOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Select>
                        </Box>
                        <Box className="space-y-2">
                          <FormLabel
                            htmlFor="reward_type"
                            className="text-sm font-medium text-gray-700"
                          >
                            {t(`Reward Type`)} *
                          </FormLabel>
                          <Select
                            name="reward_type"
                            value={formData.reward_type}
                            onChange={handleInputChange}
                            className="border-gray-300 rounded-md"
                            focusBorderColor="blue.500"
                            required
                          >
                            <option value="fixed">Fixed</option>
                            <option value="percentage">Percentage</option>
                          </Select>
                        </Box>
                      </Box>
                      <Box className="grid grid-cols-2 gap-4">
                        <Box className="space-y-2">
                          <FormLabel
                                m={0}

                            htmlFor="promo_code"
                            className="text-sm font-medium text-gray-700"
                          >
                            {t(`Promo Code`)}
                          </FormLabel>
                          <Input
                            id="promo_code"
                            name="promo_code"
                            value={formData.promo_code}
                            onChange={(e) =>
                              setFormData({ ...formData, promo_code: e.target.value.toUpperCase() })
                            }
                            placeholder="WELCOME100"
                            className="border-gray-300 rounded-md"
                            focusBorderColor="blue.500"
                          />
                        </Box>
                        {formData.reward_type === "fixed" && (
                          <Box className="space-y-2">
                            <FormLabel
                              m={0}
                              htmlFor="reward_amount"
                              className="text-sm font-medium text-gray-700"
                            >
                              {t(`Reward Amount`)} ($)
                            </FormLabel>
                            <Input
                              id="reward_amount"
                              name="reward_amount"
                              type="number"
                              value={formData.reward_amount}
                              onChange={handleInputChange}
                              placeholder="100"
                              className="border-gray-300 rounded-md"
                              focusBorderColor="blue.500"
                              min="0"
                              required={formData.reward_type === "fixed"}
                            />
                          </Box>
                        )}
                        {formData.reward_type === "percentage" && (
                          <Box className="space-y-2">
                            <FormLabel
                                m={0}

                              htmlFor="percentage"
                              className="text-sm font-medium text-gray-700"
                            >
                              {t(`Percentage`)} (%)
                            </FormLabel>
                            <Input
                              id="percentage"
                              name="percentage"
                              type="number"
                              value={formData.percentage}
                              onChange={handleInputChange}
                              placeholder="100"
                              className="border-gray-300 rounded-md"
                              focusBorderColor="blue.500"
                              min="0"
                              max="500"
                              required={formData.reward_type === "percentage"}
                            />
                          </Box>
                        )}
                      </Box>
                      <Box className="space-y-2">
                        <FormLabel
                          htmlFor="description"
                          className="text-sm font-medium text-gray-700"
                        >
                          {t(`Description`)} *
                        </FormLabel>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe the bonus terms and conditions"
                          rows={3}
                          className="border-gray-300 rounded-md"
                          focusBorderColor="blue.500"
                          required
                        />
                      </Box>
                      {formData.reward_type === "percentage" && (
                        <Box className="grid grid-cols-2 gap-4">
                          <Box className="space-y-2">
                            <FormLabel
                                m={0}

                              htmlFor="min_reward"
                              className="text-sm font-medium text-gray-700"
                            >
                              {t(`Min Reward`)} ($)
                            </FormLabel>
                            <Input
                              id="min_reward"
                              name="min_reward"
                              type="number"
                              value={formData.min_reward}
                              onChange={handleInputChange}
                              placeholder="50"
                              className="border-gray-300 rounded-md"
                              focusBorderColor="blue.500"
                              min="0"
                              required={formData.reward_type === "percentage"}
                            />
                          </Box>
                          <Box className="space-y-2">
                            <FormLabel
                                m={0}

                              htmlFor="max_reward"
                              className="text-sm font-medium text-gray-700"
                            >
                              {t(`Max Reward`)} ($)
                            </FormLabel>
                            <Input
                              id="max_reward"
                              name="max_reward"
                              type="number"
                              value={formData.max_reward}
                              onChange={handleInputChange}
                              placeholder="500"
                              className="border-gray-300 rounded-md"
                              focusBorderColor="blue.500"
                              min="0"
                              required={formData.reward_type === "percentage"}
                            />
                          </Box>
                        </Box>
                      )}
                      <Box className="grid grid-cols-2 gap-4">
                        <Box className="space-y-2">
                          <FormLabel
                                m={0}

                            htmlFor="min_deposit"
                            className="text-sm font-medium text-gray-700"
                          >
                            {t(`Minimum Deposit`)} ($)
                          </FormLabel>
                          <Input
                            id="min_deposit"
                            name="min_deposit"
                            type="number"
                            value={formData.min_deposit}
                            onChange={handleInputChange}
                            placeholder="500"
                            className="border-gray-300 rounded-md"
                            focusBorderColor="blue.500"
                            min="0"
                          />
                        </Box>
                        <Box className="space-y-2">
                          <FormLabel
                                m={0}

                            htmlFor="min_bet"
                            className="text-sm font-medium text-gray-700"
                          >
                            {t(`Minimum Bet`)} ($)
                          </FormLabel>
                          <Input
                            id="min_bet"
                            name="min_bet"
                            type="number"
                            value={formData.min_bet}
                            onChange={handleInputChange}
                            placeholder="0"
                            className="border-gray-300 rounded-md"
                            focusBorderColor="blue.500"
                            min="0"
                          />
                        </Box>
                      </Box>
                      <Box className="space-y-2">
                        <FormLabel
                                m={0}

                          htmlFor="auto_trigger"
                          className="text-sm font-medium text-gray-700"
                          >
                            {t(`Auto Trigger`)} *
                        </FormLabel>
                        <Select
                          name="auto_trigger"
                          value={formData.auto_trigger}
                          onChange={handleInputChange}
                          className="border-gray-300 rounded-md"
                          focusBorderColor="blue.500"
                          required
                        >
                          {autoTriggerOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      </Box>
                      <Flex alignItems="center" gap="2">
                        <Switch
                          id="is_active"
                          name="is_active"
                          isChecked={formData.is_active}
                          onChange={(e) =>
                            setFormData({ ...formData, is_active: e.target.checked })
                          }
                          colorScheme="blue"
                        />
                        <FormLabel
                          m={0}
                          htmlFor="is_active"
                          className="text-sm font-medium text-gray-700 mb-0"
                        >
                          {t(`Activate bonus immediately`)}
                        </FormLabel>
                      </Flex>
                    </Box>
                  </TabPanel>
                  <TabPanel className="space-y-4" p={0}>
                    {/* Wagering Tab */}
                    <Card className="border-gray-200 shadow-md rounded-md">
                      <CardHeader>
                        <Heading size="md" className="text-lg font-semibold text-gray-800">
                          {t(`Wagering Requirements`)}
                        </Heading>
                      </CardHeader>
                      <CardBody className="space-y-4">
                        <Box className="grid grid-cols-2 gap-4">
                          <Box className="space-y-2">
                            <FormLabel
                              htmlFor="wager_multiplier"
                              className="text-sm font-medium text-gray-700"
                            >
                              {t(`Wagering Multiplier`)} *
                            </FormLabel>
                            <Box position="relative">
                              <Input
                                id="wager_multiplier"
                                name="wager_multiplier"
                                type="number"
                                value={formData.wager_multiplier}
                                onChange={handleInputChange}
                                placeholder="35"
                                className="border-gray-300 rounded-md"
                                focusBorderColor="blue.500"
                                min="0"
                                required
                              />
                              <span
                                style={{ backgroundColor: bg }}
                                className="absolute h-full w-[36px] rounded-r-[6px] right-[0px] font-bold text-white"
                              >
                                <span className="flex justify-center mt-[10px] items-center text-center">
                                  <FaTimes className="" size={20} />
                                </span>
                              </span>
                            </Box>
                            <Text className="text-sm text-gray-500">
                              {t(`Times the bonus amount that must be wagered`)}
                            </Text>
                          </Box>
                          <Box className="space-y-2">
                            <FormLabel
                              m={0}
                              htmlFor="max_cashout"
                              className="text-sm font-medium text-gray-700"
                            >
                              {t(`Max Cashout`)} ($)
                            </FormLabel>
                            <Input
                              id="max_cashout"
                              name="max_cashout"
                              type="number"
                              value={formData.max_cashout}
                              onChange={handleInputChange}
                              placeholder="1000"
                              className="border-gray-300 rounded-md"
                              focusBorderColor="blue.500"
                              min="0"
                            />
                          </Box>
                        </Box>
                        <Box className="space-y-3">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            {t(`Game Contribution to Wagering`)}
                          </FormLabel>
                          <Box className="grid grid-cols-2 gap-4">
                            <Box className="space-y-2">
                              <FormLabel
                                m={0}

                                htmlFor="slots"
                                className="text-sm font-medium text-gray-700"
                              >
                                {t(`Slots`)} (%)
                              </FormLabel>
                              <Input
                                id="slots"
                                type="number"
                                value={formData.wagering_contribution.slots}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    wagering_contribution: {
                                      ...formData.wagering_contribution,
                                      slots: e.target.value,
                                    },
                                  })
                                }
                                className="border-gray-300 rounded-md"
                                focusBorderColor="blue.500"
                                min="0"
                                max="100"
                              />
                            </Box>
                            <Box className="space-y-2">
                              <FormLabel
                                m={0}

                                htmlFor="table_games"
                                className="text-sm font-medium text-gray-700"
                              >
                                {t(`Table Games`)} (%)
                              </FormLabel>
                              <Input
                                id="table_games"
                                type="number"
                                value={formData.wagering_contribution.table_games}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    wagering_contribution: {
                                      ...formData.wagering_contribution,
                                      table_games: e.target.value,
                                    },
                                  })
                                }
                                className="border-gray-300 rounded-md"
                                focusBorderColor="blue.500"
                                min="0"
                                max="100"
                              />
                            </Box>
                            <Box className="space-y-2">
                              <FormLabel
                                m={0}
                                htmlFor="live_casino"
                                className="text-sm font-medium text-gray-700"
                              >
                                {t(`Live Casino`)} (%)
                              </FormLabel>
                              <Input
                                id="live_casino"
                                type="number"
                                value={formData.wagering_contribution.live_casino}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    wagering_contribution: {
                                      ...formData.wagering_contribution,
                                      live_casino: e.target.value,
                                    },
                                  })
                                }
                                className="border-gray-300 rounded-md"
                                focusBorderColor="blue.500"
                                min="0"
                                max="100"
                              />
                            </Box>
                            <Box className="space-y-2">
                              <FormLabel
                                m={0}

                                htmlFor="sports_betting"
                                className="text-sm font-medium text-gray-700"
                              >
                                {t(`Sports Betting`)} (%)
                              </FormLabel>
                              <Input
                                id="sports_betting"
                                type="number"
                                value={formData.wagering_contribution.sports_betting}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    wagering_contribution: {
                                      ...formData.wagering_contribution,
                                      sports_betting: e.target.value,
                                    },
                                  })
                                }
                                className="border-gray-300 rounded-md"
                                focusBorderColor="blue.500"
                                min="0"
                                max="100"
                              />
                            </Box>
                          </Box>
                        </Box>
                      </CardBody>
                    </Card>
                  </TabPanel>
                  <TabPanel className="space-y-4" p={0}>
                    {/* Restrictions Tab */}
                    <Box className="grid grid-cols-2 gap-4">
                      <Box className="space-y-2">
                        <FormLabel
                                m={0}

                          htmlFor="start_date"
                          className="text-sm font-medium text-gray-700"
                        >
                          {t(`Start Date`)} *
                        </FormLabel>
                        <Input
                          id="start_date"
                          name="start_date"
                          type="datetime-local"
                          value={formData.start_date}
                          onChange={handleInputChange}
                          className="border-gray-300 rounded-md"
                          focusBorderColor="blue.500"
                          required
                        />
                      </Box>
                      <Box className="space-y-2">
                        <FormLabel
                                m={0}

                          htmlFor="end_date"
                          className="text-sm font-medium text-gray-700"
                        >
                          {t(`End Date`)} *
                        </FormLabel>
                        <Input
                          id="end_date"
                          name="end_date"
                          type="datetime-local"
                          value={formData.end_date}
                          onChange={handleInputChange}
                          className="border-gray-300 rounded-md"
                          focusBorderColor="blue.500"
                          required
                        />
                      </Box>
                    </Box>
                    <Box className="grid grid-cols-2 gap-4">
                      <Box className="space-y-2">
                        <FormLabel
                                m={0}

                          htmlFor="usage_limit"
                          className="text-sm font-medium text-gray-700"
                        >
                          {t(`Total Usage Limit`)}
                        </FormLabel>
                        <Input
                          id="usage_limit"
                          name="usage_limit"
                          type="number"
                          value={formData.usage_limit}
                          onChange={handleInputChange}
                          placeholder="0 (Unlimited)"
                          className="border-gray-300 rounded-md"
                          focusBorderColor="blue.500"
                          min="0"
                        />
                      </Box>
                      <Box className="space-y-2">
                        <FormLabel
                                m={0}

                          htmlFor="per_user_limit"
                          className="text-sm font-medium text-gray-700"
                        >
                          {t(`Per User Limit`)}
                        </FormLabel>
                        <Input
                          id="per_user_limit"
                          name="per_user_limit"
                          type="number"
                          value={formData.per_user_limit}
                          onChange={handleInputChange}
                          placeholder="1"
                          className="border-gray-300 rounded-md"
                          focusBorderColor="blue.500"
                          min="1"
                        />
                      </Box>
                    </Box>
                  </TabPanel>
                  <TabPanel className="space-y-4" p={0}>
                    {/* Conditions Tab */}
                    <Card className="border-gray-200 shadow-md rounded-md">
                      <CardHeader>
                        <Heading size="md" className="text-lg font-semibold text-gray-800">
                          {t(`Eligible Games & Providers`)}
                        </Heading>
                      </CardHeader>
                      <CardBody>
                        <Text className="text-sm text-gray-500 mb-4">
                          {t(`Leave empty to allow all games. Add specific games or providers to restrict.`)}
                        </Text>
                        <Box className="grid grid-cols-2 gap-4">
                          <Box className="space-y-2">
                            <FormLabel
                                m={0}

                              className="text-sm font-medium text-gray-700"
                            >
                              {t(`Eligible Games`)}
                            </FormLabel>
                            <Textarea
                              placeholder="Enter game IDs or names, one per line"
                              rows={4}
                              value={formData.eligible_games.join('\n')}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  eligible_games: e.target.value.split('\n').filter(Boolean),
                                })
                              }
                              className="border-gray-300 rounded-md"
                              focusBorderColor="blue.500"
                            />
                          </Box>
                          <Box className="space-y-2">
                            <FormLabel
                                m={0}
                              className="text-sm font-medium text-gray-700"
                            >
                              {t(`Eligible Providers`)}
                            </FormLabel>
                            <Textarea
                              placeholder="Enter provider names, one per line"
                              rows={4}
                              value={formData.eligible_providers.join('\n')}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  eligible_providers: e.target.value.split('\n').filter(Boolean),
                                })
                              }
                              className="border-gray-300 rounded-md"
                              focusBorderColor="blue.500"
                            />
                          </Box>
                        </Box>
                        <Box className="space-y-2 mt-4">
                          <FormLabel
                                m={0}

                            className="text-sm font-medium text-gray-700"
                          >
                            {t(`Rules`)}
                          </FormLabel>
                          <ReactQuill
                            theme="snow"
                            placeholder="Enter Rules..."
                            value={formData.rules}
                            onChange={(value) =>
                              setFormData({ ...formData, rules: value })
                            }
                          />
                        </Box>
                        <Box className="space-y-2 mt-4">
                          <FormLabel
                            m={0}
                            className="text-sm font-medium text-gray-700"
                          >
                            {t(`Eligibility`)}
                          </FormLabel>
                          <Textarea
                            placeholder="Enter Eligibility"
                            value={formData.eligibility}
                            onChange={(e) =>
                              setFormData({ ...formData, eligibility: e.target.value })
                            }
                            className="border-gray-300 rounded-md h-[160px]"
                            focusBorderColor="blue.500"
                          />
                        </Box>
                      </CardBody>
                    </Card>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Flex justifyContent="end" gap="2">
              <Button
                type="button"
                variant="outline"
                className="border-gray-300 text-gray-700"
                onClick={onClose}
              >
                {t(`Cancel`)}
              </Button>
              {id === 2 ? (
                <Button
                  type="submit"
                  color="white"
                  style={{ backgroundColor: bg }}
                  className="text-white font-semibold"
                  onClick={addContribution}
                >
                  {loading ? (
                    <LoadingSpinner color="white" size="sm" thickness="2px" />
                  ) : (
                    `${t(`Add`)} ${t(`Promotion`)}`
                  )}
                </Button>
              ) : (
                <Button
                  color="white"
                  style={{ backgroundColor: bg }}
                  className="text-white font-semibold"
                  onClick={() => UpdateContribution(formData._id)}
                >
                  {updateLoading ? (
                    <LoadingSpinner color="white" size="sm" thickness="2px" />
                  ) : (
                    `${t(`Update`)} ${t(`Promotion`)}`
                  )}
                </Button>
              )}
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default AddOrUpdateBonus;