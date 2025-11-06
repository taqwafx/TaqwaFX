import React, { useEffect, useState } from "react";
import DonutChart from "../../components/DonutChart.jsx";
import { useNavigate } from "react-router-dom";
import { useGetAdminDashboard } from "../../hooks/appHook.js";
import Loader from "../../components/Loader.jsx";
import { formatRupee } from "../../utils/helper.js";

const AdminDashboard = () => {

  const navigate = useNavigate()
  const [adminDashboard, setAdminDashboard] = useState({});
  const { data, isSuccess, isLoading, isError, error } = useGetAdminDashboard();

  useEffect(() => {
    setAdminDashboard(data?.data);
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

      <div className="max-w-7xl mx-auto mt-3">
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
            <p className="text-slat text-sm mb-2  font-medium">
              Overall Investors
            </p>

            {/* Value */}
            <h3 className="text-whie text-3xl font-bold">
              {formatRupee(adminDashboard?.overallStats?.totalInvestors)}
            </h3>
          </div>

          {adminDashboard?.planWiseData?.map((stat, index) => (
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
              <p className="text-slat text-sm mb-2  font-medium">
                {stat.planName} Plan Investor
              </p>

              {/* Value */}
              <h3 className="text-whie text-3xl font-bold">
                {formatRupee(stat.investorsCount)}
              </h3>
            </div>
          ))}

          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow transition-colors">
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
                  strokeWidth="2"
                  d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>

            {/* Title */}
            <p className="text-slat text-sm mb-2 font-medium">
              This Month New Investors
            </p>

            {/* Value */}
            <h3 className="text-whie text-3xl font-bold">
              {formatRupee(adminDashboard?.overallStats?.thisMonthNewInvestors)}
            </h3>
          </div>
        </div>
      </div>

      <div className="w-full grid xl:flex grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
        <DonutChart overallStats={adminDashboard?.overallStats} planWiseData={adminDashboard?.planWiseData} />

        <div className=" bg-white flex flex-col rounded-lg p-6 border border-slate-200 shadow w-full max-w-[788px] h-[472.8px] max-h-[472.8px]">
          <h1 className="mb-6 font-bold leading-7 text-xl pb-4 border-b border-[#e5e7eb]">
            Top 10 Investores
          </h1>

          <div className="relative w-full h-full max-h-full max-w-full overflow-auto overflow-x-auto">
            <table className="w-full max-h-full  text-sm text-left rtl:text-right text-gray-500 text-nowrap">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 w-full">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Investor ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total Fund
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Investments
                  </th>
                </tr>
              </thead>
              <tbody>
                {adminDashboard?.topInvestors?.map((inv, index) => (
                  <tr
                    key={index}
                    onClick={() => navigate(`/admin/investors/${inv.investorId}`)}
                    className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium">{inv?.rank}</td>
                    <td className="px-6 py-4 font-medium">{inv?.investorId}</td>
                    <td className="px-6 py-4 font-medium">{inv?.name}</td>
                    <td className="px-6 py-4 font-medium">{formatRupee(inv?.totalCapital)}</td>
                    <td className="px-6 py-4 font-medium">
                      {inv?.totalInvestments}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow mt-3">
        <h1 className=" mb-6 font-bold leading-7 text-xl pb-4 border-b border-[#e5e7eb]">
          Next Replayment Investors
        </h1>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 bg-green-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 w-full">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Investor ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Join Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Fund
                </th>
                <th scope="col" className="px-6 py-3">
                  Investments
                </th>
                <th scope="col" className="px-6 py-3">
                  Next Repayment Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Repayment Plan
                </th>
              </tr>
            </thead>
            <tbody>
              {adminDashboard?.upcomingRepayments?.map((inv, index) => (
                <tr
                  key={index}
                  onClick={() => navigate(`/admin/investors/${inv.investorId}`)}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium">{inv?.investorId}</td>
                  <td className="px-6 py-4 font-medium">{inv?.name}</td>
                  <td className="px-6 py-4 font-medium">
                    {inv?.joinDate?.split("T")[0]}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatRupee(inv?.totalFund)}
                  </td>
                  <td className="px-6 py-4 font-medium">{inv?.totalInvestments}</td>
                  <td className="px-6 py-4 font-medium">
                    {inv?.nextRepaymentDate?.split("T")[0]}
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

export default AdminDashboard