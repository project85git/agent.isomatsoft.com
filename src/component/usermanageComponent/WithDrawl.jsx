
import React, { useEffect, useState } from "react";
import wallet from "../../assets/wallet.png";
import watch from "../../assets/Watch.png";
import cross from "../../assets/BookmarkX.png";
import coin from "../../assets/rupees.png";
import logo from "../../assets/logo.png";

import { SlScreenDesktop } from "react-icons/sl";
import { Badge, Progress, useToast } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchGetRequest } from "../../api/api";
import { useTranslation } from "react-i18next";
import { convertToUniversalTime, formatDate, formatDateTime } from "../../../utils/utils";

const WithDrawl = ({id}) => {

  const [currentPage, setCurrentPage] = useState(1);
  const [allWithdraw, aetallWithdraw] = useState();
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState("approved");
  const [transactionCount, setTransactionCount] = useState();
  const [allAmount,setAllAmount]=useState(0)
  
  const [pagination, setPagination] = useState({});
  const totalPages = pagination.totalPages;
  const toast = useToast();
  
const { t, i18n } = useTranslation();
 
const { color,primaryBg,secondaryBg, iconColor,bg,hoverColor,hover,text, font, border } = useSelector(state => state.theme);

const getAlldashboardDetails = async () => {
  setLoading(true);
  let url = `${import.meta.env.VITE_API_URL}/api/transaction/get-all-withdraw-single/${id}?page=${currentPage}&limit=20&status=${transactionType}`;
  try {
    let response = await fetchGetRequest(url);
    setAllAmount(response?.transactionAmount)
    const data = response.data;
    const receivedData = response.data;
    setPagination(response.pagination);
    if (receivedData) {
      aetallWithdraw(receivedData);
    }
    setTransactionCount(response.transactionsCount);
    setLoading(false);
  } catch (error) {
    toast({
      description: `${error?.response?.data?.message}`,
      status: "error",
      duration: 4000,
      position: "top",
      isClosable: true,
    });
  }
};

useEffect(() => {
  getAlldashboardDetails();
}, [currentPage, transactionType]);

const handleFilter = (name) => {
  setCurrentPage(1)
  setTransactionType(name);
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
  return (
    <div className="flex flex-col mt-5 gap-6">
      {/* first */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div
          onClick={() => handleFilter("approved")}
          style={{
            background: "linear-gradient(96deg, #46F209 0%, #01B574 64.37%)",
          }}
          className="flex items-center cursor-pointer text-white w-[100%] p-3 gap-2 py-6 rounded-md justify-between"
        >
          <div>
            <p className="font-semibold text-md ">
              {t(`Successful`)} {t(`Withdraw`)}
            </p>
            <p className="font-semibold text-lg "> {transactionCount?.approvedTransaction}</p>
          </div>
          <img src={wallet} className="h-[70px] w-[70px]" alt="" />
        </div>

        <div
          onClick={() => handleFilter("pending")}
          style={{
            background: "linear-gradient(96deg,  #CEB352 0%,  #FFA800 64.37%)",
          }}
          className="flex cursor-pointer items-center p-3 text-white gap-2 py-6 w-[100%] rounded-md justify-between"
        >
          <div>
            <p className="font-semibold text-md  ">
              {t(`Pending`)} {t(`Withdraw`)}
            </p>
            <p className="font-semibold text-lg ">{transactionCount?.pendingTransaction}</p>
          </div>
          <img src={watch} className="h-[70px] w-[70px]" alt="" />
        </div>

        <div
          onClick={() => handleFilter("reject")}
          style={{
            background: "linear-gradient(100deg, #FF6A6A 35.51%, #F00 103.54%)",
          }}
          className="flex cursor-pointer items-center text-white p-3 gap-2 py-6 w-[100%] rounded-md justify-between"
        >
          <div>
            <p className="font-semibold text-md ">
              {t(`Reject`)} {t(`Withdraw`)}
            </p>
            <p className="font-semibold text-lg ">{transactionCount?.rejectTransaction}</p>
          </div>
          <img src={cross} className="h-[70px] w-[70px]" alt="" />
        </div>
      </div>

      {/* second table-div */}
      <div className="">
        <div
          
          className="h-[100%] bg-white rounded-md overflow-scroll p-3  w-[100%]   "
        >
          {loading && (
            <Progress size="xs" isIndeterminate colorScheme="#e91e63" />
          )}
          <p style={{color:iconColor}} className=" font-semibold text-sm pb-2 pt-2 text-left">
            {t(`All`)} {t(`Withdraw`)} {t(`Details`)}
          </p>
          <table className="w-[100%] overflow-scroll ">
            <tr className="text-left p-2   border-b h-[30px] border-gray-600 text-[10px] font-bold ">
              <th className="text-left min-w-[100px]"> {t(`Trx`)}</th>
              <th className="min-w-[120px]">{t(`Gateway`)}/{t(`Method`)}</th>

              <th className="min-w-[100px]">{t(`Date`)}/{t(`Time`)}</th>
              <th className="min-w-[110px]">{t(`User`)}/{t(`UserId`)}</th>
              <th className="min-w-[120px]">{t(`Withdraw`)} {t(`Amount`)}</th>
              <th className="min-w-[100px]">{t(`Wallet`)} {t(`Balance`)}</th>
              <th className="min-w-[100px]">{t(`Status`)}</th>
              {/* <th className="text-right">Action</th> */}
            </tr>
            {allWithdraw &&
              allWithdraw.map((item) => {
                return (
                  <tr
                    key={item.user_id}
                    className="text-left  h-[60px]  m-auto  border-b border-gray-600 text-xs"
                  >
                    <td className="w-[150px]">
                      <div className="flex flex-col gap-[2px]  ">
                        
                        <p className="text-[9px]   ">
                          {item.transaction_id}
                        </p>
                      </div>
                    </td>
                    <td>
                    <div className=" flex "><Badge style={{fontSize:'9px'}}>{item?.method}</Badge></div>

                    </td>
                    <td>
                      <div className="flex flex-col  gap-[2px] ">
                      <p>{formatDateTime(item.initiated_at).split(" ")[0]}</p>
                      <p className="text-[9px] font-bold">({formatDateTime(item.initiated_at).split(" ")[1]})</p>

                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col  gap-[2px] ">
                        <p>{item.username}</p>
                        <p className="text-[9px]   ">
                         ( {item.user_id})
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-[2px]">
                        <p className="text-[14px] ">
                           {item.withdraw_amount?.toFixed(2)} +{" "}
                          <span className="text-xs text-red-500 ">
                            {item.bonus}
                          </span>
                        </p>
                        <p className="text-xs   ">
                          {item.withdraw_amount?.toFixed(2) + item.bonus} {item.currency}
                        </p>
                      </div>
                    </td>
                    <td className="">
                      <div className="flex font-semibold     gap-2">
                       
                        <span>{item.wallet_amount?.toFixed(2)}</span> {item?.currency}
                      </div>
                    </td>

                    <td>
                      <div className="flex flex-col  justify-between gap-[4px]  ">
                        <button
                          className={`py-[4px] w-[100%] text-[9px] m-auto rounded-[4px]   ${
                            item.status == "approved"
                              ? "bg-[#01B574]"
                              : "bg-red-500"
                          } `}
                        >
                          {item.status}
                        </button>
                        
                      </div>
                    </td>
                    {/* <td>
                      <div className=" flex justify-end">
                        <Link
                          key={item.user_id}
                          to=""
                        >
                          <SlScreenDesktop
                            cursor="pointer"
                            color={iconColor}
                            fontSize="15px"
                          />
                        </Link>
                      </div>
                    </td> */}
                  </tr>
                );
              })}
          </table>
        </div>
      </div>



{allWithdraw && allWithdraw.length > 0 && (
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

export default WithDrawl;
