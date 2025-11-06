import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetInvestoInvestments } from "../../hooks/appHook.js";
import Loader from "../../components/Loader.jsx";
import toast from "react-hot-toast";
import { formatRupee } from "../../utils/helper.js";

const UserInvestments = () => {
  const navigate = useNavigate();

  const [investments, setInvestments] = useState([]);
  const { data, isSuccess, isLoading, isError, refetch } =
    useGetInvestoInvestments();

  useEffect(() => {
    setInvestments(data?.data);
  }, [isSuccess]);

  if (isLoading)
    return (
      <div className=" w-full h-full flex justify-center items-center mt-[250px]">
        <Loader />
      </div>
    );
  if (isError) toast.error("Something went wrong!");

  return (
    <main>
      <nav className="flex mb-3" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                Investments
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow mt-3">
        <h1 className=" mb-6 font-bold leading-7 text-xl pb-4 border-b border-[#e5e7eb]">
          Investments
        </h1>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 bg-green-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 w-full">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Investment ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Capital
                </th>
                <th scope="col" className="px-6 py-3">
                  Plan Type
                </th>
                <th scope="col" className="px-6 py-3">
                  ROI
                </th>
                <th scope="col" className="px-6 py-3 text-nowrap">
                  Start From
                </th>
                <th scope="col" className="px-6 py-3 text-nowrap">
                  End On
                </th>
                <th scope="col" className="px-6 py-3 text-nowrap">
                  Repayment ON
                </th>
                <th scope="col" className="px-6 py-3">
                  Completed Month
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {investments?.map((inv, index) => (
                <tr
                key={index}
                  onClick={() => navigate(`/user/investments/${inv?.investmentId}`)}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium">{inv?.investmentId}</td>
                  <td className="px-6 py-4 font-medium">{formatRupee(inv?.capital)}</td>
                  <td className="px-6 py-4 font-medium">{inv?.planType}</td>
                  <td className="px-6 py-4 font-medium">{inv?.roi}%</td>
                  <td className="px-6 py-4 font-medium text-nowrap">{inv?.startFrom?.split("T")[0]}</td>
                  <td className="px-6 py-4 font-medium text-nowrap">{inv?.endFrom?.split("T")[0]}</td>
                  <td className="px-6 py-4 font-medium text-nowrap">{inv?.repaymentOn?.split("T")[0] || "-"}</td>
                  <td className="px-6 py-4 font-medium">{inv?.completedMonths}</td>
                  <td className="px-6 py-4 font-medium">
                    <span className={`${inv?.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"} text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`}>
                      {inv?.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default UserInvestments