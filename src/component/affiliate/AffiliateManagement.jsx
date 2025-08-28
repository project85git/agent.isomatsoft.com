import { useState } from 'react';
import { Box, Heading, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { FiUsers, FiDollarSign, FiTrendingUp, FiShare2 } from 'react-icons/fi';
import AffiliateOverview from './components/AffiliateOverview';
import AffiliateCommissions from './components/AffiliateCommissions';
import AffiliateTracking from './components/AffiliateTracking';
import ReferralBonuses from './components/ReferralBonuses';

const AffiliateManagement = () => {
  return (
    <Box p={2} className="space-y-6">
      <Box className="flex items-center justify-between">
        <Box>
          <Heading size="xl" mb={2}>
            Affiliate Management
          </Heading>
          <Text color="gray.500">
            Manage affiliate partners, track referrals, and handle commission payouts
          </Text>
        </Box>
      </Box>

      <Tabs variant="subtle" isFitted colorScheme="white" className="space-y-6">
        <TabList className="grid w-full grid-cols-4 bg-gray-100 p-2 rounded-md">
          <Tab
            className="flex items-center gap-2 data-[selected]:bg-white data-[selected]:shadow-sm rounded-md py-2"
            _selected={{ bg: 'white', boxShadow: 'sm', rounded:"md" }}
          >
            <FiUsers className="h-4 w-4" />
            Overview
          </Tab>
          <Tab
            className="flex items-center gap-2 data-[selected]:bg-white data-[selected]:shadow-sm rounded-md py-2"
            _selected={{ bg: 'white', boxShadow: 'sm', rounded:"md"  }}
          >
            <FiDollarSign className="h-4 w-4" />
            Commissions
          </Tab>
          <Tab
            className="flex items-center gap-2 data-[selected]:bg-white data-[selected]:shadow-sm rounded-md py-2"
            _selected={{ bg: 'white', boxShadow: 'sm', rounded:"md" }}
          >
            <FiTrendingUp className="h-4 w-4" />
            Tracking
          </Tab>
          <Tab
            className="flex items-center gap-2 data-[selected]:bg-white data-[selected]:shadow-sm rounded-md py-2"
            _selected={{ bg: 'white', boxShadow: 'sm', rounded:"md" }}

          >
            <FiShare2 className="h-4 w-4" />
            Referral Bonuses
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <AffiliateOverview />
          </TabPanel>
          <TabPanel p={0}>
            <AffiliateCommissions />
          </TabPanel>
          <TabPanel p={0}>
            <AffiliateTracking />
          </TabPanel>
          <TabPanel p={0}>
            <ReferralBonuses />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AffiliateManagement;