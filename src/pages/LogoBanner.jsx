import React, { useEffect, useRef, useState } from 'react';
import { LuImport } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import Carousel from '../component/Carousel';
import { fetchGetRequest, sendPatchRequest, sendPostRequest } from '../api/api';
import {
  FormControl, FormLabel, Switch, useToast, Button, Box, Image, Spinner, Stack, Text, Input, Heading, Flex, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  VStack,
  HStack,
  ModalFooter,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaTrash } from 'react-icons/fa';
import { checkPermission } from '../../utils/utils';
import LayerManage from './LayerManage';
import { BsEye } from 'react-icons/bs';
import { RiEdit2Fill } from 'react-icons/ri';

const LogoBanner = () => {
  const { secondaryBg, bg, text } = useSelector(state => state.theme);
  const [logoBannerData, setLogoBannerData] = useState({});
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const [isSignupEnabled, setIsSignupEnabled] = useState(false);
  const [marqueeText, setMarqueeText] = useState(''); // State for marquee text
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [formData, setFormData] = useState({
    image: '',
    button_text:'',
    redirect:'',
    bg:'white',
    color:'black',
  });
  const fileInputRef = useRef(null);
  const { t } = useTranslation();

  const handleImportClick = () => {
    fileInputRef.current.click(); // Trigger click event on file input
  };

  const handleImageUpload = async (file, field) => {
    setImageLoading(prev => ({ ...prev, [field]: true }));
    const formData = new FormData();
    formData.append('post_img', file);

    try {
      const response = await sendPostRequest(
        `${import.meta.env.VITE_API_URL}/api/payment/image-url`,
        formData
      );
      if (response.url) {

        toast({
          title: 'Image uploaded successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        if(field!=="carousels"){
        setLogoBannerData(prev => ({ ...prev, [field]: response.url }));
      }else {
        const newCarouselData = {
          image:response?.url||'',
          button_text:'',
          redirect:'',
          bg:'white',
          color:'black',
        }
        setLogoBannerData(prev => ({ ...prev, carousel_data:[...prev.carousel_data,newCarouselData]}));
      }
      }
    } catch (error) {
      toast({
        title: 'Error uploading image',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }finally{
      setImageLoading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleFileChange = async (event, field) => {
    const file = event.target.files[0];
    await handleImageUpload(file, field);
  };

  const handleCarouselImage = async (event) => {
    const file = event.target.files[0];
    const newImage = await handleImageUpload(file, 'carousels');
  };

  // Delete carousel image
  const handleDeleteCarouselImage = (index) => {
    const updatedCarousels = [...logoBannerData.carousel_data];
    updatedCarousels.splice(index, 1); // Remove image at the specific index
    setLogoBannerData(prev => ({ ...prev, carousel_data: updatedCarousels }));
  };

  // View full-size image in modal
  const handleImageClick = (selectedItem, index) => {
    setShowModal(true);
    setFormData({
      image: selectedItem?.image || '',
      button_text: selectedItem?.button_text||'',
      redirect:selectedItem?.redirect || '',
      bg: selectedItem?.bg || 'white',
      color: selectedItem?.color||'black',
    });
    setSelectedIndex(index)
  };

  const closeModal = () => {
    setFormData({
      image: '',
      button_text: '',
      redirect: '',
      bg: 'white',
      color: 'black',
    });
    setShowModal(false);
  };



  const getSettingData = async () => {
    setLoading(true);
    try {
      const response = await fetchGetRequest(`${import.meta.env.VITE_API_URL}/api/setting/get-setting/6532c132ed5efb8183a66703`);
      setLogoBannerData(response.data);
      setMarqueeText(response.data.marque || ''); // Set initial marquee text
      setIsSignupEnabled(response.data.is_signup_enabled || false);
    } catch (error) {
      console.error('Error fetching settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const payload = { 
      ...logoBannerData, 
      is_signup_enabled: isSignupEnabled,
      marque: marqueeText // Include updated marquee text in the payload
    };
    delete payload._id;
    setUpdateLoading(true);
    try {
      await sendPatchRequest(`${import.meta.env.VITE_API_URL}/api/setting/update-setting/6532c132ed5efb8183a66703`, payload);
      toast({
        description: 'Updated Successfully',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      getSettingData();
    } catch (error) {
      toast({
        description: 'Error updating data',
        status: 'error',
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
  
  const user = useSelector(state => state.authReducer);
  const isOwnerAdmin = user?.user?.role_type === import.meta.env.VITE_ROLE_SUPER;
  const permissionDetails = user?.user?.permissions;
  const hasPermission = checkPermission(permissionDetails, 'logoBannerManage');
  const canEdit = isOwnerAdmin || hasPermission;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const updatedCarouselData = [...logoBannerData.carousel_data];
    updatedCarouselData[selectedIndex]=formData;
    setLogoBannerData(prev => ({ ...prev, carousel_data: updatedCarouselData }));
    closeModal();
  };

  return (
    <>
    <Box bg={"white"} p={6} mr={2} borderRadius="md" boxShadow="lg">
      <Flex direction="column" gap={4}>
        <Flex justify="space-between" align="center" mb={2}>
          <Heading as="h2" fontSize="2xl" color={text}>
            {t('Promotion Poster')}
          </Heading>
          {canEdit && (
            <Button leftIcon={<LuImport />} onClick={handleImportClick} bg={bg} color="white">
              {t('Import')}
            </Button>
          )}
        </Flex>

        {/* Marquee Text */}
        <FormControl mb={6}>
          <FormLabel>{t('Marquee Text')}</FormLabel>
          <Input 
            value={marqueeText} 
            onChange={(e) => setMarqueeText(e.target.value)} 
            placeholder="Enter marquee text..."
          />
        </FormControl>
        <Box mb={2} p={4} bg={secondaryBg} borderRadius="md" overflow="hidden">
          <marquee style={{ color: text, fontSize: '1.2rem' }}>
            {marqueeText || 'Default marquee text goes here...'}
          </marquee>
        </Box>

        {/* Carousel Section */}
        <Box mb={6}>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleCarouselImage} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
            {logoBannerData?.carousel_data?.map((image, index) => (
              <Box key={index} position="relative" borderWidth="1px" borderRadius="md" overflow="hidden">
                <Image src={image.image} width={"100%"} height={"120px"} objectFit="cover" cursor="pointer" />
                {canEdit && (
                  <IconButton
                    position="absolute"
                    top="2"
                    right="2"
                    colorScheme="red"
                    icon={<FaTrash />}
                    size="sm"
                    onClick={() => handleDeleteCarouselImage(index)}
                    aria-label="Delete image"
                  />
                )}

               {canEdit && (
                  <IconButton
                    position="absolute"
                    top="2"
                    right="12"
                    style={{backgroundColor:bg, color:"white"}}
                    icon={<RiEdit2Fill size={"18px"} fontWeight={"600"}/>}
                    size="sm"
                    onClick={() => handleImageClick(image, index)}
                    aria-label="Delete image"
                  />
                )}

              </Box>
            ))}
          </div>
        </Box>

        {/* Logos Section */}
        <Flex direction={{ base: 'column', md: 'row' }} wrap={"wrap"} gap={6}>
        
          <ImageUploader
            title={t('Website Logo')}
            src={logoBannerData?.site_logo}
            onChange={(e) => handleFileChange(e, 'site_logo')}
            isLoading={imageLoading.site_logo}
            canEdit={canEdit}
          />
          <ImageUploader
            title={t('Website Favicon')}
            src={logoBannerData?.site_fav_icon}
            onChange={(e) => handleFileChange(e, 'site_fav_icon')}
            isLoading={imageLoading.site_fav_icon}
            canEdit={canEdit}
          />
          <ImageUploader
            title={t('Site Logo Mobile')}
            src={logoBannerData?.site_logo_mobile}
            onChange={(e) => handleFileChange(e, 'site_logo_mobile')}
            isLoading={imageLoading.site_logo_mobile}
            canEdit={canEdit}
          />

        </Flex>

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
            {t('Update Settings')}
          </Button>
        )}
      </Flex>

      {/* Full-Size Image Modal */}
      {showModal && (
      <Modal isOpen={true} onClose={closeModal} size="3xl">
        <ModalOverlay />
        <ModalContent m={3}>
          <ModalHeader py={2}>Image View</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Image src={formData?.image} alt="Full Image" height={"240px"} w="100%" className="rounded-md mb-3" />
              <FormControl>
                <FormLabel>Button Text</FormLabel>
                <Input
                  name="button_text"
                  value={formData?.button_text}
                  onChange={handleInputChange}
                  placeholder="Enter button text"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Redirect URL</FormLabel>
                <Input
                  type="url"
                  name="redirect"
                  value={formData?.redirect}
                  onChange={handleInputChange}
                  placeholder="Enter redirect URL"
                />
              </FormControl>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Background Color</FormLabel>
                  <Input
                    type="color"
                    name="bg"
                    value={formData?.bg}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Text Color</FormLabel>
                  <Input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>)}
    </Box>
    </>
  );
};

const ImageUploader = ({ title, src, onChange, isLoading, canEdit }) => 
{
 const { color, primaryBg, iconColor, secondaryBg, bg, hoverColor, hover, text, font, border } = useSelector(state => state.theme);
  return (<Box textAlign="center" borderWidth="1px" style={{backgroundColor:secondaryBg}} borderRadius="md" p={4}>
    <Text mb={2}>{title}</Text>
    <Box position="relative" minHeight="100px">
      {isLoading ? (
        <Spinner />
      ) : (
        src && <Image src={src} alt={title} boxSize="100px" objectFit="contain" mx="auto" />
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
          <span className="text-gray-700">
            Upload Image
          </span>
        </label>
      </div>
    )}
  </Box>
)
}

export default LogoBanner;
