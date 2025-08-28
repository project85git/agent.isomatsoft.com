import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useBreakpointValue,
  Avatar,
  Icon,
} from "@chakra-ui/react";
import {
  FiHome,
  FiRepeat,
  FiBarChart2,
  FiUsers,
  FiActivity,
  FiUserCheck,
  FiUserPlus,
  FiKey,
} from "react-icons/fi";
import { HiUserCircle } from "react-icons/hi2";

import TransferAmount from "./TransferAmount";
import SearchUser from "./SearchUser";
import RegisterUsers from "./RegisterUser";
import FinancialTransactions from "./FinancialTransactions";
import PasswordManagement from "./PasswordManagement";

// Colors
const colors = {
  headerBg: "gray.800",
  headerBorder: "gray.700",
  hoverBg: "gray.700",
  activeBg: "#D0011C",
  accordionPanelBg: "gray.100",
  contentBg: "white",
  contentBorder: "gray.200",
  textPrimary: "gray.200",
  textActive: "white",
  textSubItem: "white",
};

// Sidebar Header
const HeaderNav = ({ navItems }) => {
  const location = useLocation();

  return (
    <Box className={`border border-${colors.headerBorder}`}>
      <Flex direction="column">
        {/* Top user section */}
        <Flex alignItems="center" p={3} bg={"#E0E0E0"} gap={3}>
          <Avatar
            size="md"
            icon={<Icon as={HiUserCircle} boxSize={16} color="black" />}
            bg="transparent"
          />
          <Flex direction="column">
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color={"black"}>
              Bossboss1
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }} color={"#FF4040"}>
              owner
            </Text>
          </Flex>
        </Flex>

        {/* Menu items */}
        <Flex direction="column" gap={1}>
          {navItems.map((item, index) =>
            item.subItems ? (
              <Accordion key={index} allowToggle bg={colors.headerBg}>
                <AccordionItem border="none">
                  <AccordionButton
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    px={4}
                    py={2}
                    _hover={{ bg: colors.hoverBg }}
                    color={colors.textPrimary}
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="medium"
                  >
                    <Flex alignItems="center" gap={2}>
                      <item.icon size={18} />
                      <Text>{item.label}</Text>
                    </Flex>
                    <AccordionIcon />
                  </AccordionButton>

                  <AccordionPanel pb={2} bg={"#454444"}>
                    {item.subItems.map((subItem, subIndex) => (
                      <Link key={subIndex} to={subItem.path}>
                        <Flex
                          alignItems="center"
                          gap={2}
                          pl={4}
                          py={1}
                          borderRadius="md"
                          _hover={{ bg: colors.hoverBg }}
                          bg={
                            location.pathname === subItem.path
                              ? colors.activeBg
                              : "transparent"
                          }
                          color={
                            location.pathname === subItem.path
                              ? colors.textActive
                              : colors.textSubItem
                          }
                          fontSize={{ base: "sm", md: "md" }}
                        >
                          <subItem.icon size={16} />
                          <Text>{subItem.label}</Text>
                        </Flex>
                      </Link>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            ) : (
              <Link key={index} to={item.path}>
                <Flex
                  alignItems="center"
                  gap={2}
                  px={4}
                  py={2}
                  _hover={{ bg: colors.hoverBg }}
                  bg={
                    location.pathname === item.path
                      ? colors.activeBg
                      : colors.headerBg
                  }
                  color={
                    location.pathname === item.path
                      ? colors.textActive
                      : colors.textPrimary
                  }
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="medium"
                >
                  <item.icon size={18} />
                  <Text>{item.label}</Text>
                </Flex>
              </Link>
            )
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

// Main content area
const ContentArea = ({ activePage }) => {
  const pages = {
    "/dashboard": (
      <Text className="text-gray-700">
        Dashboard content: System metrics and performance overview.
      </Text>
    ),
    "/dashboard/admin-transfer": <TransferAmount />,
    "/dashboard/financial": <FinancialTransactions />,
    "/dashboard/admin-tree": <SearchUser />,
    "/dashboard/user-register": <RegisterUsers />,
    "/dashboard/admin-change-password": <PasswordManagement />,
  };

  return (
    <Box
      p={{ base: 3, md: 4 }}
      borderWidth="1px"
      bg={colors.contentBg}
      className={`border border-${colors.contentBorder}`}
    >
      {pages[activePage] || (
        <Text className="text-gray-700">Select a page to view content.</Text>
      )}
    </Box>
  );
};

// Main Admin Panel
export default function AdminPanel() {
  const location = useLocation(); // 👈 detects current route
  const activePage = location.pathname; // 👈 use path instead of state
  const isMobile = useBreakpointValue({ base: true, md: false });

  const navItems = [
    { label: "Dashboard", icon: FiHome, path: "/dashboard" },
    { label: "Transfer", icon: FiRepeat, path: "/dashboard/admin-transfer" },
    {
      label: "Reports",
      icon: FiBarChart2,
      subItems: [
        {
          label: "Financial Transactions",
          path: "/dashboard/financial",
          icon: FiActivity,
        },
      ],
    },
    {
      label: "User Management",
      icon: FiUsers,
      subItems: [
        { label: "Search Users", path: "/dashboard/admin-tree", icon: FiUserCheck },
        { label: "Register Users", path: "/dashboard/user-register", icon: FiUserPlus },
        { label: "Password Management", path: "/dashboard/admin-change-password", icon: FiKey },
      ],
    },
  ];

  return (
    <div className="mt-16 font-sans">
      <Box
        maxW="100%"
        mx="auto"
        p={{ base: 2, md: 4 }}
        gap={3}
        display={"flex"}
        flexDirection={{ base: "column", md: "row" }}
      >
        <div className="w-full md:w-[500px]">
          <HeaderNav navItems={navItems} />
        </div>
        <div className="w-full md:w-[100%]">
          <ContentArea activePage={activePage} />
        </div>
      </Box>
    </div>
  );
}