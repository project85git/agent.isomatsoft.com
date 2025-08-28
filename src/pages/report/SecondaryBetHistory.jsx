import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Progress,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { MdWorkHistory } from "react-icons/md";
import { fetchGetRequest } from "../../api/api";
import nodatafound from "../../assets/emptydata.png";
import { useTranslation } from "react-i18next";
const SecondaryBetHistory = () => {
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

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userCategory, setUserCategory] = useState("");
  const [search, setSearch] = useState("");
  const toast = useToast();
  const [pagination, setPagination] = useState({});
  const totalPages = pagination.totalPages;
  const [limit, setLimit] = useState(20);
  const [betsCount, setBetsCount] = useState({});
  const [betAmount, setBetsAmount] = useState({});
  const [status, setStatus] = useState("all");
  const [casinoBetData, setCasinoBetData] = useState([]);
  const { t, i18n } = useTranslation();

  const getCasinoBetHistory = async () => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/bet/get-all-secondary-bet?status=${status}&page=${currentPage}&limit=${limit}`;

    if (search) {
      url += `&search=${search}`;
    }
    if (userCategory) {
      url += `&category=${userCategory}`;
    }

    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data;
      setCasinoBetData(receivedData);
      setPagination(response.pagination);
      setBetsCount(response);
      setBetsAmount(response.betAmount);
      setLoading(false);
    } catch (error) {
      toast({
        description: `${
          error?.data?.message || error?.response?.data?.message
        }`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

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

  useEffect(() => {
    let id;
    id = setTimeout(() => {
      getCasinoBetHistory();
    }, 300);

    return () => clearTimeout(id);
  }, [currentPage, search, userCategory, limit, status]);

  return (
    <div>
      <div>
        {/* table */}

        <div>
          {/* <RadioGroup>
  <Stack spacing={4} wrap={"wrap"}  direction='row'>
    <Radio value='1' color={"red"}>
      All
    </Radio>
    <Radio value='2' style={{fontSize:'10px'}}>Soccer</Radio>
    <Radio value='3'>Tennis</Radio>

    <Radio value='4'>Cricket</Radio>
    <Radio value='5'>Cricket/Fancy </Radio>
    <Radio value='6'>Odds </Radio>
    <Radio value='7'>Bookmaker </Radio>




  </Stack>
</RadioGroup> */}
        </div>

        <div className="flex justify-between flex-col gap-4 sm:flex-row  mt-6  pr-5 sm:items-center">
          <p
            style={{ color: iconColor }}
            className={`font-bold mt-6  w-[100%]    flex items-center gap-2 rounded-[6px]  text-lg`}
          >
            <MdWorkHistory fontSize={"30px"} style={{ color: iconColor }} />
            {t(`Casino`)} {t(`Bet`)} {t(`History`)}{" "}
            <span className={`text-green-600`}></span>
          </p>
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

        <div className={` flex flex-wrap  items-center mt-8 gap-4 `}>
          <input
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={`${t(`search`)} ${t(`username`)}`}
            style={{ border: `1px solid ${border}60` }}
            className={`border pl-4 outline-none text-xs rounded-[4px] p-[8px]  `}
          />
          <div className="bg-white flex items-center cursor-pointer shadow-md gap-2 rounded-md px-4 p-1">
            <p className="text-[16px] font-semibold text-gray-800">
              {t(`Total`)} {t(`Bet`)} {t(`Amount`)}:
            </p>
            <p className="text-lg font-bold text-green-600">
              {betsCount?.totalBetAmount?.toFixed(2)}
            </p>
          </div>
          <div
            onClick={() => {
              setStatus("all");
              setCurrentPage(1);
            }}
            className="bg-white flex items-center cursor-pointer shadow-md gap-2 rounded-md px-4 p-1"
          >
            <p className="text-[16px] font-semibold text-gray-800">
              {t(`All`)} {t(`Bet`)}:
            </p>
            <p className="text-lg font-bold text-blue-600">
              {betsCount?.allBet}
            </p>
          </div>
          <div
            onClick={() => {
              setStatus("lose");
              setCurrentPage(1);
            }}
            className="bg-white flex items-center cursor-pointer shadow-md gap-2 rounded-md px-4 p-1"
          >
            <p className="text-[16px] font-semibold text-gray-800">
              {t(`LoseBet`)}:
            </p>
            <p className="text-lg font-bold text-red-600">
              {betsCount?.loseBet}
            </p>
          </div>
          <div
            onClick={() => {
              setStatus("win");

              setCurrentPage(1);
            }}
            className="bg-white flex items-center cursor-pointer shadow-md gap-2 rounded-md px-4 p-1"
          >
            <p className="text-[16px] font-semibold text-gray-800">
              {t(`WinBet`)}:
            </p>
            <p className="text-lg font-bold text-green-600">
              {betsCount?.winBet}
            </p>
          </div>
          <div
            onClick={() => {
              setStatus("pending");
              setCurrentPage(1);
            }}
            className="bg-white flex items-center cursor-pointer shadow-md gap-2 rounded-md px-4 p-1"
          >
            <p className="text-[16px] font-semibold text-gray-800">
              {t(`Pending`)}:
            </p>
            <p className="text-lg font-bold text-green-600">
              {betsCount?.pending}
            </p>
          </div>
        </div>

        <div>
          <div
            className={`h-[100%] rounded-[16px] bg-white p-3  w-[100%]  mt-2 `}
          >
            {loading && (
              <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
            )}
            <p
              style={{ color: iconColor }}
              className={`font-semibold text-sm  pt-2 text-left`}
            >
              {t(`All`)} {t(`Bet`)} {t(`Details`)}
            </p>
            <div className="overflow-auto">
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
                  {casinoBetData &&
                    casinoBetData?.map((item) => {
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
              {loading && casinoBetData.length == 0 ? (
                <div className="flex justify-center items-center">
                  <img src={nodatafound} className="w-[300px]" />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          {casinoBetData?.length > 0 && (
            <p style={{ color: iconColor }} className="text-xs font-semibold ">
              {t(`Showing`)} 1 {t(`to`)} {limit} {t(`of`)} 12 {t(`Entries`)}
            </p>
          )}
          {casinoBetData && casinoBetData.length > 0 && (
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
              {t(`Page`)} <span>{currentPage}</span> {t(`of`)}{" "}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SecondaryBetHistory;
