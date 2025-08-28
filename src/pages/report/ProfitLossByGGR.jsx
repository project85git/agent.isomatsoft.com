import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import * as XLSX from 'xlsx';
import { IoSearchOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import coin from "../../assets/rupees.png";
import logo from "../../assets/logo.png";
import { BsFiletypeXlsx, BsFillCalendar2DateFill } from "react-icons/bs";
import {
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
import { convertToUniversalTime, currencyOptions, formatDate, formatDateTime, getGameProvider } from "../../../utils/utils";
import { IoMdCloudDownload } from "react-icons/io";
import html2pdf from "html2pdf.js";
const ProfitLossByGGR = () => {
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
  const [username, setUsername] = useState("");
  const [currency, setCurrency] = useState("");
  const [siteData, setSiteData] = useState({});
  const [providerData, setProviderData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(""); // Default value for Week

  const handleOptionChange = (value, id) => {
    setSelectedOption(value);
    setActiveCategory(id);
    setCurrentPage(1)
  };
  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const [search, setSearch] = useState("");
  const toast = useToast();

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
    setCurrentPage(1)

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
    }/api/bet/get-ggr-report-by-date?start_date=${formattedFromDate}&end_date=${formattedToDate}&limit=${limit}&page=${currentPage}`;

    if (username) {
      url += `&search=${username}`;
    }
    if (currency) {
      url += `&currency=${currency}`;
    }
    if (providerId) {
      url += `&provider_id=${providerId}`;
    }
    if (formattedFromDate && formattedToDate) {
      url += `&from=${formattedFromDate}&to=${formattedToDate}`;
    } else {
      url += `&filter=${selectedOption}`;
    }

    try {
      let response = await fetchGetRequest(url);
      setLoading(false);
      if (response) {
        setData(response.records);
        setTotalGGR(response?.graphData[0]);
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
    }/api/secondary-provider/get-provider?limit=200`;

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
  }, []);
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
      id: 1,
      title: "24H",
      value: "24h",
    },
    {
      id: 2,
      title: "7 Days",
      value: "7days",
    },
    {
      id: 3,
      title: "30 DAYS",
      value: "last_30_days",
    },
    {
      id: 4,
      title: "TODAY",
      value: "today",
    },
    {
      id: 5,
      title: "YESTERDAY",
      value: "yesterday",
    },
    {
      id: 6,
      title: "THIS MONTH",
      value: "this_month",
    },
    {
      id: 7,
      title: "PREVIOUS MONTH",
      value: "last_month",
    },
  ];

  const { selectedWebsite, siteDetails } = useSelector(
    (state) => state.websiteReducer
  );
  let filteredData = siteDetails.filter((item) => item.selected === true);

 
  const handleDownloadReport = async (type) => {
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
      if(type=="pdf"){
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
      }else if(type=="xl"){
        generateExcelAndDownload(data)
      }

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
      return "<p style='color: #FF0000;'>No records found</p>";
    }
  
    // Calculate total wager and total win/loss from records
    const totalWager = records.reduce((sum, record) => sum + parseFloat(record.Amount || 0), 0);
    const totalWinLoss = records.reduce((sum, record) => sum + parseFloat(record.WinLoss || 0), 0);
    const totalAmount = records.reduce((sum, record) => sum + parseFloat(record.Amount || 0), 0);
  
    // Calculate Total GGR
    const totalGGR = totalWager - totalWinLoss;
  
    const tableRows = records.map((record, index) => {
      const winLossDiff = record.WinLoss === "0" ? record.Amount : record?.WinLoss;
      const value = record ? (record.WinLoss === "0" ? "-" : "+") : "";
      const winLossClass = record.WinLoss === "0" ? "text-red-600 font-bold" : "text-green-500 font-bold";
      const statusClass = record.WinLoss === "0" ? "text-red-500" : "text-green-500";
      const statusData = record?.WinLoss === "0" ? "Lose" : "Win";
      const gameProviderName = getGameProvider(record.GpId);
  
      return `
        <tr class="text-sm text-left border-b border-gray-300">
          <td class="border px-4 py-3 text-left">${index + 1}</td>
          <td class="border px-4 py-3 text-left">${record?.GameName?.slice(0, 15) || "N/A"}</td>
          <td class="border px-4 py-3 text-left">${record.Provider}</td>
          <td class="border px-4 py-3 text-left">${record.Username}</td>
          <td class="border px-4 py-3 text-left">${record.Amount}</td>
          <td class="border px-4 py-3 text-left ${winLossClass}">${value} ${winLossDiff}</td>
          <td class="border px-4 py-3 text-left">${record.Currency}</td>
          <td class="border px-4 py-3 text-left ${statusClass} font-bold">${statusData}</td>
        </tr>
      `;
    });
  
    const tableHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p class="font-bold text-2xl my-4 text-center" style="color: #3B82F6;">Game Wise Report Card</p>
        <table class="w-full" style="border-collapse: collapse; width: 100%; background-color: #f9f9f9;">
          <thead>
            <tr style="background-color: #3B82F6; color: #ffffff; font-weight: bold;">
              <th class="px-4 py-3 text-left" style="border: 1px solid #ffffff;">S.No</th>
              <th class="px-4 py-3 text-left" style="border: 1px solid #ffffff;">Game Name</th>
              <th class="px-4 py-3 text-left" style="border: 1px solid #ffffff;">Provider Name</th>
              <th class="px-4 py-3 text-left" style="border: 1px solid #ffffff;">Player</th>
              <th class="px-4 py-3 text-left" style="border: 1px solid #ffffff;">Amount</th>
              <th class="px-4 py-3 text-left" style="border: 1px solid #ffffff;">P/L</th>
              <th class="px-4 py-3 text-left" style="border: 1px solid #ffffff;">Currency</th>
              <th class="px-4 py-3 text-left" style="border: 1px solid #ffffff;">Result</th>
            </tr>
          </thead>
          <tbody style="background-color: #ffffff;">
            ${tableRows.join("")}
          </tbody>
        </table>
        <div style="display:flex; text-align: right; margin-top: 20px; height:50px; font-size: 18px; font-weight: bold; color: #3B82F6;">
          Total Wager: ${totalWager.toFixed(2)} | 
          Total GGR: ${totalGGR.toFixed(2)} | 
          Total Amount: ${totalAmount.toFixed(2)}
        </div>
      </div>
    `;
  
    return tableHtml;
  };
  
  const generateExcelAndDownload = (records) => {
    if (!Array.isArray(records) || records.length === 0) {
      return;
    }
  
    // Calculate Total Wager, Total GGR, and Total Amount
    const totalWager = records.reduce((sum, record) => sum + parseFloat(record.Amount || 0), 0);
    const totalWinLoss = records.reduce((sum, record) => sum + parseFloat(record.WinLoss || 0), 0);
    const totalGGR = totalWager - totalWinLoss;
    const totalAmount = records.reduce((sum, record) => sum + parseFloat(record.Amount || 0), 0);
  
    // Prepare worksheet data with headers and rows
    const worksheetData = [
      ["S.No", "Game Name", "Provider Name", "Player", "Amount", "P/L", "Currency", "Result"]
    ];
  
    records.forEach((record, index) => {
      const winLossDiff = record.WinLoss === "0" ? record.Amount : record?.WinLoss;
      const statusData = record?.WinLoss === "0" ? "Lose" : "Win";
  
      worksheetData.push([
        index + 1,
        record?.GameName?.slice(0, 15) || "N/A", // Limiting Game Name to 15 characters
        record.Provider,
        record.Username,
        record.Amount,
        winLossDiff,
        record.Currency,
        statusData
      ]);
    });
  
    // Adding summary information (Total Wager, Total GGR, and Total Amount)
    worksheetData.push([]);
    worksheetData.push([`Total Wager: ${totalWager.toFixed(2)}`, `Total GGR: ${totalGGR.toFixed(2)}`, `Total Amount: ${totalAmount.toFixed(2)}`]);
  
    // Create a worksheet and apply it to a new workbook
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
  
    // Customizing columns for better width
    worksheet['!cols'] = [
      { wpx: 50 },  // S.No
      { wpx: 200 }, // Game Name
      { wpx: 150 }, // Provider Name
      { wpx: 150 }, // Player
      { wpx: 100 }, // Amount
      { wpx: 100 }, // P/L
      { wpx: 100 }, // Currency
      { wpx: 100 }  // Result
    ];
  
    // Adding the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Game Report");
  
    // Write the workbook to a buffer and download it
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Game_Report.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          {t(`GGR`)} {t(`Report`)}
        </p>
      </div>
      <div className=" mt-5 rounded-2xl bg-white shadow-sm min-h-[200px] p-5 py-6">
        <div className="flex flex-wrap  items-center gap-2 ">
          {filterByDay?.map((item) => {
            return (
              <div>
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
                setProviderId(e.target.value)
    setCurrentPage(1)
              
              }}
              height={"30px"}
              style={{ border: `1px solid ${border}60` }}
            >
              <option value="">
                {t(`Select`)} {t(`Provider`)}
              </option>

              {providerData?.map((item) => {
                return <option value={item.provider_id}>{item?.provider_name}</option>;
              })}
            </Select>
          </div>
          <div className="flex w-[100%] flex-col  items-start ">
            <p className="font-bold text-sm">
              {t(`Currency`)} {t(`wise`)}
            </p>
            <Select
              onChange={(e) =>{
               setCurrency(e.target.value)
               setCurrentPage(1)
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
          {/* <div className="flex w-[100%] flex-col  items-start ">
            <p className="font-bold text-sm">Player</p>
            <Select height={"30px"} style={{ border: `1px solid ${border}60` }}>
              <option>player A</option>
              <option>player B</option>
              <option>player C</option>
              <option>player D</option>
            </Select>
          </div> */}
          <div className="flex w-[100%] flex-col  items-start ">
            <p className="font-bold text-sm">{t(`Company`)} {t(`Group`)}</p>
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
                  setUsername(e.target.value)
    setCurrentPage(1)
                }
                }
                style={{ border: `1px solid ${border}60` }}
                className=" w-[100%] sm:w-[400px] outline-none rounded-md p-[5px] text-sm"
                placeholder="enter username"
              />

<span
                style={{ backgroundColor: bg }}
                className="px-1 py-[3.5px] rounded-md cursor-pointer"
              >
                <IoMdCloudDownload
                  onClick={()=>handleDownloadReport("pdf")}
                  fontSize={"25px"}
                  color="white"
                />
              </span>
              <span
                style={{ backgroundColor: bg }}
                className="p-[6px] py-[6px] rounded-md cursor-pointer"
              >
                 <BsFiletypeXlsx
                  onClick={()=>handleDownloadReport("xl")}
                  fontSize={"20px"}
                  color="white"
                />
                </span>
            </div>
          </div>
          <div className="flex justify-center items-center">
          <div className="flex pr-5  gap-2">
            <p className="flex text-xs font-bold">
              {t(`Total`)} {t(`GGR`)}:{" "}
              <span className="font-medium">{totalGGr?.ggr}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm">
          {t(`Show`)}
          <select
            onChange={(e) => setLimit(e.target.value)}
            style={{ border: `1px solid ${border}60` }}
            className="text-xs outline-none p-1 rounded-md"
            value={limit}
          >
            <option value="20">20</option>

            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
          </select>
          {t(`Entries`)}
        </div>
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

          <table className={`w-[100%]  `}>
            <tr
          style={{backgroundColor:bg, color:"white"}} 
               className="text-left p-2   border border-gray-300 text-[12px] font-bold"
            >
              <th className="px-3 py-2 border border-gray-300 text-left w-[100px]">
                {t(`#`)} 
              </th>
              <th className="px-3 py-2 border border-gray-300 text-left min-w-[60px] min-w-[100px]">{t(`Game`)} {t(`ID`)}</th>
              <th className="px-3 py-2 border border-gray-300 text-left min-w-[60px] min-w-[100px]">{t(`Provider`)} {t(`ID`)}</th>


              <th className="px-3 py-2 border border-gray-300 text-left min-w-[60px] min-w-[130px]">{t(`Display`)} {t(`Name`)}</th>
              <th className="px-3 py-2 border border-gray-300 text-left min-w-[100px]">{t(`Partner`)} {t(`Name`)}</th>
              <th className="px-3 py-2 border border-gray-300 text-left min-w-[100px]">{t(`Currency`)}</th>
              <th className="px-3 py-2 border border-gray-300 text-left min-w-[100px]">{t(`P/L`)}</th>
              <th className="px-3 py-2 border border-gray-300 text-left min-w-[120px]">{t(`Created`)} {t(`Date`)}</th>
              <th className="px-3 py-2 border border-gray-300 text-left min-w-[100px]">{t(`Result`)} </th>


            </tr>
            <tbody className=" ">
              {data &&
                data.map((item,index) => {
                  return (
                    <tr
                      key={item?._id}
                      style={{ borderBottom: `1px solid ${border}60` }}
                      className={`text-left  h-[60px] m-auto   text-xs `}
                    >
                      <td className="p-3 border border-gray-300 text-left min-w-[60px]">{index}</td>
                      <td className="p-3 border border-gray-300 min-w-[130px]">{item?.GameId}</td>
                      <td className="p-3 border border-gray-300 min-w-[130px]">{item?.GpId}</td>


                      <td className="p-3 border border-gray-300 min-w-[120px]">
                        <div className="flex  flex-col ">
                          <p>{item.Username}</p>
                        </div>
                      </td>
<td className="p-3 border border-gray-300">
  {filteredData[0]?.site_name}
</td>
<td className="p-3 border border-gray-300">
  {item?.Currency}
</td>
<td className={`p-3 border border-gray-300 ${item?.WinLoss=='0'?"text-red-500":"text-green-600"} font-bold `}>
{item?.WinLoss=='0'?"-":"+"} {item?.WinLoss=='0'?Number(item?.Amount).toFixed(2):Number(item?.WinLoss).toFixed(2)}
</td>
                      <td className="p-3 border border-gray-300"> 
                        <div className="flex flex-col items-start justify-center gap-1">
                          <p>{formatDateTime(item?.BetTime).split(" ")[0]}</p>
                          <p className="text-xs font-bold">
                            ({formatDateTime(item?.BetTime).split(" ")[1]})
                          </p>
                        </div>
                      </td>
                      <td className={`p-3 border border-gray-300 ${item?.WinLoss=='0'?"text-red-500":"text-green-600"} font-bold `} >
                         {item?.WinLoss=='0'?"Lose":"Win"}
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

export default ProfitLossByGGR;
