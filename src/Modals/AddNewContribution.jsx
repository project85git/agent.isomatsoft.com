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
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FaPlus, FaEdit, FaTimes } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { sendPostRequest, sendPatchRequest } from "../api/api";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { formatBonusText } from "../../utils/utils";
import { InfoIcon } from "@chakra-ui/icons";

const bonusTypes = [
  { value: "user_bonus", label: "User Bonus", icon: FaPlus },
  { value: "referral_bonus", label: "Referral Bonus", icon: FaPlus },
  { value: "deposit_bonus", label: "Deposit Bonus", icon: FaPlus },
  { value: "bet_bonus", label: "Bet Bonus", icon: FaPlus },
];

function AddNewContribution({ id, data, getAllPromotion }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const toast = useToast();

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

  const initialState = {
    title: "",
    description: "",
    type: "user_bonus",
    category: "user_bonus",
    sub_category: "first_user",
    reward_type: "fixed",
    reward_amount: "",
    min_reward: "",
    max_reward: "",
    code: "",
    amount: "",
    percentage: "",
    maxAmount: "",
    minDeposit: "",
    min_bet: 0,
    wager_required: 0,
    wageringRequirement: "",
    maxCashout: "",
    validFrom: "",
    validUntil: "",
    usageLimit: "",
    perUserLimit: "1",
    isActive: false,
    eligibleGames: [],
    eligibleProviders: [],
    rules: "",
    eligibility: "",
    image: null,
    expary_in: "",
    start_date: "",
    end_date: "",
    wagering_contribution: {
      slots: "100",
      table_games: "10",
      video_poker: "5",
      live_casino: "10",
    },
  };

  const bonusData = [
    {
      category: "user_bonus",
      sub_category: ["first_user"],
      reward_type: ["fixed"],
    },
    {
      category: "referral_bonus",
      sub_category: ["every_referral"],
      reward_type: ["fixed"],
    },
    {
      category: "deposit_bonus",
      sub_category: [
        "first_deposit",
        "second_deposit",
        "third_deposit",
        "forth_deposit",
        "every_deposit",
        "occasion_deposit",
      ],
      reward_type: ["fixed", "percentage"],
    },
    {
      category: "bet_bonus",
      sub_category: ["first_bet", "lose_bet", "every_bet"],
      reward_type: ["fixed"],
    },
  ];

  const [formData, setFormData] = useState(data || initialState);
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

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
    const logo = await handleImageUpload(file);
    setFormData({
      ...formData,
      image: logo,
    });
  };

  const handleCategory = (e) => {
    const data = bonusData.filter((item) => item.category === e.target.value)[0];
    setFormData({
      ...formData,
      category: e.target.value,
      type: e.target.value,
      sub_category: data.sub_category[0],
    });
  };

  const handleSubCategory = (e) => {
    setFormData({
      ...formData,
      sub_category: e.target.value,
    });
  };

  const addContribution = async (e) => {
    e.preventDefault();
    const url = `${import.meta.env.VITE_API_URL}/api/promotion/add-new-promotion`;
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
        description: `${error?.data?.message || error?.message}`,
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
        title: error?.response?.data?.message || error?.data?.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>

        <button
          onClick={onOpen}
          style={{ backgroundColor: bg }}
          className="flex items-center p-2 gap-2 rounded-[6px] text-xs md:text-sm text-white font-bold"
        >
          {id === 1? <FaPlus className="h-4 w-4 mr-2" />:<FaEdit className="h-4 w-4 mr-2" />}
          {id === 1
            ? `${t(`Add`)} ${t(`New`)} ${t(`Promotion`)}`
            : `${t(`Edit`)} ${t(`Promotion`)}`}
        </button>
      {id === 2 && (
        <button
          onClick={onOpen}
          style={{ backgroundColor: bg, color: "white" }}
          className="p-[3.9px] text-white flex justify-center rounded-md"
        >
          <RiEdit2Fill fontSize="24px" />
        </button>
      )}

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
              <Tabs isFitted variant="subtle" colorScheme="white" className="space-y-6" >
              <TabList className="grid w-full grid-cols-4 bg-gray-100 p-2 rounded-md"
                   _selected={{ bg: 'white', boxShadow: 'sm', rounded:"md" }}>
                  <Tab className="flex items-center gap-2 data-[selected]:bg-white data-[selected]:shadow-sm rounded-md py-2"
                   _selected={{ bg: 'white', boxShadow: 'sm', rounded:"md" }}>Basic Info</Tab>
                  <Tab className="flex items-center gap-2 data-[selected]:bg-white data-[selected]:shadow-sm rounded-md py-2"
                   _selected={{ bg: 'white', boxShadow: 'sm', rounded:"md" }}>Wagering</Tab>
                  <Tab className="flex items-center gap-2 data-[selected]:bg-white data-[selected]:shadow-sm rounded-md py-2"
                  _selected={{ bg: 'white', boxShadow: 'sm', rounded:"md" }}>Restrictions</Tab>
                  <Tab className="flex items-center gap-2 data-[selected]:bg-white data-[selected]:shadow-sm rounded-md py-2"
                  _selected={{ bg: 'white', boxShadow: 'sm', rounded:"md" }}>Conditions</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel className="space-y-4" p={0}>
                    {/* Basic Info Tab */}
                    <Box className="space-y-4">
                      <Box className="mb-4">
                        <FormLabel className="block text-sm font-medium text-gray-700">
                          {t(`Bonus`)} {t(`Image`)}
                        </FormLabel>
                        <input
                        type="file"
                        accept="image/*"
                        name="image"
                        id="image"
                        onChange={handleBonusImage}
                        className={`mt-1 p-2 border-dashed border-2 border-gray-300 outline-none rounded-md w-full transition duration-200 ease-in-out focus:border-blue-500`}
                      />
                        {formData?.image && (
                          <img
                            src={formData?.image}
                            alt=""
                            className="mt-2 w-full h-[200px] object-cover rounded-md shadow-md"
                          />
                        )}
                      </Box>
                      <Box className="grid grid-cols-2 gap-4">
                        <Box className="space-y-2">
                          <FormLabel
                            m={0}
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                          >
                            {t(`Bonus Name`)} *
                          </FormLabel>
                          <Input
                            id="name"
                            value={formData.title}
                            onChange={(e) =>
                              setFormData({ ...formData, title: e.target.value })
                            }
                            placeholder="e.g., Welcome Bonus"
                            focusBorderColor="blue.500"
                          />
                        </Box>
                        <Box className="space-y-2">
                          <FormLabel
                            htmlFor="category"
                            className="text-sm font-medium text-gray-700"
                          >
                            {t(`Category`)} *
                          </FormLabel>
                          <Select
                            name="category"
                            value={formData.category}
                            onChange={handleCategory}
                            className="border-gray-300 rounded-md"
                            focusBorderColor="blue.500"
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
                          htmlFor="sub_category"
                          className="text-sm font-medium text-gray-700"
                        >
                          {t(`Sub Category`)} *
                        </FormLabel>
                        <Select
                          name="sub_category"
                          value={formData.sub_category}
                          onChange={handleSubCategory}
                          className="border-gray-300 rounded-md"
                          focusBorderColor="blue.500"
                        >
                          {formData.category === "user_bonus" &&
                            bonusData[0]?.sub_category?.map((item) => (
                              <option value={item}>{formatBonusText(item)}</option>
                            ))}
                          {formData.category === "referral_bonus" &&
                            bonusData[1]?.sub_category?.map((item) => (
                              <option value={item}>{formatBonusText(item)}</option>
                            ))}
                          {formData.category === "deposit_bonus" &&
                            bonusData[2]?.sub_category?.map((item) => (
                              <option value={item}>{formatBonusText(item)}</option>
                            ))}
                          {formData.category === "bet_bonus" &&
                            bonusData[3]?.sub_category?.map((item) => (
                              <option value={item}>{formatBonusText(item)}</option>
                            ))}
                        </Select>
                      </Box>
                      <Box className="space-y-2">
                          <FormLabel
                            htmlFor="category"
                            className="text-sm font-medium text-gray-700"
                          >
                            {t(`Category`)} *
                          </FormLabel>
                          <Select
                            name="reward_type"
                            value={formData.reward_type}
                            onChange={(e) =>
                              setFormData({ ...formData, reward_type: e.target.value })
                            }
                            className="border-gray-300 rounded-md"
                            focusBorderColor="blue.500"
                          >
                              <option value={"percentage"}>
                                {"Percentage"}
                              </option>
                               <option  value={"fixed"}>
                               {"Fixed"}
                             </option>
                          </Select>
                        </Box>
                      </Box>

                      <Box className="grid grid-cols-2 gap-4">
                        <Box className="space-y-2">
                          <FormLabel
                            htmlFor="code"
                            className="text-sm font-medium text-gray-700"
                          >
                            {t(`Bonus Code`)}
                          </FormLabel>
                          <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) =>
                              setFormData({ ...formData, code: e.target.value.toUpperCase() })
                            }
                            placeholder="WELCOME100"
                            className="border-gray-300 rounded-md"
                            focusBorderColor="blue.500"
                          />
                        </Box>
                        <Box className="space-y-2">
                          <FormLabel
                            htmlFor="amount"
                            className="text-sm font-medium text-gray-700"
                          >
                            {t(`Fixed Amount`)} ($)
                          </FormLabel>
                          <Input
                            id="amount"
                            type="number"
                            value={formData.reward_amount}
                            onChange={(e) =>
                              setFormData({ ...formData, reward_amount: e.target.value })
                            }
                            placeholder="100"
                            className="border-gray-300 rounded-md"
                            focusBorderColor="blue.500"
                          />
                        </Box>
                        {formData.category !== "user_bonus" && formData.reward_type === "percentage" && (
                          <Box className="space-y-2">
                            <FormLabel
                              htmlFor="percentage"
                              className="text-sm font-medium text-gray-700"
                            >
                              {t(`Percentage`)} (%)
                            </FormLabel>
                            <Input
                              id="percentage"
                              type="number"
                              value={formData.percentage}
                              onChange={(e) =>
                                setFormData({ ...formData, percentage: e.target.value })
                              }
                              placeholder="100"
                              className="border-gray-300 rounded-md"
                              focusBorderColor="blue.500"
                            />
                          </Box>
                        )}
                      </Box>
                      <Box className="space-y-2">
                        <FormLabel
                          htmlFor="description"
                          className="text-sm font-medium text-gray-700"
                        >
                          {t(`Description`)}
                        </FormLabel>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          placeholder="Describe the bonus terms and conditions"
                          rows={3}
                          className="border-gray-300 rounded-md"
                          focusBorderColor="blue.500"
                        />
                      </Box>
                      {formData.category !== "user_bonus" && formData.reward_type === "percentage" && (
                        <Box className="grid grid-cols-2 gap-4">
                          <Box className="space-y-2">
                            <FormLabel
                              htmlFor="min_reward"
                              className="text-sm font-medium text-gray-700"
                            >
                              {t(`Min Reward`)}
                            </FormLabel>
                            <Input
                              id="min_reward"
                              type="number"
                              value={formData.min_reward}
                              onChange={(e) =>
                                setFormData({ ...formData, min_reward: e.target.value })
                              }
                              placeholder="50"
                              className="border-gray-300 rounded-md"
                              focusBorderColor="blue.500"
                            />
                          </Box>
                          <Box className="space-y-2">
                            <FormLabel
                              htmlFor="max_reward"
                              className="text-sm font-medium text-gray-700"
                            >
                              {t(`Max Reward`)}
                            </FormLabel>
                            <Input
                              id="max_reward"
                              type="number"
                              value={formData.max_reward}
                              onChange={(e) =>
                                setFormData({ ...formData, max_reward: e.target.value })
                              }
                              placeholder="500"
                              className="border-gray-300 rounded-md"
                              focusBorderColor="blue.500"
                            />
                          </Box>
                        </Box>
                      )}
                      {formData.category === "deposit_bonus" && formData.sub_category === "occasion_deposit" && (
                        <Box className="space-y-2">
                          <FormLabel
                            htmlFor="title"
                            className="text-sm font-medium text-gray-700"
                          >
                            {t(`Title`)}
                          </FormLabel>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                              setFormData({ ...formData, title: e.target.value })
                            }
                            placeholder="Ex: Holiday, Christmas"
                            className="border-gray-300 rounded-md"
                            focusBorderColor="blue.500"
                          />
                        </Box>
                      )}
                      <Flex alignItems="center" gap="2">
                        <Switch
                          id="isActive"
                          isChecked={formData.isActive}
                          onChange={(e) =>
                            setFormData({ ...formData, isActive: e.target.checked })
                          }
                          colorScheme="blue"
                        />
                        <FormLabel
                          htmlFor="isActive"
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
                              htmlFor="wager_required"
                              className="text-sm font-medium text-gray-700"
                            >
                              {t(`Wagering Multiplier`)} *
                            </FormLabel>
                            <Box position="relative">
                              <Input
                                id="wager_required"
                                type="number"
                                value={formData.wager_required}
                                onChange={(e) =>
                                  setFormData({ ...formData, wager_required: e.target.value })
                                }
                                placeholder="35"
                                className="border-gray-300 rounded-md"
                                focusBorderColor="blue.500"
                              />
                              <span
                                style={{ backgroundColor: bg }}
                                className="absolute  h-full w-[40px] rounded-r-[6px] right-[0px] font-bold text-white"
                              >
                                <span className="flex justify-center mt-2 items-center text-center">
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
                              htmlFor="maxCashout"
                              className="text-sm font-medium text-gray-700"
                            >
                              {t(`Max Cashout`)} ($)
                            </FormLabel>
                            <Input
                              id="maxCashout"
                              type="number"
                              value={formData.maxCashout}
                              onChange={(e) =>
                                setFormData({ ...formData, maxCashout: e.target.value })
                              }
                              placeholder="1000"
                              className="border-gray-300 rounded-md"
                              focusBorderColor="blue.500"
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
                                value={formData?.wagering_contribution?.slots}
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
                                value={formData?.wagering_contribution?.table_games}
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
                              />
                            </Box>
                            <Box className="space-y-2">
                              <FormLabel
                                m={0}
                                htmlFor="video_poker"
                                className="text-sm font-medium text-gray-700"
                              >
                                {t(`Video Poker`)} (%)
                              </FormLabel>
                              <Input
                                id="video_poker"
                                type="number"
                                value={formData?.wagering_contribution?.video_poker}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    wagering_contribution: {
                                      ...formData.wagering_contribution,
                                      video_poker: e.target.value,
                                    },
                                  })
                                }
                                className="border-gray-300 rounded-md"
                                focusBorderColor="blue.500"
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
                                value={formData?.wagering_contribution?.live_casino}
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
                          htmlFor="validFrom"
                          className="text-sm font-medium text-gray-700"
                        >
                          {t(`Start Date`)}
                        </FormLabel>
                        <Input
                          id="validFrom"
                          type="datetime-local"
                          value={formData.start_date}
                          onChange={(e) =>
                            setFormData({ ...formData, start_date: e.target.value })
                          }
                          className="border-gray-300 rounded-md"
                          focusBorderColor="blue.500"
                        />
                      </Box>
                      <Box className="space-y-2">
                        <FormLabel
                          m={0}
                          htmlFor="validUntil"
                          className="text-sm font-medium text-gray-700"
                        >
                          {t(`End Date`)}
                        </FormLabel>
                        <Input
                          id="validUntil"
                          type="datetime-local"
                          value={formData.end_date}
                          onChange={(e) =>
                            setFormData({ ...formData, end_date: e.target.value })
                          }
                          className="border-gray-300 rounded-md"
                          focusBorderColor="blue.500"
                        />
                      </Box>
                    </Box>
                    <Box className="grid grid-cols-2 gap-4">
                      <Box className="space-y-2">
                        <FormLabel
                          m={0}
                          htmlFor="usageLimit"
                          className="text-sm font-medium text-gray-700"
                        >
                          {t(`Total Usage Limit`)}
                        </FormLabel>
                        <Input
                          id="usageLimit"
                          type="number"
                          value={formData.usageLimit}
                          onChange={(e) =>
                            setFormData({ ...formData, usageLimit: e.target.value })
                          }
                          placeholder="1000"
                          className="border-gray-300 rounded-md"
                          focusBorderColor="blue.500"
                        />
                      </Box>
                      <Box className="space-y-2">
                        <FormLabel
                          m={0}
                          htmlFor="perUserLimit"
                          className="text-sm font-medium text-gray-700"
                        >
                          {t(`Per User Limit`)}
                        </FormLabel>
                        <Input
                          id="perUserLimit"
                          type="number"
                          placeholder="100"
                          value={formData.perUserLimit}
                          onChange={(e) =>
                            setFormData({ ...formData, perUserLimit: e.target.value })
                          }
                          className="border-gray-300 rounded-md"
                          focusBorderColor="blue.500"
                        />
                      </Box>
                    </Box>
                    <Box className="space-y-2">
                      <FormLabel
                        m={0}
                        htmlFor="expary_in"
                        className="text-sm font-medium text-gray-700"
                      >
                        {t(`Expiry In`)}
                      </FormLabel>
                      <Input
                        id="expary_in"
                        type="number"
                        value={formData.expary_in}
                        onChange={(e) =>
                          setFormData({ ...formData, expary_in: e.target.value })
                        }
                        placeholder="Enter 1 to 30 Days"
                        min={1}
                        max={30}
                        className="border-gray-300 rounded-md"
                        focusBorderColor="blue.500"
                      />
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
                              value={formData?.eligibleGames?.join('\n')}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  eligibleGames: e.target.value.split('\n').filter(Boolean),
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
                              value={formData?.eligibleProviders?.join('\n')}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  eligibleProviders: e.target.value.split('\n').filter(Boolean),
                                })
                              }
                              className="border-gray-300 rounded-md"
                              focusBorderColor="blue.500"
                            />
                          </Box>
                        </Box>
                        <Box className="space-y-2 mt-4">
                          <FormLabel
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
              {id === 1 ? (
                <Button
                  type="submit"
                  color={"white"}
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
                  color={"white"}
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

export default AddNewContribution;