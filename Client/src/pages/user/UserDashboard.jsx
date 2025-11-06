import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUserDashboard } from "../../hooks/appHook.js";
import Loader from "../../components/Loader.jsx";
import { formatRupee } from "../../utils/helper.js";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userDashboard, setUserDashboard] = useState({});
  const { data, isSuccess, isLoading } = useGetUserDashboard();

  useEffect(() => {
    setUserDashboard(data?.data);
  }, [isSuccess]);

  if (isLoading)
    return (
      <div className=" w-full h-full flex justify-center items-center mt-[250px]">
        <Loader />
      </div>
    );

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
                Dashboard
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow transition-colors">
            {/* Icon */}
            <div className="mb-2">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>

            {/* Title */}
            <p className="text-slat text-sm mb-2">Total Investment</p>

            {/* Value */}
            <h3 className="text-whie text-3xl font-bold">
              {formatRupee(userDashboard?.totalInvestmentCapital)}
            </h3>
          </div>

          {userDashboard?.investedByPlan?.map((inv, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 border border-slate-200 shadow transition-colors"
            >
              {/* Icon */}
              <div className="mb-2">
                <svg
                  className="w-8 h-8 text-slate-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 15v4m6-6v6m6-4v4m6-6v6M3 11l6-5 6 5 5.5-5.5"
                  />
                </svg>
              </div>

              {/* Title */}
              <p className="text-slat text-sm mb-2">{inv?.plan}</p>

              {/* Value */}
              <h3 className="text-whie text-3xl font-bold">
                {formatRupee(inv?.capital)}
              </h3>
            </div>
          ))}

          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow transition-colors">
            {/* Icon */}
            <div className="mb-2">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Title */}
            <p className="text-slat text-sm mb-2">Total Paid till date</p>

            {/* Value */}
            <h3 className="text-whie text-3xl font-bold">
              {formatRupee(userDashboard?.totalPaidTillDate)}
            </h3>
          </div>
        </div>
      </div>

      <div className="w-full lg:h-[350px] grid xl:flex grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
        <div className="lg:max-w-sm w-full bg-white rounded-lg p-6 border border-slate-200 shadow">
          <h1 className=" mb-6 font-bold leading-7 text-xl pb-4 border-b border-[#e5e7eb]">
            Your Details
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Full Name */}
              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Full name:
                </h3>
                <p className="text-slate-600">
                  {userDashboard?.investorDetails?.fullName}
                </p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Investor ID:
                </h3>
                <p className="text-slate-600">
                  {userDashboard?.investorDetails?.investorId}
                </p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Contact Details:
                </h3>
                <p className="text-slate-600">
                  {userDashboard?.investorDetails?.contactDetails?.phone}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Full Name */}
              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Join Date:
                </h3>
                <p className="text-slate-600">
                  {userDashboard?.investorDetails?.joinDate?.split("T")[0]}
                </p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Investmetns:
                </h3>
                <p className="text-slate-600">
                  {userDashboard?.investorDetails?.totalInvestments}
                </p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Status:
                </h3>
                <span
                  className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm ${
                    userDashboard?.investorDetails?.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {userDashboard?.investorDetails?.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className=" bg-white flex flex-col rounded-lg p-6 border border-slate-200 shadow w-full max-w-[788px] h-full">
          <h1 className="mb-6 font-bold leading-7 text-xl pb-4 border-b border-[#e5e7eb]">
            Clear Months
          </h1>

          <div className="relative w-full h-full overflow-auto">
            <table className="w-full max-h-full  text-sm text-left rtl:text-right text-gray-500 text-nowrap">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 w-full">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Investment ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Month NO
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Return Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total Return
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Plan Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Payment type cr
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Payment Proof
                  </th>
                </tr>
              </thead>
              <tbody>
                {userDashboard?.clearMonths?.map((inv, index) => (
                  <tr
                    key={index}
                    onClick={() =>
                      navigate(`/user/investments/${inv?.investmentId}`)
                    }
                    className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium">{inv?.investmentId}</td>
                    <td className="px-6 py-4 font-medium">{inv?.monthNo}</td>
                    <td className="px-6 py-4 font-medium">
                      {inv?.returnDate?.split("T")[0]}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatRupee(inv?.totalReturn)}
                    </td>
                    <td className="px-6 py-4 font-medium">{inv?.planType}</td>
                    <td className="px-6 py-4 font-medium">{inv?.paymentType}</td>
                    <td className="px-6 py-4 font-medium">{inv?.paymentProof}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow mt-3">
        <h1 className=" mb-6 font-bold leading-7 text-xl pb-4 border-b border-[#e5e7eb]">
          Comming Payments
        </h1>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 text-nowrap">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 w-full">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Investment ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Month NO
                </th>
                <th scope="col" className="px-6 py-3">
                  Return Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Return
                </th>
                <th scope="col" className="px-6 py-3">
                  Payment Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Payment type cr
                </th>
              </tr>
            </thead>
            <tbody>
              {userDashboard?.comingPayments?.map((inv, index) => (
                <tr
                  key={index}
                  onClick={() =>
                    navigate(`/user/investments/${inv?.investmentId}`)
                  }
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium">{inv?.investmentId}</td>
                  <td className="px-6 py-4 font-medium">{inv?.monthNo}</td>
                  <td className="px-6 py-4 font-medium">
                    {inv?.returnDate?.split("T")[0]}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatRupee(inv?.totalReturn)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    <span
                      className={`${
                        inv?.paymentStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      } text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`}
                    >
                      {inv?.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{inv?.planType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default UserDashboard