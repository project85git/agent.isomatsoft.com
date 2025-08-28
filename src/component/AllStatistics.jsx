import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import {  Grid } from "@chakra-ui/react";
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Heading,
  Skeleton,
  Button,
  Input,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { fetchGetRequest } from "../api/api";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { t } from "i18next";
import { TbReport } from "react-icons/tb";


const AllStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { bg,iconColor } = useSelector((state) => state.theme);

  useEffect(() => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const formatDateForInput = (date) => date.toISOString().split("T")[0];
    const formatDateForAPI = (date, isStart) => {
      const formattedDate = date.toISOString().split("T")[0];
      return isStart
        ? `${formattedDate}T00:00:00Z`
        : `${formattedDate}T23:59:59Z`;
    };

    setStartDate(formatDateForInput(oneMonthAgo));
    setEndDate(formatDateForInput(today));

    getStatisticsData(formatDateForAPI(oneMonthAgo, true), formatDateForAPI(today, false));
  }, []);

  const getStatisticsData = async (start, end) => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/bet/get-complete-statistics?startDate=${start}&endDate=${end}`;

    try {
      const response = await fetchGetRequest(url);
      const receivedData = response.data;
      setData(receivedData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleFetchStatistics = () => {
    const formatDateForAPI = (date, isStart) => {
      return isStart
        ? `${date}T00:00:00Z`
        : `${date}T23:59:59Z`;
    };

    if (startDate && endDate) {
      getStatisticsData(
        formatDateForAPI(startDate, true),
        formatDateForAPI(endDate, false)
      );
    } else {
      alert("Please select a valid date range.");
    }
  };

  return (
    <Box p={2} minHeight="100vh">

<GraphStatistics iconColor={iconColor}/>
      <Box mb={6} display="flex" justifyContent="center" gap={4}>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Select Start Date"
          className="text-black border border-black"
          style={{ border:`1px solid ${bg}`, color:"black"}}
        />
        <Input
          type="date"
          value={endDate}
          
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Select End Date"
          style={{ border:`1px solid ${bg}`, color:"black"}}
        />
        <Button onClick={handleFetchStatistics} style={{ backgroundColor:bg, color:"white", paddingLeft:"24px", paddingRight:"24px", cursor:"pointer"}}>
          Fetch
        </Button>
      </Box>
      {/* User Stats */}
      <StatisticsSection
        title="User Statistics"
        loading={loading}
        stats={[
          { label: "Total Users", value: data?.userStats?.totalUsers },
          { label: "New Users Today", value: data?.userStats?.newUsersToday },
          {
            label: "Active Admin Users",
            value: data?.userStats?.activeUsers?.admin,
          },
        ]}
      />

      {/* Admin Stats */}
      {data?.adminStats && (
        <StatisticsSection
          title="Admin Statistics"
          loading={loading}
          stats={Object.keys(data?.adminStats).map((key) => ({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            value: data.adminStats[key],
          }))}
        />
      )}

      {/* Deposit Stats */}
      {data?.depositStats && (
        <StatisticsSection
          title="Deposit Statistics"
          loading={loading}
          stats={[
            {
              label: "Total Deposits",
              value: `${data?.depositStats?.total || 0}`,
            },
            {
              label: "Top Depositor",
              value: data?.depositStats?.topDepositor || "N/A",
            },
            {
              label: "Average Deposit",
              value: `${data?.depositStats?.avg?.toFixed(2) || 0}`,
            },
          ]}
        />
      )}
      {/* Bet Stats */}
      {data?.betStats && (
        <StatisticsSection
          title="Bet Statistics"
          loading={loading}
          stats={[
            { label: "Total Bets", value: data?.betStats?.totalBets },
            {
              label: "Largest Bet",
              value: data?.betStats?.largestBet?.toFixed(2),
            },
            { label: "Win/Loss", value: data?.betStats?.winLoss?.toFixed(2) },
            {
              label: "Avg Bet Amount",
              value: data?.betStats?.avgBetAmount?.toFixed(2),
            },
            {
              label: "Winning Percentage",
              value: `${data?.betStats?.winningPercentage}%`,
            },
          ]}
        />
      )}
      {/* Financial Stats */}
      {data?.financialStats && (
        <StatisticsSection
          title="Financial Statistics"
          loading={loading}
          stats={[
            {
              label: "Gross Gaming Revenue (GGR)",
              value: `${data?.financialStats?.GGR?.toFixed(2) || 0}`,
            },
            {
              label: "Bonuses Distributed",
              value: `${
                data?.financialStats?.bonusesDistributed?.toFixed(2) || 0
              }`,
            },
            {
              label: "Referral Bonuses",
              value: `${
                data?.financialStats?.referralBonuses?.toFixed(2) || 0
              }`,
            },
          ]}
        />
      )}
    </Box>
  );
};

const StatisticsSection = ({ title, stats, loading }) => {
  return (
    <div>
      <Heading size="lg" mt={10} mb={5} className="text-gray-700">
        {title}
      </Heading>
      <SimpleGrid  columns={{ base: 1, md: 4 }} spacing={8}>
        {stats.map((stat, index) => (
          <Skeleton isLoaded={!loading} key={index}>
            <StatCard  label={stat.label} value={stat.value} />
          </Skeleton>
        ))}
      </SimpleGrid>
    </div>
  );
};

const StatCard = ({ label, value }) => {
  const { bg } = useSelector((state) => state.theme);
  return (
    <Stat
    style={{ backgroundColor: bg, color:"white" }}
      p={5}
      shadow="md"
      borderWidth="1px"
      bg="white"
      rounded="lg"
      className="hover:shadow-lg transition-shadow"
    >
      <StatLabel className="text-white">{label}</StatLabel>
      <StatNumber className="text-white">
        {value !== undefined ? value : "N/A"}
      </StatNumber>
    </Stat>
  );
};

export default AllStatistics;
// Chart Component
const GraphChart = ({ title, data, id, type, yLabel, color }) => {
  useEffect(() => {
    // Ensure the DOM element exists
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Element with id ${id} not found.`);
      return;
    }

    // Create the chart instance
    const chart = echarts.init(element);

    // Prepare chart data
    const dates = data.map((item) => item.date);
    const chartData = data.map((item) => item.value);

    // Set the chart options
    chart.setOption({
      title: {
        text: title,
      },
      tooltip: {},
      xAxis: {
        type: "category",
        data: dates,
      },
      yAxis: {
        type: "value",
        name: yLabel,
      },
      series: [
        {
          data: chartData,
          type: type,
          barWidth: '30%', // Adjust the bar width to make it thinner
          itemStyle: {
            color: color, // Customize color here
          },
        },
      ],
    });

    // Cleanup on unmount
    return () => {
      chart.dispose();
    };
  }, [data, id, title, type, yLabel, color]);

  return <div id={id} style={{ width: "100%", height: "350px" }}></div>;
};

