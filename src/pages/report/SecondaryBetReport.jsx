import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import coin from "../../assets/rupees.png";
import logo from "../../assets/logo.png";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import {
  Badge,
  Button,
  Input,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { fetchGetRequest } from "../../api/api";
import { useTranslation } from "react-i18next";
import {
  convertToUniversalTime,
  currencyOptions,
  formatDate,
  getGameProvider,
} from "../../../utils/utils";
import { IoMdCloudDownload } from "react-icons/io";
import html2pdf from "html2pdf.js";
const SecondaryBetReport = () => {
  const {
    color,
    primaryBg,
    iconColor,
    secondaryBg,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [pagination, setPagination] = useState({});
  const [activeCategory, setActiveCategory] = useState("-1");
  const totalPages = pagination.totalPages;
  const [totalGGr, setTotalGGR] = useState({});
  const [limit, setLimit] = useState(20);
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [providerId, setProviderId] = useState("");
  const [apiProviderName, setApiProviderName] = useState("DREAMGATES");
  const [username, setUsername] = useState("");
  const [currency, setCurrency] = useState("");
  const [providerData, setProviderData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(""); // Default value for Week

  const handleOptionChange = (value, id) => {
    setToDate("");
    setFromDate("");
    setSelectedOption(value);
    setActiveCategory(id);
    setCurrentPage(1);
  };
  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const [search, setSearch] = useState("");
  const toast = useToast();

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
    setCurrentPage(1);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const getProfitUserData = async () => {
    setLoading(true);

    const formattedFromDate = fromDate
      ? new Date(fromDate).toISOString().split("T")[0]
      : "";
    const formattedToDate = toDate
      ? new Date(toDate).toISOString().split("T")[0]
      : "";

    let url = `${
      import.meta.env.VITE_API_URL
    }/api/bet/get-secondary-ggr-report-by-date?page=${currentPage}&limit=${limit}&api_provider_name=${apiProviderName}`;

    // Conditionally add filters to the URL
    if (formattedFromDate && formattedToDate) {
      url += `&start_date=${formattedFromDate}&end_date=${formattedToDate}`;
    } else if (selectedOption) {
      url += `&filter=${selectedOption}`;
    }

    if (username) {
      url += `&search=${username}`;
    }
    if (currency) {
      url += `&currency=${currency}`;
    }
    if (providerId) {
      url += `&provider=${providerId.toUpperCase()}`;
    }

    try {
      let response = await fetchGetRequest(url);
      setLoading(false);
      if (response) {
        setData(response.data.transactions);
        // setTotalGGR(response?.graphData[0]);
        setPagination(response.pagination);
      }
    } catch (error) {
      setLoading(false);
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }
  };

  const getAllCasinoProvider = async () => {
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/secondary-provider/get-provider-name?api_provider_name=${apiProviderName}`;

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      setProviderData(data);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    getAllCasinoProvider();
  }, [apiProviderName]);
  useEffect(() => {
    let id;
    id = setTimeout(() => {
      getProfitUserData();
    }, 200);

    return () => clearTimeout(id);
  }, [
    currentPage,
    toDate,
    limit,
    providerId,
    username,
    selectedOption,
    currency,
    apiProviderName,
  ]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const filterByDay = [
    {
      id: 4,
      title: "TODAY",
      value: "today",
    },
    {
      id: 2,
      title: "7 Days",
      value: "7days",
    },
    {
      id: 3,
      title: "30 DAYS",
      value: "30days",
    },
    {
      id: 5,
      title: "YESTERDAY",
      value: "yesterday",
    },
    {
      id: 6,
      title: "THIS MONTH",
      value: "thismonth",
    },
    {
      id: 7,
      title: "PREVIOUS MONTH",
      value: "lastmonth",
    },
  ];

  const { selectedWebsite, siteDetails } = useSelector(
    (state) => state.websiteReducer
  );
  let filteredData = siteDetails.filter((item) => item.selected === true);



  const handleDownloadReport = async () => {
    const formattedFromDate = fromDate
      ? new Date(fromDate).toISOString().split("T")[0]
      : "";
    const formattedToDate = toDate
      ? new Date(toDate).toISOString().split("T")[0]
      : "";

    let url = `${
      import.meta.env.VITE_API_URL
    }/api/bet/get-bet-report-for-pdf?start_date=${formattedFromDate}&end_date=${formattedToDate}`;

    if (username) {
      url += `&username=${username}`;
    }
    if (currency) {
      url += `&currency=${currency}`;
    }
    if (formattedFromDate && formattedToDate) {
      url += `&from=${formattedFromDate}&to=${formattedToDate}`;
    } else {
      url += `&filter=${selectedOption}`;
    }

    try {
      let response = await fetchGetRequest(url);
      const { data, graphData } = response;
      // Convert tabular data to HTML table
      const tableHtml = generateTableHtml(data);

      // Convert HTML to PDF with custom styling
      const options = {
        filename: "report.pdf",
        html2canvas: {},
        jsPDF: { orientation: "landscape" },
        image: { type: "jpeg", quality: 0.98 },
        pagebreak: { mode: "avoid-all" },
        margin: [10, 10],
        html2pdf: {
          width: 700,
          height: 900,
          html2canvas: { scale: 2 },
          pagebreak: { before: ".break-page" },
          jsPDF: { unit: "px", format: "a4" },
        },
      };

      html2pdf().set(options).from(tableHtml).save();

      toast({
        description: `Download successful`,
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
    }
  };

  // Function to generate HTML table from tabular data
  const generateTableHtml = (records) => {
    if (!Array.isArray(records) || records.length === 0) {
      return "<p>No records found</p>";
    }

    const tableRows = records.map((record, index) => {
      // Calculate the difference between Amount and WinLoss
      const winLossDiff =
        record.WinLoss === "0" ? record.Amount : record?.WinLoss;
      // Determine the class based on winLossDiff
      const value = record ? (record.WinLoss === "0" ? "-" : "+") : "";

      const winLossClass =
        record.WinLoss === "0"
          ? "text-red-600 font-bold"
          : "text-green-500 font-bold";

      // Determine the class for the Status column
      const statusClass =
        record.WinLoss === "0" ? "text-red-500" : "text-green-500";
      const statusData = record?.WinLoss === "0" ? "Lose" : "Win";
      // Get the game provider name based on GpId
      return `
        <tr class="text-xs">
          <td class="border text-xs px-4 py-2">${index}</td>
          <td class="border px-4 py-2">${record.game_id}</td>
          <td class="border px-4 py-2">${record.provider_name}</td>
          <td class="border px-4 py-2">${record.username}</td>
          <td class="border px-4 py-2">${filteredData[0].site_name}</td>
          <td class="border px-4 py-2">${record.currency}</td>
          <td class="border px-4 py-2 ${winLossClass}"> ${value} ${winLossDiff}</td>

          <td class="border px-4 py-2">${record.created_at}</td>

          <td class="border px-4 py-2 ${statusClass} font-bold">(${statusData})</td>

         
          
         
        </tr>
      `;
    });

    const tableHtml = `
      <div>
        <p class="font-bold text-center text-lg my-4">Player GGR Wise Report Card</p>
        <table class="w-full">
          <thead>
            <tr>
              <th class="px-4 py-2 bg-gray-200">S.No</th>
              <th class="px-4 py-2 bg-gray-200">Game ID</th>
              <th class="px-4 py-2 bg-gray-200">Provider Name</th>
              <th class="px-4 py-2 bg-gray-200">Display Name</th>

              <th class="px-4 py-2 bg-gray-200">Partner</th>
              <th class="px-4 py-2 bg-gray-200">Currency</th>

              <th class="px-4 py-2 bg-gray-200">P/L</th>
              <th class="px-4 py-2 bg-gray-200">Created Date</th>
              <th class="px-4 py-2 bg-gray-200">Result</th>
              

            </tr>
          </thead>
          <tbody>
            ${tableRows.join("")}
          </tbody>
        </table>
      </div>
    `;

    return tableHtml;
  };

  // Function to generate HTML table from tabular data

  return (
    <div>
      <div>
        <p
          style={{ color: iconColor }}
          className={`font-bold   w-[100%]    flex items-center gap-2 rounded-[6px]   text-md`}
        >
          <BsFillCalendar2DateFill
            style={{ color: iconColor }}
            fontSize={"15px"}
          />
          {t(`Bet`)} {t(`Report`)}
        </p>
      </div>
      <div className=" mt-5 rounded-2xl bg-white shadow-sm min-h-[200px] p-5 py-6">
        <div className="flex flex-wrap  items-center gap-2 ">
          {filterByDay?.map((item) => {
            return (
              <div key={item._id}>
                <button
                  onClick={() => handleOptionChange(item?.value, item?.id)}
                  style={{
                    backgroundColor: activeCategory === item?.id ? bg : "",
                    border: `1px solid ${border}60`,
                  }}
                  className={`text-xs p-2 ${
                    activeCategory === item?.id ? "text-white" : ""
                  } font-semibold min-w-[70px]  rounded-md  `}
                >
                  {item?.title}
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 mt-6  md:w-[630px] items-center">
          <div className="flex w-[100%] flex-col  items-start ">
            <p className="font-bold text-sm">
              {t(`From`)} {t(`Date`)}
            </p>
            <input
              type="date"
              style={{ border: `1px solid ${border}60` }}
              // min={today}
              className={` outline-none w-[100%]  rounded px-3 text-xs py-1`}
              value={fromDate}
              onChange={handleFromDateChange}
            />
          </div>
          <div className="flex w-[100%] flex-col  items-start ">
            <p className="font-bold text-sm">
              {t(`To`)} {t(`Date`)}
            </p>
            <input
              type="date"
              style={{ border: `1px solid ${border}60` }}
              // min={today}
              className={` ml-2 outline-none w-[100%] rounded px-3 py-1 text-xs `}
              value={toDate}
              onChange={handleToDateChange}
            />
          </div>
        </div>

        <div className="w-[100%] mt-6 flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
          <div className="flex w-[100%] flex-col  items-start ">
            <p className="font-bold text-sm">
              {" "}
              {t(`Provider`)} {t(`Wise`)}
            </p>
            <Select
              onChange={(e) => {
                setProviderId(e.target.value);
                setCurrentPage(1);
              }}
              height={"30px"}
              style={{ border: `1px solid ${border}60` }}
            >
              <option value="">
                {t(`Select`)} {t(`Provider`)}
              </option>

              {providerData?.map((item) => {
                return <option value={item}>{item}</option>;
              })}
            </Select>
          </div>

          <div className="flex w-[100%] flex-col  items-start ">
            <p className="font-bold text-sm">Api Provider</p>
            <Select
              value={apiProviderName}
              onChange={(e) => setApiProviderName(e.target.value)}
              height={"30px"}
              style={{ border: `1px solid ${border}60` }}
            >
              <option value={"DREAMGATES"}>SCROPION</option>
              <option value={"EVERGAME"}>EVER</option>
              <option value={"NEXUSGGREU"}>NEXUS</option>
            </Select>
          </div>
          <div className="flex w-[100%] flex-col  items-start ">
            <p className="font-bold text-sm">
              {t(`Currency`)} {t(`Wise`)}
            </p>
            <Select
              onChange={(e) => {
                setCurrency(e.target.value);
                setCurrentPage(1);
              }}
              height={"30px"}
              style={{ border: `1px solid ${border}60` }}
            >
              <option value="">
                {t(`Select`)} {t(`Currency`)}
              </option>
              {currencyOptions?.map((item) => {
                return <option value={item.value}>{item?.label}</option>;
              })}
            </Select>
          </div>

          <div className="flex w-[100%] flex-col  items-start ">
            <p className="font-bold text-sm">
              {t(`Company`)} {t(`Group`)}
            </p>
            <Select
              disabled
              height={"30px"}
              style={{ border: `1px solid ${border}60` }}
            >
              <option>{filteredData[0]?.site_name}</option>
            </Select>
          </div>
        </div>

        <div className="flex justify-between w-[100%] mt-5  items-center">
          <div className="flex  flex-col items-start ">
            <p className="text-sm font-bold">{t(`Search`)}</p>
            <div className="flex items-center gap-2">
              <input
                onChange={(e) => {
                  setUsername(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ border: `1px solid ${border}60` }}
                className=" w-[100%] sm:w-[400px] outline-none rounded-md p-[5px] text-sm"
                placeholder="enter username"
              />

              <span
                style={{ backgroundColor: bg }}
                className="px-1 py-[2px] rounded-md cursor-pointer"
              >
                <IoMdCloudDownload
                  onClick={handleDownloadReport}
                  fontSize={"25px"}
                  color="white"
                />
              </span>
            </div>
          </div>
          <div className="flex pr-5  gap-2">
            <p className="flex text-xs font-bold">
              {t(`Total`)} {t(`GGR`)}:{" "}
              <span className="font-medium">{totalGGr?.ggr}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="  ">
        <div
          className={`h-[100%] overflow-scroll rounded-[8px] md:rounded-[16px] bg-white p-3   w-[100%]  mt-5`}
        >
          {loading && (
            <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
          )}

                <table className={`w-full`}>
                <thead>
                  <tr
                    style={{ borderBottom: `1px solid ${border}60` }}
                    className={`text-center p-2 rounded-md h-[30px] text-[10px] font-bold`}
                  >
                    <th className="text-left min-w-[150px] ">
                      {t(`Username`)} / {t(`User`)} {t(`Code`)}
                    </th>
                    <th className="w-[120px] ">
                      {t(`Game`)} {t(`Id`)}{" "}
                    </th>
                    <th className="min-w-[120px] ">
                      {t(`Bet`)} {t(`Time`)}
                    </th>
                    <th className="min-w-[120px] ">
                      {t(`Provider`)} {t(`Name`)}
                    </th>
                    <th className="min-w-[120px] ">
                      {t(`Game`)} {t(`Name`)}
                    </th>

                    <th className="min-w-[120px] ">
                      {t(`Event`)} {t(`Type`)}
                    </th>
                    <th className="min-w-[120px] ">{t(`Amount`)}</th>
                    <th className="min-w-[120px] ">
                      {t(`Win`)}/{t(`Loss`)}
                    </th>
                    <th className=" min-w-[120px] ">{t(`Result`)}</th>
                   
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data?.map((item) => {
                      return (
                        <tr
                          key={item?._id}
                          style={{ borderBottom: `1px solid ${border}60` }}
                          className={`text-center h-[60px] m-auto text-xs`}
                        >
                          <td className="">
                            <div className="flex text-left flex-col ">
                              <p>{item.username}</p>
                              <b className="text-[8px] ">
                                ({item?.user_code?.slice(0, 10)})<span></span>
                              </b>
                            </div>
                          </td>
                          <td className="">
                            <div className="flex items-center justify-center">
                              <button className={`p-[6px] rounded-md w-[60px]`}>
                                {item.game_name}
                              </button>
                            </div>
                          </td>
                          <td className="">{item.created_at}</td>
                          <td className="">{item.provider}</td>
                          <td className="">
                            {item?.game_name?.slice(0, 15) || "N/A"}
                          </td>
                          <td className="">
                            <Badge colorScheme="blue">{"Casino"}</Badge>
                          </td>
                          <td className="">
                            <div className="flex items-center justify-center">
                              <button
                                className={`p-[6px] text-yellow-600 font-extrabold rounded-[8px] w-[60px] `}
                              >
                                {item.amount?.toFixed(2)} {item?.currency}
                              </button>
                            </div>
                          </td>
                          <td
                            className={`font-bold  ${
                              item.Status == "pending"
                                ? "text-orange-400"
                                : item.win_loss !== 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {" "}
                            {item.status !== "pending" &&
                              (item.win_loss !== "0" ? "+" : "-")}
                            {item.status == "pending"
                              ? "0.00"
                              : item.amount !== 0
                              ? item.amount
                              : item.amount?.toFixed(2)}
                          </td>
                          <td className=" ">
                            <Badge
                              colorScheme={
                                item.status == "pending"
                                  ? "orange"
                                  : item?.win_loss !== 0
                                  ? "green"
                                  : "red"
                              }
                            >
                              {item.status == "pending"
                                ? "Pending"
                                : item.win_loss !== 0
                                ? "win"
                                : "lose"}{" "}
                             
                            </Badge>
                          </td>
                      
                        </tr>
                      );
                    })}
                </tbody>
              </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p style={{ color: iconColor }} className="text-xs font-semibold ">
          {t(`Showing`)} 1 {t(`to`)} {limit} {t(`of`)} {pagination.totalPages}{" "}
          {t(`Entries`)}
        </p>
        <div
          className={`text-[16px]   text-sm font-semibold flex  mt-5 mr-5 justify-end gap-3 align-middle items-center`}
        >
          <button
            type="button"
            style={{
              backgroundColor: bg,
              border: `1px solid ${border}60`,
              color: "white",
              fontSize: "12px",
            }}
            className={`ml-1 px-2 py-[4px] cursor-pointer  rounded-[5px] text-[20px]`}
            onClick={() => handlePrevPage()}
            disabled={currentPage == 1}
          >
            {"<"}
          </button>
          {t(`Page`)} <span>{currentPage}</span> of{" "}
          <span>{pagination?.totalPages}</span>
          <button
            onClick={() => handleNextPage()}
            type="button"
            className={`ml-1 px-2 py-[4px] cursor-pointer rounded-[5px] text-[20px]`}
            style={{
              backgroundColor: bg,
              border: `1px solid ${border}60`,
              color: "white",
              fontSize: "12px",
            }}
            disabled={currentPage == pagination?.totalPages}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondaryBetReport;
