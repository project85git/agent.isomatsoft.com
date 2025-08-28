import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchGetRequest, sendPatchRequest, sendPostRequest } from "../api/api";
import {
  FormControl,
  FormLabel,
  Switch,
  useToast,
  Button,
  Box,
  Image,
  Spinner,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { checkPermission } from "../../utils/utils";
import LayerManage from "../pages/LayerManage";
import LoadingSpinner from "./loading/LoadingSpinner";

const AdminLayerLogoSignup = () => {
  const {
    bg,
  } = useSelector((state) => state.theme);
  const [logoBannerData, setLogoBannerData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null); // For full image modal
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const [marqueeText, setMarqueeText] = useState(""); // State for marquee text
  const [formData, setFormData] = useState({
    is_auto_payment_enabled: false,
    is_bonus_enabled: false,
    is_vip_enabled: false,
    is_manual_payment_enabled: false,
    is_signup_enabled:false
  });
  const user = useSelector((state) => state.authReducer);
  const isOwnerAdmin =
    user?.user?.role_type === import.meta.env.VITE_ROLE_SUPER;
  const permissionDetails = user?.user?.permissions;
  const hasPermission = checkPermission(permissionDetails, "logoBannerManage");
  const canEdit = isOwnerAdmin || hasPermission;
  const { t } = useTranslation();

  const settings = [
    { name: "is_signup_enabled", label: "Enable/Disable Signup", type: "switch" },
    { name: "is_auto_payment_enabled", label: "Enable Auto Payment", type: "switch" },
    { name: "is_manual_payment_enabled", label: "Enable Manual Payment", type: "switch" },
    { name: "is_bonus_enabled", label: "Enable Bonus", type: "switch" },
    { name: "is_vip_enabled", label: "Enable VIP Features", type: "switch" },
  ];

  const handleImageUpload = async (file, field) => {
    setImageLoading((prev) => ({ ...prev, [field]: true }));
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
        if (field !== "carousels") {
          setLogoBannerData((prev) => ({ ...prev, [field]: response.url }));
        } else {
          setLogoBannerData((prev) => ({
            ...prev,
            [field]: [...prev[field], response.url],
          }));
        }
      }
    } catch (error) {
      toast({
        title: "Error uploading image",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setImageLoading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleFileChange = async (event, field) => {
    const file = event.target.files[0];
    await handleImageUpload(file, field);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const getSettingData = async () => {
    setLoading(true);
    try {
      const response = await fetchGetRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/setting/get-setting/6532c132ed5efb8183a66703`
      );
      setLogoBannerData(response.data);
      setMarqueeText(response.data.marque || ""); // Set initial marquee text
     setFormData({is_auto_payment_enabled: response.data.is_auto_payment_enabled,
      is_bonus_enabled: response.data.is_bonus_enabled,
      is_vip_enabled: response.data.is_vip_enabled,
      is_manual_payment_enabled: response.data.is_manual_payment_enabled,
      is_signup_enabled:response.data.is_signup_enabled
     })
    } catch (error) {
      console.error("Error fetching settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    // Update the state dynamically based on the checkbox name
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleUpdate = async () => {
    setUpdateLoading(true);
    const payload = {
      ...logoBannerData,
      ...formData,
      marque: marqueeText, // Include updated marquee text in the payload
    };

    try {
      await sendPatchRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/setting/update-setting/6532c132ed5efb8183a66703`,
        payload
      );
      toast({
        description: "Updated Successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      getSettingData();
    } catch (error) {
      toast({
        description: "Error updating data",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    getSettingData();
  }, []);

  if (loading)
    return (
      <center style={{ height: '60vh' ,display:"flex", justifyContent:"center", alignItems:"center"}}>
      <LoadingSpinner thickness={3} size={"lg"} />
    </center>
    );
  return (
    <>
      <Box bg={"white"} p={6} mr={2} borderRadius="md" boxShadow="lg">
        <Flex direction="column" gap={4}>
          {/* Logos Section */}
          <Flex direction={{ base: "column", md: "row" }} wrap={"wrap"} gap={6}>
            <ImageUploader
              title={t("Admin Logo")}
              src={logoBannerData?.logo}
              onChange={(e) => handleFileChange(e, "logo")}
              isLoading={imageLoading.logo}
              canEdit={canEdit}
            />

            <ImageUploader
              title={t("Admin Favicon")}
              src={logoBannerData?.fav_icon}
              onChange={(e) => handleFileChange(e, "fav_icon")}
              isLoading={imageLoading.fav_icon}
              canEdit={canEdit}
            />
          </Flex>

          {/* Four Checkboxes */}
          <Box mt={4}>
      <Flex direction="column" gap={2} >
        {settings.map((setting) => (
          <FormControl display="flex" border={`1px solid ${bg}60`}  p={"6px"} rounded="md" alignItems="center" justifyContent={"space-between"} key={setting.name}>
            <FormLabel htmlFor={setting.name} mb="0" width="auto" fontSize={"14px"} minWidth="200px">
              {setting.label}
            </FormLabel>
            {/* Render Switch for each setting */}
              <Switch
                id={setting.name}
                name={setting.name}
                isChecked={formData[setting.name]}
                onChange={handleToggle}
                sx={{
                  // Custom styles to make the switch black
                  '.chakra-switch__thumb': {
                    backgroundColor: 'white', // thumb color
                  },
                  // Optional: focus and checked state customization
                  _focus: {
                    boxShadow: '0 0 0 1px #000', // focus outline
                  },
                  _checked: {
                    '.chakra-switch__track': {
                      backgroundColor: bg, // track color when checked
                    },
                    '.chakra-switch__thumb': {
                      backgroundColor: 'white', // thumb color when checked
                    },
                  },
                }}
              />
   
          </FormControl>
        ))}
      </Flex>
    </Box>


          {/* Update Button */}
          {canEdit && (
            <Button
              isLoading={updateLoading}
              onClick={handleUpdate}
              bg={bg}
              color="white"
              alignSelf="flex-end"
              mt={4}
            >
              {t("Update Settings")}
            </Button>
          )}
        </Flex>

        {/* Full-Size Image Modal */}
        {selectedImage && (
          <Modal isOpen={true} onClose={closeModal} size="3xl">
            <ModalOverlay />
            <ModalContent m={3}>
              <ModalHeader py={2}>{t("Image View")}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Image
                  src={selectedImage}
                  alt="Full Image"
                  objectFit="contain"
                  w="full"
                  className="rounded-md mb-3"
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </Box>
      <LayerManage />
    </>
  );
};

const ImageUploader = ({ title, src, onChange, isLoading, canEdit }) => {
  const {
    secondaryBg,
  } = useSelector((state) => state.theme);
  return (
    <Box
      textAlign="center"
      borderWidth="1px"
      style={{ backgroundColor: secondaryBg }}
      borderRadius="md"
      p={4}
    >
      <Text mb={2}>{title}</Text>
      <Box position="relative" minHeight="100px">
        {isLoading ? (
          <Spinner />
        ) : (
          src && (
            <Image
              src={src}
              alt={title}
              boxSize="100px"
              objectFit="contain"
              mx="auto"
            />
          )
        )}
      </Box>
      {canEdit && (
        <div className="w-[200px]">
          <label className="cursor-pointer flex items-center justify-center w-full border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-100 px-2 py-1 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={onChange}
              className="hidden"
            />
            <span className="text-gray-700">Upload Image</span>
          </label>
        </div>
      )}
    </Box>
  );
};

export default AdminLayerLogoSignup;