const GraphStatistics = ({iconColor}) => {
  // Dummy data for the last 7 days
const [graphData, setGraphData]=useState([])
const [loading, setLoading] = useState(true)

const getStatisticsData = async () => {
  setLoading(true);
  const url = `${
    import.meta.env.VITE_API_URL
  }/api/bet/get-graph-data-for-last-7-days?`;
  try {
    const response = await fetchGetRequest(url);
    const receivedData = response.data;
    setGraphData(receivedData);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

useEffect(() => {
  getStatisticsData()
},[])
  const dummyData = [
    { date: "2024-08-18", totalUsers: 10, deposits: { total: 200, count: 5 }, withdrawals: { total: 150, count: 3 }, bets: { totalBets: 1000, count: 8 } },
    { date: "2024-08-19", totalUsers: 12, deposits: { total: 300, count: 7 }, withdrawals: { total: 200, count: 4 }, bets: { totalBets: 1200, count: 10 } },
    { date: "2024-08-20", totalUsers: 8, deposits: { total: 100, count: 4 }, withdrawals: { total: 50, count: 2 }, bets: { totalBets: 800, count: 6 } },
    { date: "2024-08-21", totalUsers: 14, deposits: { total: 400, count: 8 }, withdrawals: { total: 250, count: 5 }, bets: { totalBets: 1500, count: 12 } },
    { date: "2024-08-22", totalUsers: 16, deposits: { total: 350, count: 6 }, withdrawals: { total: 300, count: 4 }, bets: { totalBets: 1400, count: 11 } },
    { date: "2024-08-23", totalUsers: 11, deposits: { total: 250, count: 5 }, withdrawals: { total: 180, count: 3 }, bets: { totalBets: 1100, count: 9 } },
    { date: "2024-08-24", totalUsers: 13, deposits: { total: 280, count: 6 }, withdrawals: { total: 220, count: 4 }, bets: { totalBets: 1300, count: 10 } },
  ];
  // Prepare data for each chart
  const userGrowthData = graphData&&graphData.map(({ date, totalUsers }) => ({ date, value: totalUsers }));
  const depositData =  graphData&&graphData.map(({ date, deposits }) => ({ date, value: deposits.total }));
  const withdrawalData =  graphData&&graphData.map(({ date, withdrawals }) => ({ date, value: withdrawals.total }));
  const betData =  graphData&&graphData.map(({ date, bets }) => ({ date, value: bets.totalBets }));

  return (
    <Box className="py-2 shadow-sm">
              <p
          style={{ color: iconColor }}
          className={`font-bold   w-[100%]    flex items-center gap-2 rounded-[6px]   text-md`}
        >
          <TbReport
            style={{ color: iconColor }}
            fontSize={"15px"}
          />
          {t(`All`)} {t(`Statistics`)}
        </p>
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        7 Days Statistics Overview
      </Heading>

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        <Box className="bg-white shadow-md p-4 rounded-lg">
          <GraphChart
            title="User Growth"
            data={userGrowthData}
            id="userGrowth"
            type="line"
            yLabel="Users"
            color="#4caf50" // Green color for user growth
          />
        </Box>

        <Box className="bg-white shadow-lg p-4 rounded-lg">
          <GraphChart
            title="Total Deposits"
            data={depositData}
            id="deposits"
            type="bar"
            yLabel="Amount ($)"
            color="#ff9800" // Orange color for deposits
          />
        </Box>

        <Box className="bg-white shadow-lg p-4 rounded-lg">
          <GraphChart
            title="Total Withdrawals"
            data={withdrawalData}
            id="withdrawals"
            type="bar"
            yLabel="Amount ($)"
            color="#f44336" // Red color for withdrawals
          />
        </Box>
        <Box className="bg-white shadow-lg p-4 rounded-lg">
          <GraphChart
            title="Total Bets"
            data={betData}
            id="bets"
            type="bar"
            yLabel="Amount ($)"
            color="#2196f3" // Blue color for bets
          />
        </Box>
      </Grid>
    </Box>
  );
};
