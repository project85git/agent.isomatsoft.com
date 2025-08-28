"use client";

import React, { useEffect, useState } from "react";
import { TbCoin } from "react-icons/tb";
import { BiSolidWalletAlt } from "react-icons/bi";
import { AiOutlineGlobal } from "react-icons/ai";
import { VscUnverified } from "react-icons/vsc";
import { BsSearch } from "react-icons/bs";
import coin from "../../assets/rupees.png";
import logo from "../../assets/logo.png";
import { Progress, useToast, Badge } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchGetRequest, sendPostRequest } from "../../api/api";
import nodata from "../../assets/empty.png";
import { useTranslation } from "react-i18next";
import { formatDate, formatDateTime } from "../../../utils/utils";

const SecondaryBetHistory = ({ userData, type }) => {
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
  const [limit, setLimit] = useState("20");
  const [betsCount, setBetsCount] = useState({});
  const [betAmount, setBetsAmount] = useState({});
  const [status, setStatus] = useState("all");
  const [casinoBetData, setCasinoBetData] = useState([]);
  const user = useSelector((state) => state.authReducer);
  const adminDetails = user.user || {};
  const { t, i18n } = useTranslation();

  const getCasinoBetHistory = async () => {
    setLoading(true);
    let url;

    if (type === "user") {
      url = `${
        import.meta.env.VITE_API_URL
      }/api/bet/get-all-secondary-bet-by-parent-of-user?status=${status}&page=${currentPage}&limit=${limit}&username=${
        userData.username
      }`;
    }

    if (type === "admin") {
      url = `${
        import.meta.env.VITE_API_URL
      }/api/bet/get-all-secondary-bet-by-parent-of-user?status=${status}&page=${currentPage}&limit=${limit}`;
    }

    if (search) {
      url += `&search=${search}`;
    }

    if (userCategory) {
      url += `&category=${userCategory}`;
    }

    let payload;

    if (type === "admin") {
      payload = {
        parent_admin_username: userData?.admin_id,
        parent_admin_role_type: userData?.role_type,
      };
    }

    if (type === "user") {
      payload = {
        username: userData?.username,
        role_type: userData?.role_type,
      };
    }

    try {
      let response = await sendPostRequest(url, payload);
      const data = response.data;
      const receivedData = response.data;
      setCasinoBetData(receivedData.transactions);
      setPagination(response.pagination);
      setBetsAmount(receivedData.summary);
      setLoading(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    let id;
    id = setTimeout(() => {
      getCasinoBetHistory();
    }, 100);

    return () => clearTimeout(id);
  }, [currentPage, search, userCategory, limit, status]);

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
  return (
    <div className="mt-2  ">
      {/* four-card */}
      <div className={` flex flex-wrap  items-center mt-8 gap-4 `}>
        <div className="bg-white flex items-center cursor-pointer shadow-md gap-2 rounded-md px-4 p-1">
          <p className="text-[16px] font-semibold text-gray-800">
            {t(`Total`)} {t(`Bet`)} {t(`Amount`)}:
          </p>
          <p className="text-lg font-bold text-green-600">
            {betAmount?.totalAmount?.toFixed(2)}
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
            {betAmount?.totalTransactions - betAmount?.winBets}
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
            {betAmount?.totalLoseAmount}
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
            {betAmount?.totalWinAmount}
          </p>
        </div>
        {/* <div
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
            {betAmount?.pendingBet}
          </p>
        </div> */}
      </div>
      <div className="overflow-auto bg-white mt-5 p-4 rounded-lg">
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
                {t(`Username`)} / {t(`User`)} {t(`id`)}
              </th>
              <th className="w-[120px] ">
                {t(`Game`)} {t(`id`)}{" "}
              </th>
              <th className="min-w-[120px] ">
                {t(`Bet`)} {t(`Placed`)}
              </th>
              <th className="min-w-[120px] ">
                {t(`Event`)} {t(`Type`)}
              </th>
              <th className="min-w-[120px] ">{t(`Amount`)}</th>
              <th className="min-w-[120px] ">
                {t(`Win`)}/{t(`Loss`)}
              </th>
              <th className="min-w-[120px] ">{t(`Result`)}</th>

              <th className="text-right min-w-[120px] ">{t(`Status`)}</th>
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
                          ({item?.UserId?.slice(0, 10)})<span>..</span>
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
                    <td className="">{formatDateTime(item?.created_at).split(" ")[0]}</td>
                    <td className="">
                      <Badge colorScheme="blue">{item?.game_type}</Badge>
                    </td>
                    <td className="">
                      <div className="flex items-center justify-center">
                        <button
                          className={`p-[6px] text-yellow-600 font-extrabold rounded-[8px] w-[60px] `}
                        >
                          {item.amount?.toFixed(2)}
                        </button>
                      </div>
                    </td>
                    <td
                      className={`font-bold  ${
                        item?.status == "pending"
                          ? "text-orange-400"
                          : item?.win_loss !== "0"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {" "}
                      {item?.Status !== "running" &&
                        (item?.win_loss !== "0" ? "+" : "-")}
                      {item?.status == "pending"
                        ? "0"
                        : item?.win_loss !== "0"
                        ? item?.win_loss
                        : item?.amount?.toFixed(2)}
                    </td>
                    <td className=" ">
                      <Badge
                        colorScheme={
                          item?.status == "pending"
                            ? "orange"
                            : item?.win_loss !== "0"
                            ? "green"
                            : "red"
                        }
                      >
                        {item?.status == "pending"
                          ? "Pending"
                          : item?.win_loss !== "0"
                          ? "Win"
                          : "lose"}
                      </Badge>
                    </td>
                    <td className={`font-bold text-right   `}>
                      <Badge> {item?.status}</Badge>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {casinoBetData.length === 0 && (
          <div className="w-[100%]  flex justify-center items-center">
            <img src={nodata} className="w-[150px]" />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
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
      </div>
    </div>
  );
};

export default SecondaryBetHistory;
