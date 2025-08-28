import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  Box,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaUsers, FaDollarSign, FaPlus } from "react-icons/fa";
import { bonusTypes } from "./data/bonusTypes";
import { fetchGetRequest } from "../../api/api";
import AddOrUpdateBonus from "./AddOrUpdateNewBonus";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const BonusesTable = ({ userBonuses }) => {
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBonus, setSelectedBonus] = useState(null);
  const [openType, setOpenType] = useState(null);
  const toast = useToast();
  const { t } = useTranslation();

  const { iconColor, bg } = useSelector((state) => state.theme);
  const handleSelectedBonus = (data) => {
    setSelectedBonus(data);
    setOpenType("EDIT");
  };

  useEffect(() => {
    getAllBonuses();
  }, []);

  const getAllBonuses = async () => {
    try {
      setLoading(true);
      const response = await fetchGetRequest(
        `${import.meta.env.VITE_API_URL}/api/bonus/get-all-bonus`
      );
      setBonuses(response.data || []);
    } catch (error) {
      toast({
        description: error?.data?.message || error?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getBonusStats = (bonusId) => {
    const bonusUsages =
      userBonuses?.filter((ub) => ub.bonus_id === bonusId) || [];
    const totalUsages = bonusUsages.length;
    const totalAmount = bonusUsages.reduce(
      (sum, ub) => sum + parseFloat(ub.awarded_amount?.toString() || 0),
      0
    );
    return { totalUsages, totalAmount };
  };

  const getBonusTypeIcon = (type) => {
    const bonusType = bonusTypes.find((bt) => bt.value === type);
    const Icon = bonusType?.icon || FaDollarSign;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <Card className="border-gray-200 shadow-md rounded-md">
      <CardHeader>
        <Flex justify={"space-between"}>
          <Box>
            <Heading size="md" className="text-lg font-semibold text-gray-800">
              Bonus Campaigns
            </Heading>
            <Text className="text-sm text-gray-500">
              All active and inactive bonus campaigns with detailed information
            </Text>
          </Box>
          <button
            onClick={() => setOpenType("ADD")}
            style={{ backgroundColor: bg }}
            className="flex items-center p-2 h-[30px] gap-1 rounded-md text-xs md:text-sm text-white font-bold"
          >
            <FaPlus className="h-4 w-4" />
            {t(`Add`)}
          </button>
        </Flex>
      </CardHeader>

      <CardBody>
        <Box overflowX="auto">
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Bonus</Th>
                <Th>Type</Th>
                <Th>Code</Th>
                <Th>Value</Th>
                <Th>Wagering</Th>
                <Th>Status</Th>
                <Th>Usage</Th>
                <Th>Validity</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bonuses?.map((bonus) => {
                const stats = getBonusStats(bonus._id);
                return (
                  <Tr key={bonus._id}>
                    <Td>
                      <Box>
                        <Text fontWeight="medium">{bonus.title || "-"}</Text>
                        {bonus.description && (
                          <Text fontSize="xs" color="gray.500" noOfLines={2}>
                            {bonus.description}
                          </Text>
                        )}
                      </Box>
                    </Td>

                    <Td>
                      <Badge
                        colorScheme="gray"
                        textTransform="capitalize"
                        px={2}
                        py={1}
                        rounded="md"
                      >
                        <Flex align="center" gap={1}>
                          {getBonusTypeIcon(bonus.bonus_type)}
                          {bonus.bonus_type?.replace("_", " ") || "N/A"}
                        </Flex>
                      </Badge>
                    </Td>

                    <Td>
                      {bonus.promo_code ? (
                        <Box
                          as="code"
                          bg="gray.100"
                          px={2}
                          py={1}
                          rounded="md"
                          fontSize="xs"
                        >
                          {bonus.promo_code}
                        </Box>
                      ) : (
                        <Text fontSize="xs" color="gray.500">
                          No code
                        </Text>
                      )}
                    </Td>

                    <Td>
                      <Box>
                        {bonus.percentage ? (
                          <Flex gap={1} align="center">
                            <Text fontWeight="medium">{bonus.percentage}%</Text>
                            {bonus.max_reward && (
                              <Text fontSize="xs" color="gray.500">
                                (Max ₹{bonus.max_reward})
                              </Text>
                            )}
                          </Flex>
                        ) : bonus.reward_amount ? (
                          <Text fontWeight="medium">
                            ₹{bonus.reward_amount}
                          </Text>
                        ) : (
                          <Text fontSize="xs" color="gray.500">
                            Variable
                          </Text>
                        )}
                        {bonus.min_deposit && (
                          <Text fontSize="xs" color="gray.500">
                            Min deposit: ₹{bonus.min_deposit}
                          </Text>
                        )}
                      </Box>
                    </Td>

                    <Td>
                      <Box>
                        <Text fontWeight="medium">
                          {bonus.wager_multiplier || 0}x
                        </Text>
                        {bonus.max_cashout && (
                          <Text fontSize="xs" color="gray.500">
                            Max cashout: ₹{bonus.max_cashout}
                          </Text>
                        )}
                      </Box>
                    </Td>

                    <Td>
                      <Badge
                        colorScheme={bonus.is_active ? "green" : "gray"}
                        variant="solid"
                        px={2}
                        py={1}
                        rounded="md"
                      >
                        {bonus.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </Td>

                    <Td>
                      <Flex gap={3} wrap="wrap">
                        <Flex gap={1} align="center">
                          <FaUsers className="text-gray-500" />
                          <Text fontSize="sm">{stats.totalUsages}</Text>
                        </Flex>
                        <Flex gap={1} align="center">
                          <FaDollarSign className="text-gray-500" />
                          <Text fontSize="sm">
                            ₹{stats.totalAmount.toFixed(2)}
                          </Text>
                        </Flex>
                      </Flex>
                    </Td>

                    <Td>
                      <Box>
                        {bonus.start_date && (
                          <Text fontSize="xs" color="gray.500">
                            From:{" "}
                            {new Date(bonus.start_date).toLocaleDateString()}
                          </Text>
                        )}
                        {bonus.end_date ? (
                          <Text fontSize="xs" color="gray.500">
                            Until:{" "}
                            {new Date(bonus.end_date).toLocaleDateString()}
                          </Text>
                        ) : (
                          <Text fontSize="xs" color="gray.500">
                            No expiry
                          </Text>
                        )}
                      </Box>
                    </Td>

                    <Td>
                      <Flex gap={2}>
                        <Button
                          onClick={() => handleSelectedBonus(bonus)}
                          size="xs"
                          variant="outline"
                          colorScheme="blue"
                        >
                          <FaEdit />
                        </Button>
                        <Button size="xs" variant="outline" colorScheme="red">
                          <FaTrash />
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>

        {!bonuses?.length && !loading && (
          <Box py={8} textAlign="center">
            <Text color="gray.500">No bonuses found</Text>
          </Box>
        )}
        { openType == "EDIT" && (
          <AddOrUpdateBonus
            id={1}
            data={selectedBonus}
            getAllBonuses={getAllBonuses}
            setOpenType={setOpenType}
          />
        )}
        { openType == "ADD" && (
          <AddOrUpdateBonus
            id={2}
            data={{}}
            getAllBonuses={getAllBonuses}
            setOpenType={setOpenType}
          />
        )}
      </CardBody>
    </Card>
  );
};

export default BonusesTable;
