import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetInvestmentDetails } from "../../hooks/appHook.js";
import Loader from "../../components/Loader.jsx";
import toast from "react-hot-toast";
import { formatRupee } from "../../utils/helper.js";

const UserInvestment = () => {
  const [investment, setInvestment] = useState({});
  const [showAlertModel, setShowAlertModel] = useState(false);
  const { investmentId } = useParams();

  const { data, isSuccess, isLoading, isError } =
    useGetInvestmentDetails(investmentId);

  useEffect(() => {
    setInvestment(data?.data);
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
          <li className="inline-flex items-center">
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
                  strok-linecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <Link
                to={-2}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Investores
              </Link>
            </div>
          </li>

          <li>
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
              <Link
                to={-1}
                className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2"
              >
                Investor
              </Link>
            </div>
          </li>

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
                Investment
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow">
          <div className="mb-6 pb-4 border-b border-[#e5e7eb] w-full flex items-center justify-between">
            <h1 className="font-bold leading-7 text-xl">Investment Details</h1>
            <span
              onClick={() => setShowAlertModel(true)}
              className=" cursor-pointer font-semibold hover:text-blue-700"
            >
              Bank Ac Details
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Investment ID:
                </h3>
                <p className="text-slate-600">{investment?.investmentId}</p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Plan Type:
                </h3>
                <p className="text-slate-600">{investment?.planType}</p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Start from:
                </h3>
                <p className="text-slate-600">
                  {investment?.startFrom?.split("T")[0]}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Capital:
                </h3>
                <p className="text-slate-600">
                  {formatRupee(investment?.capital)}
                </p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  ROI:
                </h3>
                <p className="text-slate-600">{investment?.roi}%</p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  End On:
                </h3>
                <p className="text-slate-600">
                  {investment?.endFrom?.split("T")[0]}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow">
          <h1 className=" mb-6 font-bold leading-7 text-xl pb-4 border-b border-[#e5e7eb]">
            Investment Analytics
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Repayment on:
                </h3>
                <p className="text-slate-600">
                  {investment?.repaymentOn?.split("T")[0] || "-"}
                </p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Status:
                </h3>
                <span
                  className={`${
                    investment?.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800 "
                  } text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`}
                >
                  {investment?.status}
                </span>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Overall Returns:
                </h3>
                <p className="text-slate-600">
                  {formatRupee(investment?.overallReturn)}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Capital Retrun Till Date:
                </h3>
                <p className="text-slate-600">
                  {formatRupee(investment?.capitalReturnTillDate)}
                </p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Profit Return Till Date:
                </h3>
                <p className="text-slate-600">
                  {formatRupee(investment?.profitReturnTillDate)}
                </p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Total Paid Till Date:
                </h3>
                <p className="text-slate-600">
                  {formatRupee(investment?.totalPaidTillDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow mt-3">
        <h1 className=" mb-6 font-bold leading-7 text-xl pb-4 border-b border-[#e5e7eb]">
          Return Months
        </h1>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 bg-green-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 w-full">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Month NO
                </th>
                <th scope="col" className="px-6 py-3">
                  Return Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Capital Return
                </th>
                <th scope="col" className="px-6 py-3">
                  Profit Return
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Return
                </th>
                <th scope="col" className="px-6 py-3">
                  Remaining Balance
                </th>
                <th scope="col" className="px-6 py-3">
                  Payment Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Payment type DR.
                </th>
                <th scope="col" className="px-6 py-3">
                  Payment Proof.
                </th>
              </tr>
            </thead>
            <tbody>
              {investment?.monthlyReturns?.map((month, index) => (
                <tr
                  key={index}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium">{month?.monthNo}</td>
                  <td className="px-6 py-4 font-medium text-nowrap">
                    {month?.returnDate?.split("T")[0]}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatRupee(month?.capitalReturn)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatRupee(month?.profitReturn)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatRupee(month?.totalReturn)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatRupee(month?.remainingBalance)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    <span
                      className={`${
                        month.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      } text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`}
                    >
                      {month?.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {month?.paymentType || "-"}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {month?.paymentProof || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* aleart Model  */}
      <div
        className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-[#eee5] ${
          showAlertModel ? "flex" : " hidden"
        }`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow-sm">
            <button
              onClick={() => setShowAlertModel((prev) => !prev)}
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              data-modal-hide="popup-modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <h3 className=" text-2xl font-bold">Bank Account Details</h3>
              <h3 className="my-5 text-lg font-normal text-gray-800">
                Bank Name:{" "}
                <span className=" font-medium">{investment?.bankName}</span>,
                Holder Name:{" "}
                <span className=" font-medium">
                  {investment?.bankHolderName}
                </span>
                , Account Number:{" "}
                <span className=" font-medium">{investment?.bankAcNumber}</span>{" "}
                & IFSC Number:{" "}
                <span className=" font-medium">{investment?.bankIFSCCode}</span>
              </h3>
              <button
                onClick={() => setShowAlertModel((prev) => !prev)}
                type="button"
                className=" w-full py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserInvestment