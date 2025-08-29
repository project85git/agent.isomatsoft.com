import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  useToast,
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
import { useSelector } from "react-redux";
import { fetchGetRequest } from "../../api/api";

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
  const {user:adminData} = useSelector((state) => state.authReducer);

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
              {adminData.username}
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }} color={"#FF4040"}>
              {adminData.role_type}
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

// Step 1: Build hierarchy tree
const buildHierarchy = (data) => {
  const map = {};
  const roots = [];

  // Initialize all admins
  data.forEach((admin) => {
    map[admin.username] = { ...admin, children: [] };
  });

  // Link children to parents
  data.forEach((admin) => {
    if (map[admin.parent_admin_username]) {
      map[admin.parent_admin_username].children.push(map[admin.username]);
    } else {
      roots.push(map[admin.username]); // top-level admins
    }
  });

  return roots;
};

// Step 2: Transform hierarchy into GroupRow format
const transformData = (nodes) => {
  return nodes.map((node) => ({
    group: `${node.username} (${
      (node.children?.length || 0) + (node.users?.length || 0)
    })`,
    role: node.role_type,
    amount: node.amount?.toFixed(2),
    sub: [
      ...transformData(node.children || []), // recursive admins
      ...(node.users || []).map((user) => ({
        group: `${user.username}`,
        role: user.role_type,
        amount: user.amount?.toFixed(2),
        sub: [],
      })),
    ],
  }));
};
  // ✅ Extract all users from hierarchy
  const extractAllMembers = (nodes) => {
    let members = [];
    nodes.forEach((node) => {
      // push the admin itself
      members.push({
        username: node.username,
        role_type: node.role_type,
        amount: node.amount,
        type: "admin",
      });
  
      // push direct users
      if (node.users && node.users.length > 0) {
        const userEntries = node.users.map((user) => ({
          username: user.username,
          role_type: user.role_type,
          amount: user.amount,
          type: "user",
        }));
        members = [...members, ...userEntries];
      }
  
      // recurse into children admins
      if (node.children && node.children.length > 0) {
        members = [...members, ...extractAllMembers(node.children)];
      }
    });
    return members;
  };
// Main content area
const ContentArea = ({ activePage }) => {
  const [ assignedRoles, setAssignedRoles ] = useState([]);
  const [ mappedLevel, setMappedLevel ] = useState({})
  const [ searchTerm, setSearchTerm ] = useState("");
  const [ rawData, setRawData ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ allMembers, setAllMembers ] = useState([])
  const toast = useToast();

  
  const getAdminLevel = async () => {
    try {
      const response = await fetchGetRequest(
        `${import.meta.env.VITE_API_URL}/api/level/get-admin-level`
      );
      setAssignedRoles(response.data || []);
      let mapLevel = {}
      assignedRoles.forEach((ele)=>{
        mapLevel[ele.name]=ele.lavel||ele.name
      })
      setMappedLevel(mapLevel)
    } catch (error) {
      console.log(error.message);
    }
  };

  const filterData = (data, term) => {
    if (!term) return data;
    const lowerTerm = term.toLowerCase();
    return data
      .map((group) => {
        const matchesGroup =
          group.group.toLowerCase().includes(lowerTerm) ||
          group.role.toLowerCase().includes(lowerTerm);
        const filteredSub = filterData(group.sub || [], term);
        if (matchesGroup || filteredSub.length > 0) {
          return { ...group, sub: filteredSub };
        }
        return null;
      })
      .filter(Boolean);
  };

  const getHierarchyData = async (e) => {
    try {
      const url = `${
        import.meta.env.VITE_API_URL
      }/api/admin/get-hierarchy-data`;
      const response = await fetchGetRequest(url);
      toast({
        title: response.message,
        status: "success",
        duration: 2000,
        position: "top",
        isClosable: true,
      });

      setLoading(false);
      setRawData(response.data);
    } catch (error) {
      toast({
        title: error?.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    getHierarchyData();
  }, []);


  const getDummyData = useCallback(() => {
    const hierarchy = buildHierarchy(rawData);
    const all = extractAllMembers(hierarchy);
    setAllMembers(all);
    return transformData(hierarchy);
  }, [rawData]);

  const dummyData = useMemo(() => getDummyData(), [getDummyData]);

  // Memoize filterData
  const getFilteredData = useCallback(() => {
    return filterData(dummyData, searchTerm);
  }, [dummyData, searchTerm]);

  const filteredData = useMemo(() => getFilteredData(), [getFilteredData]);

  useEffect(()=>{getAdminLevel()},[])

  const pages = {
    "/": (
      <Text className="text-gray-700">
        Dashboard content: System metrics and performance overview.
      </Text>
    ),
    "/dashboard/admin-transfer": <TransferAmount mappedLevel={ mappedLevel } allMembers={allMembers}/>,
    "/dashboard/financial": <FinancialTransactions mappedLevel={ mappedLevel } allMembers={allMembers} />,
    "/dashboard/admin-tree": <SearchUser mappedLevel={ mappedLevel } searchTerm={ searchTerm } setSearchTerm={ setSearchTerm } filteredData={ filteredData } />,
    "/dashboard/user-register": <RegisterUsers assignedRoles={ assignedRoles }/>,
    "/dashboard/admin-change-password": <PasswordManagement mappedLevel={ mappedLevel } searchTerm={ searchTerm } setSearchTerm={ setSearchTerm } filteredData={ filteredData } />,
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
    { label: "Dashboard", icon: FiHome, path: "/" },
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