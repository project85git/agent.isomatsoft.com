import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Button,
  useToast,
} from "@chakra-ui/react";
import { IoClose, IoCopyOutline, IoInformationCircleOutline } from "react-icons/io5";
import { Tooltip } from "@chakra-ui/react";
const DescriptionModal = ({ isOpen, onClose, description, user }) => {
    const toast = useToast();
  
    const handleCopy = () => {
      if (description) {
        navigator.clipboard.writeText(description);
        toast({
          title: "Successfully copied to clipboard",
          description: "Description has been copied",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    };
  
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "full", md: "2xl" }}
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay className="backdrop-blur-sm" />
        <ModalContent className="mx-4 sm:mx-auto my-4 rounded-xl max-w-2xl bg-white shadow-xl">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                User Information & Full Description
              </h2>
              <div
                onClick={onClose}
                className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <IoClose className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>
  
          {/* Body */}
          <div className="px-6 py-4 max-h-[calc(100vh-200px)] md:max-h-[60vh] overflow-y-auto">
            {/* User Details */}
            <div className="mb-4 bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-700">
                User Details
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Username:</strong> {"user"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {"user"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Role:</strong> {"user"}
              </p>
              {/* Add more user details as required */}
            </div>
  
            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-6">
              {description ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                  {description}
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <IoInformationCircleOutline className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-sm">No description available</p>
                </div>
              )}
            </div>
          </div>
  
          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end items-center space-x-3">
            <Tooltip title="Copy to clipboard" className="hidden md:block">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="inline-flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={!description}
              >
                <IoCopyOutline className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </Tooltip>
  
            {/* Mobile-optimized copy button */}
  
            <Button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Close
            </Button>
          </div>
        </ModalContent>
      </Modal>
    );
  };

  
  export default DescriptionModal;