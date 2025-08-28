import React, { useState, useEffect } from "react";
import {
  fetchGetRequest,
  sendPatchRequest,
  sendPostRequest,
} from "../../api/api";
import {
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../loading/LoadingSpinner";
import { MdOutlineImageNotSupported } from "react-icons/md";

const placeholderImage = "URL_OF_PLACEHOLDER_IMAGE"; // Replace with the actual URL of your placeholder image

const KYCDocument = ({ userData }) => {
  const [kycData, setKycData] = useState({
    id_proof: "",
    pass_proof: "",
    residence_proof: "",
    selfie: "",
  });
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [loaderActive, setLoaderActive] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
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

  const getKycData = async () => {
    setLoading(true);
    try {
      const response = await fetchGetRequest(
        `${import.meta.env.VITE_API_URL}/api/admin/get-document-details/${
          userData.user_id
        }`
      );
      setKycData(response.data);
    } catch (error) {
      console.error("Error fetching KYC data:", error.message);
      toast({
        title: "Error fetching KYC data",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateKycData = async () => {
    setUpdateLoading(true);
    try {
      const response = await sendPatchRequest(
        `${import.meta.env.VITE_API_URL}/api/admin/update-document-details/${
          userData.user_id
        }`,
        kycData
      );
      setKycData(response.data);
      toast({
        title: response.message,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating KYC data:", error.message);
      toast({
        title: "Error updating KYC data",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    getKycData();
  }, []);

  const handleImageUpload = async (file, field) => {
    setLoaderActive(field);
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
        setKycData((prevData) => ({ ...prevData, [field]: response.url }));
      }
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({
        title: "Error uploading image",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setLoaderActive(null);
    }
  };

  const handleImageChange = (event, field) => {
    const file = event.target.files[0];
    handleImageUpload(file, field);
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  return (
    <div className="flex flex-col">
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {["id_proof", "pass_proof", "residence_proof", "selfie"].map(
            (field, index) => (
              <div
                style={{
                  border: `1px solid ${border}60`,
                  backgroundColor: primaryBg,
                }}
                key={index}
                className="border p-5 rounded-md h-96 text-center shadow-lg hover:shadow-2xl transition-shadow duration-200 ease-in-out flex flex-col justify-between"
              >
                <label htmlFor={field} className="block mb-2 font-bold">
                  {field.replace("_", " ").toUpperCase()}
                </label>
                <input
                  type="file"
                  id={field}
                  onChange={(e) => handleImageChange(e, field)}
                  disabled={loaderActive === field}
                  className="mb-2"
                />
                <div className="mt-2 flex-grow flex items-center justify-center flex-col">
                  {kycData[field] ? (
                    <img
                      src={kycData[field] || placeholderImage}
                      alt={`${field} preview`}
                      className="w-full h-92 p-3 object-cover rounded-md cursor-pointer"
                      onClick={() =>
                        openModal(kycData[field] || placeholderImage)
                      }
                    />
                  ) : (
                    <div className="flex flex-col justify-center gap-2 items-center">
                      <MdOutlineImageNotSupported size={"36px"} />
                      <p className="text-gray-500 mt-2">No image uploaded</p>
                    </div>
                  )}
                </div>
                {loaderActive === field && <p>Uploading...</p>}
              </div>
            )
          )}
        </div>
      )}
      {!loading && (
        <div
          onClick={() => updateKycData()}
          className={` ${
            updateLoading ? "pointer-events-none" : "cursor-pointer"
          } flex justify-center mt-4 w-full`}
        >
          <button
            disabled={updateLoading}
            style={{
              border: `1px solid ${border}60`,
              backgroundColor: bg,
              color: "white",
            }}
            className={`w-[100%] text-center flex justify-center rounded-md p-2`}
          >
            {updateLoading ? <LoadingSpinner /> : "Update"}
          </button>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Image Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={selectedImage} alt="Selected" className="w-full h-80" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default KYCDocument;
