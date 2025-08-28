import React, { useState, useEffect } from "react";
import { Box, Text, Button, Flex, Spinner, useToast, CircularProgress, Input } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import { fetchGetRequest, sendPatchRequest } from "../api/api";
import { useTranslation } from "react-i18next";

// Role List Component
const RoleList = ({ roles, moveRole, type, updateLabel }) => {
  const { border, bg } = useSelector((state) => state.theme);
  return (
    <Box
      style={{ border: `1px solid ${border}60` }}
      p={4}
      borderRadius="md"
      className="bg-gray-50 shadow-md"
      flex="1"
      minHeight="540px"
    >
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        {type === "available" ? "Available Levels" : "Assigned Levels"}
      </Text>
      {roles.length === 0 ? (
        <Text className="text-center">No roles available</Text>
      ) : (
        roles.map((role) => (
          <Box
            key={role.id}
            p={2}
            mb={2}
            style={{ border: `1px solid ${border}60` }}
            borderRadius="md"
            className="text-sm flex justify-between items-center"
          >
            <Flex direction="column" flex="1">
              <Text>{role.name} ({role.id})</Text>
              {type === "assigned" && (
                <Input
                  style={{ border: `1px solid ${border}60`, outline:"none" }}
                  size="md"
                  mt={2}
                  w={"40%"}
                  placeholder="Enter label"
                  value={role.label || ""}
                  onChange={(e) => updateLabel(role.id, e.target.value)}
                />
              )}
            </Flex>
            <Button
              size="xs"
              style={{ backgroundColor: bg }}
              onClick={() => moveRole(role)}
              textColor={"white"}
            >
              {type === "available" ? "Assign" : "Remove"}
            </Button>
          </Box>
        ))
      )}
    </Box>
  );
};

// RoleSwitch Component
const RoleSwitchComponent = ({ adminId  }) => {
  const [roles, setRoles] = useState([]);
  const [assignedRoles, setAssignedRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const toast = useToast();
  const { border, bg } = useSelector((state) => state.theme);
  const { t } = useTranslation();

  useEffect(() => {
    fetchLevels();
  }, [adminId]);

  // Fetch levels for the admin
  const fetchLevels = async () => {
    try {
      setLoading(true);
      const response = await fetchGetRequest(
        `${import.meta.env.VITE_API_URL}/api/level/get-level-by-admin/${adminId}`
      );
      const response1 = await fetchGetRequest(
        `${import.meta.env.VITE_API_URL}/api/level/get-owner-level`
      );
      setAssignedRoles(response.data.levels || []);
      setRoles(response1.data.levels);
    } catch (error) {
      console.error("Error fetching levels:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update label for assigned role
  const updateLabel = (roleId, label) => {
    setAssignedRoles(
      assignedRoles.map((role) =>
        role.id === roleId ? { ...role, label } : role
      )
    );
  };

  // Move role from available to assigned or vice versa
  const moveRole = (role) => {
    if (!assignedRoles.some((r) => r.id === role.id)) {
      setAssignedRoles([...assignedRoles, { ...role, label: "" }]);
    } else {
      setAssignedRoles(assignedRoles.filter((r) => r.id !== role.id));
    }
  };

  // Save updated levels
  const updateLevels = async () => {
    try {
      setUpdateLoading(true);
      const response = await sendPatchRequest(
        `${import.meta.env.VITE_API_URL}/api/level/update-level-by-admin`,
        {
          admin_id: adminId,
          levels: assignedRoles.map(({ id, label, name }) => ({ id, label, name })), // Send only id and label
        }
      );
      toast({
        title: "Success",
        description: response.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setUpdateLoading(false);
    } catch (error) {
      setUpdateLoading(false);
      console.error("Error updating levels:", error);
      toast({
        title: "Error",
        description: "Failed to update levels",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction="column" align="center" width="100%">
      <Flex direction="row" justify="space-between" width="100%" py={4} gap={2}>
        <RoleList roles={roles} moveRole={moveRole} type="available" />
        <RoleList
          roles={assignedRoles}
          moveRole={moveRole}
          type="assigned"
          updateLabel={updateLabel}
        />
      </Flex>
      <div className="w-[100%] mb-10 m-auto">
        <button
          onClick={updateLevels}
          disabled={updateLoading}
          style={{ backgroundColor: bg }}
          className={`p-3 text-white text-xs font-semibold w-[100%] rounded-[5px]`}
        >
          {updateLoading ? (
            <CircularProgress size={"15px"} />
          ) : (
            `${t(`Save`)} ${t(`Changes`)}`
          )}
        </button>
      </div>
    </Flex>
  );
};

export default RoleSwitchComponent;