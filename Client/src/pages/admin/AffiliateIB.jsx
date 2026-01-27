import React from "react";
import CreateAffiliateIBUser from "../../components/CreateAffiliateIBUser";
import { useGetAffiliateAdminDashboard } from "../../hooks/appHook";
import { formatDateToIST, formatRupee } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const AffiliateIB = () => {
  const navigate = useNavigate();

  const { data, isSuccess, isLoading, isError, refetch } =
    useGetAffiliateAdminDashboard();
  console.log(data);

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
                Affiliate/IB
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
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>

            {/* Title */}
            <p className="text-slat text-sm mb-2  font-medium">
              Total IB Accounts
            </p>

            {/* Value */}
            <h3 className="text-whie text-3xl font-bold">
              {data?.data?.totalAffiliateCount}
            </h3>
          </div>

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
              Total Referrals Fund
            </p>

            {/* Value */}
            <h3 className="text-whie text-3xl font-bold">
              {formatRupee(data?.data?.totalReferralFund)}
            </h3>
          </div>

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
                  stroke-linecap="round"
                  stroke-width="2"
                  d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>

            {/* Title */}
            <p className="text-slat text-sm mb-2  font-medium">
              Total Referrals
            </p>

            {/* Value */}
            <h3 className="text-whie text-3xl font-bold">
              {data?.data?.totalReferralUsers}
            </h3>
          </div>

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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 15v4m6-6v6m6-4v4m6-6v6M3 11l6-5 6 5 5.5-5.5"
                />
              </svg>
            </div>

            {/* Title */}
            <p className="text-slat text-sm mb-2  font-medium">
              Total Referrals Investments
            </p>

            {/* Value */}
            <h3 className="text-whie text-3xl font-bold">
              {data?.data?.totalReferralInvestments}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow mt-3">
        <h1 className=" mb-6 font-bold leading-7 text-xl pb-4 border-b border-[#e5e7eb]">
          Total Affiliates
        </h1>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 text-nowrap">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 w-full whitespace-nowrap text-nowrap">
              <tr>
                <th scope="col" className="px-6 py-3">
                  IB ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Investor ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Investor Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Referrals Fund
                </th>
                <th scope="col" className="px-6 py-3">
                  Referrals Count
                </th>
                <th scope="col" className="px-6 py-3">
                  Next Commision Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.affiliates.map((AIBUser, key) => (
                <tr
                  key={key}
                  onClick={() =>
                    navigate(`/admin/affiliateIB/${AIBUser?.affiliateIBId}`)
                  }
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer text-nowrap"
                >
                  <td className="px-6 py-4 font-medium">
                    {AIBUser?.affiliateIBId}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {AIBUser?.investorId}
                  </td>
                  <td className="px-6 py-4 font-medium">{AIBUser?.name}</td>
                  <td className="px-6 py-4 font-medium">
                    {formatRupee(AIBUser?.referralFund)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {AIBUser?.referralCount}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatDateToIST(AIBUser?.nextCommissionDate)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    <span
                      className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm ${AIBUser?.nextCommissionDate ? "text-green-800 bg-green-100" : "text-yellow-800 bg-yellow-100"}`}
                    >
                      {AIBUser?.nextCommissionDate ? "Active" : "InActive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateAffiliateIBUser />
    </main>
  );
};

export default AffiliateIB;
