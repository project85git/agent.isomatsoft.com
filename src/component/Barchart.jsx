import React, { useEffect } from "react";
import * as echarts from "echarts";
import { useTranslation } from "react-i18next";

const Barchart = ({ title, data, deposits, loseBet, winBet, profitLoss, withdrawals, type, width, height, id }) => {
const { t, i18n } = useTranslation();
 
  useEffect(() => {
    // Create the echarts instance
    var myChart = echarts.init(document.getElementById(`${id}`));
    const currentMonthIndex = new Date().getMonth();
    const months = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    // Get the last 12 months dynamically
    const dynamicMonths = [
      ...months.slice(currentMonthIndex + 1, 12),
      ...months.slice(0, currentMonthIndex + 1),
    ];

    // Draw the chart
    myChart.setOption({
      title: {
        text: title,
      },
      tooltip: {},
      xAxis: {
        data: type === "bar" ? dynamicMonths.reverse()   : [],
        axisLine: {
          show: type === "bar" ? true : false,
        },
        axisLabel: {
          rotate: 45,  // Rotate the labels by 45 degrees (you can adjust this value as needed)
          formatter: function (value) {
            return value;  // You can customize the label format here if needed
          },
        },
      },
      yAxis: {
        axisLine: {
          show: type === "bar" ? true : false,
        },
      },
      series: [
        ...(deposits
          ? [
              {
                name: "Deposit",
                type: type,
                itemStyle: {
                  color: "#22c55e",
                },
                data: deposits,
              },
            ]
          : []),
        ...(withdrawals
          ? [
              {
                name: "Withdrawal",
                type: type,
                itemStyle: {
                  color: "#dc2626",
                },
                data: withdrawals,
              },
            ]
          : []),
        ...(loseBet
          ? [
              {
                name: "Lose Bet",
                type: type,
                itemStyle: {
                  color: "red",
                },
                data: loseBet,
              },
            ]
          : []),
        ...(winBet
          ? [
              {
                name: "Win Bet",
                type: type,
                itemStyle: {
                  color: "green",
                },
                data: winBet,
              },
            ]
          : []),
        ...(profitLoss
          ? [
              {
                name: "Profit/Loss",
                type: type,
                itemStyle: {
                  color: "blue",
                },
                data: profitLoss,
              },
            ]
          : []),
        ...(data
          ? [
              {
                name: 'Layer Overview',
                type: 'pie',
                radius: ['50%', '70%'],
                center: ['50%', '60%'],
                itemStyle: {
                  borderRadius:5, // Rounded edges for pie chart
                },
                data: data?.map(item => ({
                  value: item.value,
                  name: t(item.name),
                })),
                // Remove axis lines and grid lines for pie chart
                xAxis: { show: false },
                yAxis: { show: false },

              },
            ]
          : []),
      ],
      responsive: true,
    });

    // Clean up function
    return () => {
      myChart.dispose();
    };
  }, [title, data, deposits, loseBet, winBet, profitLoss, withdrawals, type, id]);

  return (
    <div
      id={`${id}`}
      style={{
        height: height || "350px",
        width: width || "100%",
      }}
    ></div>
  );
};

export default Barchart

