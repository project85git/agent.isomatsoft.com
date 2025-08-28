import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  FormControl,
  FormLabel,
  Switch,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchGetRequest, sendPatchRequest } from "../api/api";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function AdminPermissionSetting({ permissionsData }) {
  const { primaryBg, bg, border,secondaryBg } = useSelector((state) => state.theme);
  const toast = useToast();
  const { t } = useTranslation();
  const [allRoleTypes, setAllRoleTypes] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [ownerPermissions, setOwnerPermissions] = useState([]);
  const [activeRole, setActiveRole] = useState("admin"); // Default to "owner"
  const [defaultOwnerPermissions, setDefaultOwnerPermissions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [loading, setLoading] = useState(false); // Loading state during API call

  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const ownerResponse = await fetchGetRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/permission/get-owner-permission-setting`
      );

      const allResponse = await fetchGetRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/permission/get-all-permission-setting`
      );

      const ownerPermissions = ownerResponse.data?.permissions || [];
      const allPermissions = allResponse.data[0]?.permissions || [];

      const updatedOwnerPermissions = ownerPermissions.map((ownerPerm) => {
        const isPermissionMatched = allPermissions.some(
          (allPerm) => allPerm.name === ownerPerm.name
        );
        return { ...ownerPerm, value: isPermissionMatched };
      });

      setPermissions(allResponse.data || []);
      setDefaultOwnerPermissions(ownerPermissions);
      setOwnerPermissions(convertToGroup(updatedOwnerPermissions));
      setAllRoleTypes(allResponse.data.map((ele) => ele.role_type));
      setLoading(false);
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

  useEffect(() => {
    if (permissions.length > 0) {
      const filteredPermissions = permissions.find(
        (ele) => ele.role_type === activeRole
      )?.permissions;

      const updatedOwnerPermissions = defaultOwnerPermissions.map(
        (ownerPerm) => {
          const isPermissionMatched = filteredPermissions?.some(
            (allPerm) => allPerm.name === ownerPerm.name
          );
          return { ...ownerPerm, value: isPermissionMatched };
        }
      );

      setOwnerPermissions(convertToGroup(updatedOwnerPermissions));
    }
  }, [activeRole]);

  const convertToGroup = (permissions) => {
    const groupedPermissions = {};
    permissions.forEach((permission) => {
      const groupName = getGroupName(permission.name);
      if (!groupedPermissions[groupName]) {
        groupedPermissions[groupName] = [];
      }
      groupedPermissions[groupName].push(permission);
    });
    return groupedPermissions;
  };

  const getGroupName = (permissionName) => {
    const lowerCaseName = permissionName.toLowerCase();

    if (lowerCaseName.includes("user")) return "User Management";
    if (lowerCaseName.includes("admin")) return "Admin Management";
    if (lowerCaseName.includes("sport")) return "Sports Management";
    if (lowerCaseName.includes("deposit")) return "Deposit Management";
    if (lowerCaseName.includes("withdraw")) return "Withdrawal Management";
    if (lowerCaseName.includes("transaction")) return "Transaction Management";
    if (lowerCaseName.includes("bet")) return "Bet Management";
    if (lowerCaseName.includes("reportview")) return "Reports Management";
    if (lowerCaseName.includes("generateamount")) return "Amount Management";
    if (lowerCaseName.includes("bonus")) return "Bonus Management";
    if (
      lowerCaseName.includes("socialmedia") ||
      lowerCaseName.includes("logobanner") ||
      lowerCaseName.includes("footercontent") ||
      lowerCaseName.includes("seo") ||
      lowerCaseName.includes("layermanage")
    )
      return "Content Management";
    if (lowerCaseName.includes("site")) return "Site Management";
    if (lowerCaseName.includes("provider")) return "Provider Management";
    if (lowerCaseName.includes("game")) return "Game Management";
    if (lowerCaseName.includes("permission")) return "Permission Management";
    if (lowerCaseName.includes("supportticket")) return "Support Management";

    return "Other";
  };

  const toggleOwnerPermission = (permissionName) => {
    setOwnerPermissions((prevGroupedPermissions) => {
      const updatedPermissions = { ...prevGroupedPermissions };
      Object.keys(updatedPermissions).forEach((groupName) => {
        updatedPermissions[groupName] = updatedPermissions[groupName].map(
          (permission) =>
            permission.name === permissionName
              ? { ...permission, value: !permission.value }
              : permission
        );
      });
      return updatedPermissions;
    });
  };

  const saveChanges = async () => {
    // Step 2: Update the active role's permissions to match the `true` permissions of the 'owner'
    const updatedData = [];

    // Filter out the permissions with value === true from ownerPermissions
    Object.entries(ownerPermissions).forEach(([groupName, permissions]) => {
      updatedData.push(...permissions.filter((ele) => ele.value));
    });
    const payload = { role_type: activeRole, permissions: updatedData };
    setLoading(true);
    try {
      await sendPatchRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/permission/update-permission-setting`,
        payload
      );
      toast({
        description: t("Permissions updated successfully"),
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    } catch (error) {
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    } finally {
      closeModal()
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  if (loading)
    return (
      <center style={{ height: '60vh' ,display:"flex", justifyContent:"center", alignItems:"center"}}>
      <LoadingSpinner thickness={3} size={"lg"} />
    </center>
    );

  return (
    <div className="p-4">
      <Tabs>
      <TabList className="flex space-x-2 p-3 bg-white rounded-md shadow-sm overflow-x-auto scrollbar-hide">
  {allRoleTypes.map((role) => (
    <Tab
      key={role}
      onClick={() => setActiveRole(role)}
      className="px-4 py-1 text-sm font-semibold cursor-pointer rounded-md"
      _selected={{
        color: "black", // Text color on active tab
        borderBottom: `3px solid ${bg}`, // Green underline on active tab
        transition: "border-bottom 0.3s ease", // Smooth underline transition
      }}
      _focus={{
        boxShadow: "none", // Remove focus ring if you want
      }}
      _hover={{
        borderBottom: `3px solid ${bg}`, // Green underline on hover
        transition: "border-bottom 0.3s ease", // Smooth transition for the bottom line
      }}
    >
      {t(role)}
    </Tab>
  ))}
      </TabList>
        <TabPanels>
          {Object.entries(ownerPermissions).map(([groupName, permissions]) => (
            <div key={groupName} className="mt-4">
              <p className="text-md font-bold">{groupName}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {permissions.map((permission) => (
                  <FormControl
                    key={permission.name}
                    display="flex"
                    alignItems="center"
                    bg="white"
                    p="2"
                    rounded="lg"
                    justifyContent={"space-between"}
                  >
                    <FormLabel style={{fontSize:"14px"}} margin={"0"}>{t(permission.name)}</FormLabel>
                    <Switch
                    isChecked={permission.value}
                    onChange={() => toggleOwnerPermission(permission.name)}
                    colorScheme="gray" // default color scheme
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
              </div>
            </div>
          ))}
        </TabPanels>
      </Tabs>
      <Button
        onClick={openModal}
        style={{ backgroundColor: bg, color: "white" }}
        isLoading={loading}
        mt="4"
        className="text-center"
        w="40"
        display={"flex"}
      >
        {t("Save Changes")}
      </Button>
      <ConfirmationModal
        isOpen={isModalOpen} // Controls modal visibility
        onClose={closeModal} // Close function
        onConfirm={saveChanges} // Save function
        loading={loading} // Show loading state on confirm button
      />

    </div>
  );
}

export default AdminPermissionSetting;


const ConfirmationModal = ({ isOpen, onClose, onConfirm, loading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Changes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            Are you sure you want to save the changes? This action cannot be undone.
          </div>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="green"
            onClick={onConfirm}
            isLoading={loading}
            ml={3}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};