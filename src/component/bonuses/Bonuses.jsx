import { useEffect, useState } from 'react';
import { Box, Heading, Text, Tabs, TabList, Tab, TabPanels, TabPanel, Flex } from '@chakra-ui/react';

import WageringTracker from './WageringTracker';
import BonusesOverview from './BonusesOverview';
import BonusesTable from './BonusesTable';
import BonusesAnalytics from './BonusesAnalytics';
import BonusesTemplates from './BonusesTemplates';

const Bonuses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bonuses, setBonuses] = useState([]);
  const [userBonuses, setUserBonuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchBonuses = async () => {
      
      try {
        setIsLoading(true);
        setError(null);
        // setBonuses(bonusesData || []);
        // setUserBonuses(userBonusesData || []);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBonuses();
  }, [searchTerm]);

  // Mock data for wagering tracker
  const mockUserBonuses = [
    {
      id: 1,
      player: 'player123',
      bonus: 'Welcome Bonus',
      code: 'WELCOME100',
      amount: 100,
      wagered: 2450,
      wagering_requirement: 35,
      status: 'active',
      expiry: '2024-06-15T23:59:59Z',
    },
    {
      id: 2,
      player: 'luckystar',
      bonus: 'Free Spins Friday',
      amount: 50,
      wagered: 0,
      wagering_requirement: 40,
      status: 'unused',
      expiry: '2024-06-14T23:59:59Z',
    },
    {
      id: 3,
      player: 'highroller',
      bonus: 'VIP Reload Bonus',
      amount: 500,
      wagered: 17500,
      wagering_requirement: 25,
      status: 'completed',
      expiry: '2024-06-10T23:59:59Z',
    },
  ];

  if (isLoading) {
    return (
      <Box className="space-y-6">
        <Heading size="xl" className="text-3xl font-bold text-gray-800">
          Bonuses
        </Heading>
        <Text className="text-gray-500">Loading bonuses...</Text>
      </Box>
    );
  }

//   if (error) {
//     return (
//       <Box className="space-y-6">
//         <Heading size="xl" className="text-3xl font-bold text-gray-800">
//           Bonuses
//         </Heading>
//         <Text className="text-red-500">Error loading bonuses: {error.message}</Text>
//       </Box>
//     );
//   }

  return (
    <Box className="space-y-6">
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Heading size="xl" className="text-3xl font-bold text-gray-800">
            Bonuses & Promotions
          </Heading>
          <Text className="text-gray-500">
            Manage bonus campaigns, promotions, and wagering requirements
          </Text>
        </Box>
      </Flex>

      <Tabs variant={"subtle"}>
      <TabList className="grid w-full grid-cols-4 bg-gray-100 p-2 rounded-md">

          <Tab className="flex items-center gap-2 data-[selected]:bg-white data-[selected]:shadow-sm rounded-md py-2"
                   _selected={{ bg: 'white', boxShadow: 'sm', rounded:"md" }}>Bonuses</Tab>
          <Tab    _selected={{ bg: 'white', boxShadow: 'sm', rounded:"md" }} className="text-sm font-medium text-gray-700">Wagering Tracker</Tab>
          <Tab   _selected={{ bg: 'white', boxShadow: 'sm', rounded:"md" }} className="text-sm font-medium text-gray-700">Analytics</Tab>
          <Tab   _selected={{ bg: 'white', boxShadow: 'sm', rounded:"md" }} className="text-sm font-medium text-gray-700">Templates</Tab>
        </TabList>

        <TabPanels >
          <TabPanel className="space-y-6" p={0} pt={2}>
            <BonusesOverview searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <BonusesTable bonuses={bonuses} userBonuses={userBonuses} />
          </TabPanel>

          <TabPanel className="space-y-6"  p={0} pt={2}>
            <WageringTracker userBonuses={mockUserBonuses} />
          </TabPanel>

          <TabPanel className="space-y-6"  p={0} pt={2}>
            <BonusesAnalytics bonuses={bonuses} userBonuses={userBonuses} />
          </TabPanel>

          <TabPanel className="space-y-6"  p={0} pt={2}>
            <BonusesTemplates />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Bonuses;
