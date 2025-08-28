import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import coin from "../../assets/rupees.png";
import logo from "../../assets/logo.png";
import {
  Badge,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Progress,
  useToast,
  Text,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchGetRequest } from "../../api/api";
import { useTranslation } from "react-i18next";
import {
  convertToUniversalTime,
  formatDate,
  formatDateTime,
} from "../../../utils/utils";
import { TbDetails } from "react-icons/tb";
import { IoMdInformationCircleOutline } from "react-icons/io";

const Transaction = ({ id }) => {
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
  const { t, i18n } = useTranslation();

  const [loading1, setLoading1] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = pagination.totalPages;
  const toast = useToast();
  const getAllTransaction = async () => {
    setLoading1(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/transaction/get-all-transaction-single/${id}?page=${currentPage}&limit=20`;
    try {
      let response = await fetchGetRequest(url);
      const data = response.data;
      const receivedData = response.data;
      setPagination(response.pagination);

      if (receivedData) {
        setTransactionData(receivedData);
      }
      setLoading1(false);
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
    }
  };

  useEffect(() => {
    getAllTransaction();
  }, []);

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
    <div className="mt-8 flex flex-col gap-2">
      <div className="flex justify-between   items-center">
        <p style={{ color: iconColor }} className="font-bold text-[15px]">
          {t(`Transaction`)}{" "}
        </p>
        {/* <input
            type="email"
            style={{border:`1px solid ${border}60`}}
            className={`input p-2 rounded-lg  outline-none text-sm`}
            id="Email"
            name="Email"
            placeholder={`${t(`Search here`)}...`}
          /> */}
      </div>

      {/* table */}
      <div className="w-[100%] rounded-md overflow-scroll bg-white">
        {loading1 && (
          <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
        )}
        <div className="h-[100%] rounded-md p-3 w-[100%] ">
          <p
            style={{ color: iconColor }}
            className=" font-medium text-sm  pt-2 text-left"
          >
            {t(`User`)} {t(`Transaction`)} {t(`Details`)}
          </p>
          <table className="w-[100%] overflow-scroll  ">
            <tr className="text-left p-2   border-b h-[30px] border-gray-600 text-[10px] font-bold ">
              <th className="text-left min-w-[130px] max-w-[70px]">
                {t(`Username`)} / {t(`User`)} {t(`id`)}
              </th>
              <th className="min-w-[120px]">
                {t(`Gateway`)}/{t(`Method`)}
              </th>

              <th className="min-w-[100px]">
                {t(`Trx`)} {t(`id`)}
              </th>
              <th className="min-w-[100px]">
                {t(`Date`)}/{t(`Time`)}
              </th>
              <th className="min-w-[100px]">{t(`Amount`)}</th>
              <th className="min-w-[100px]">
                {t(`Wallet`)} {t(`Balance`)}
              </th>
              <th className="min-w-[100px]">{t(`Details`)}</th>
              <th className="min-w-[100px]">{t(`Status`)}</th>
              <th className="min-w-[100px] text-center">{t(`Payment Info`)}</th>
            </tr>
            {transactionData?.map((item) => {
              return (
                <tr
                  key={item._id}
                  className="text-left  h-[60px] m-auto  border-b border-gray-600 text-xs"
                >
                  <td className="max-w-[90px] ">
                    <div className="flex text-left flex-col ">
                      <p>{item.username}</p>
                      <p className="text-[9px] font-bold ">({item.user_id})</p>
                    </div>
                  </td>
                  <td>
                    <div className=" flex ">
                      <Badge style={{ fontSize: "9px" }}>{item?.method}</Badge>
                    </div>
                  </td>
                  <td className="max-w-[80px]  text-[10px]">
                    {item.transaction_id}
                  </td>
                  <td className="">
                    <div className="flex flex-col ">
                      <p>{formatDateTime(item.initiated_at).split(" ")[0]}</p>
                      <p className="text-[9px] font-bold">
                        ({formatDateTime(item.initiated_at).split(" ")[1]})
                      </p>
                    </div>
                  </td>
                  {item.type == "deposit" ? (
                    <td className="text-green-600 font-semibold">
                      {" "}
                      + {item?.deposit_amount?.toFixed(2)} {item.currency}
                    </td>
                  ) : (
                    <td className="text-red-600 font-semibold">
                      - {item?.withdraw_amount?.toFixed(2)} {item.currency}
                    </td>
                  )}
                  <td>
                    <div className="flex  font-semibold  gap-2">
                      {/* <img src={coin} alt="" className="h-[15px] w-[15px]" /> */}
                      <p>
                        {item?.wallet_amount?.toFixed(2)}
                        {item.currency}
                      </p>
                    </div>
                  </td>
                  <td
                    style={{ fontSize: "10px" }}
                    className=" max-w-[80px] font-semibold"
                  >
                    {item?.admin_response || "No Response"}
                  </td>
                  <td>
                  <Badge
                    colorScheme={
                      item?.status === "approved"
                        ? "green"
                        : item?.status === "reject"
                        ? "red"
                        : "yellow"
                    }
                  >
                    {item?.status}
                  </Badge>
                 </td>
                  <td className="flex  mt-[10px]  justify-center">
                    <Menu>
                      <MenuButton>
                        <Button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: 0,
                            gap: "2px",
                            justifyContent: "center",
                            color,
                          }}
                        >
                          <span className="">
                            <IoMdInformationCircleOutline size={"24px"} />
                          </span>
                        </Button>
                      </MenuButton>
                      <MenuList
                        style={{
                          width: "300px",
                          height: "220px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div className="flex flex-col justify-between w-[100%]">
                          {Object.entries(item?.auto_payment_details).map(
                            ([key, value]) => (
                              <MenuItem
                                key={key}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  gap: "8px",
                                  width: "100%",
                                  fontWeight: "bold",
                                }}
                              >
                                <Text>{key.replace(/_/g, " ")}</Text>

                                {/* For 'status', display as Badge */}
                                {key === "status" ? (
                                  <Badge
                                    colorScheme={
                                      value === "paid"
                                        ? "green"
                                        : value === "error"
                                        ? "red"
                                        : "yellow"
                                    }
                                  >
                                    {value}
                                  </Badge>
                                ) : /* For other fields, check for text length and use Tooltip if necessary */
                                value && value.toString().length > 30 ? (
                                  <Tooltip label={value.toString()}>
                                    <Text
                                      style={{
                                        fontWeight: "800",
                                        fontSize: "14px",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "160px",
                                      }}
                                    >
                                      {value.toString().slice(0, 30)}...
                                    </Text>
                                  </Tooltip>
                                ) : (
                                  <Text
                                    style={{
                                      fontWeight: "800",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {value ? value.toString() : "N/A"}
                                  </Text>
                                )}
                              </MenuItem>
                            )
                          )}
                        </div>
                      </MenuList>
                    </Menu>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
      {/* showing card instead of table */}

      {transactionData && transactionData.length > 0 && (
        <div
          className={`text-[16px]   text-sm font-semibold flex m-auto mb-8 mr-5 justify-end gap-3 align-middle items-center mt-2`}
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
  );
};

export default Transaction;
