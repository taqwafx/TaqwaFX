import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetAffiliateUserDetails } from "../../hooks/appHook";
import Loader from "../../components/Loader";
import { formatDateToIST, formatRupee } from "../../utils/helper";
import { useApp } from "../../context/AppContext.jsx";
import toast from "react-hot-toast";

const UserAffiliateIB = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const affiliateIBId = user?.affiliateIB?.affiliateIBId;

  const { data, isLoading, isSuccess, isError } =
    useGetAffiliateUserDetails(affiliateIBId);

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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <Link
                to={-1}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                AffiliateIB
              </Link>
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
                  stroke-width="2"
                  d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>

            {/* Title */}
            <p className="text-slat text-sm mb-2  font-medium">Referrals</p>

            {/* Value */}
            <h3 className="text-whie text-3xl font-bold">
              {formatRupee(data?.data?.referralCount)}
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
              Overall Referrals Fund
            </p>

            {/* Value */}
            <h3 className="text-whie text-3xl font-bold">
              {formatRupee(data?.data?.overallReferralFund)}
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
                  d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"
                />
              </svg>
            </div>

            {/* Title */}
            <p className="text-slat text-sm mb-2  font-medium">IB Income</p>

            {/* Value */}
            <h3 className="text-whie text-3xl font-bold">
              {formatRupee(data?.data?.ibIncome)}
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
                  d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Title */}
            <p className="text-slat text-sm mb-2  font-medium">Total Earnd</p>

            {/* Value */}
            <h3 className="text-whie text-3xl font-bold">
              {formatRupee(data?.data?.totalEarned)}
            </h3>
          </div>
        </div>
      </div>

      <div className="w-full lg:h-[430px] grid xl:flex grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
        <div className="lg:max-w-sm w-full bg-white rounded-lg p-6 border border-slate-200 shadow">
          <h1 className=" mb-6 font-bold leading-7 text-xl pb-4 border-b border-[#e5e7eb]">
            Affiliate/IB Details
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Full Name */}
              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Full name:
                </h3>
                <p className="text-slate-600">{data?.data?.affiliate?.name}</p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Affiliate/IB ID
                </h3>
                <p className="text-slate-600">
                  {data?.data?.affiliate?.affiliateIBId}
                </p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Bank Name
                </h3>
                <p className="text-slate-600">
                  {data?.data?.affiliate?.bankDetails?.bankName}
                </p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Account Number
                </h3>
                <p className="text-slate-600">
                  {data?.data?.affiliate?.bankDetails?.bankAcNumber}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Status:
                </h3>
                <span
                  className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm ${
                    data?.data?.affiliate?.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {data?.data?.affiliate?.status}
                </span>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Join Date:
                </h3>
                <p className="text-slate-600">
                  {formatDateToIST(data?.data?.affiliate?.joinedAsAffiliateAt)}
                </p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Holder Name
                </h3>
                <p className="text-slate-600">
                  {data?.data?.affiliate?.bankDetails?.bankHolderName}
                </p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  IFSC Number
                </h3>
                <p className="text-slate-600">
                  {data?.data?.affiliate?.bankDetails?.bankIFSCCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className=" bg-white flex flex-col rounded-lg p-6 border border-slate-200 shadow w-full max-w-[788px] h-full">
          <h1 className="mb-6 font-bold leading-7 text-xl pb-4 border-b border-[#e5e7eb]">
            Paid Commission Months
          </h1>

          <div className="relative w-full h-full overflow-auto">
            <table className="w-full max-h-full  text-sm text-left rtl:text-right text-gray-500 text-nowrap">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 w-full text-nowrap whitespace-nowrap">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Investor ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Investor Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Inv ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Month No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Return Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Commision Profit
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
                {data?.data?.paidCommissionHistory?.map((paidMonth, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer text-nowrap whitespace-nowrap"
                  >
                    <td className="px-6 py-4 font-medium">
                      {paidMonth?.investorId}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {paidMonth?.investorName}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {paidMonth?.investmentId}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {paidMonth?.monthNo}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatDateToIST(paidMonth?.returnDate)}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatRupee(paidMonth?.commissionAmount)}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {paidMonth?.planType}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {paidMonth?.commissionPaymentType}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {paidMonth?.commissionPaymentProof}
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
          Comming Soon Commission
        </h1>

        <div className="relative overflow-x-auto">
          <table className="w-full max-h-full  text-sm text-left rtl:text-right text-gray-500 text-nowrap">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 w-full text-nowrap whitespace-nowrap">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Investor ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Investor Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Inv ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Month No
                </th>
                <th scope="col" className="px-6 py-3">
                  Return Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Commision Profit
                </th>
                <th scope="col" className="px-6 py-3">
                  Plan Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Capital
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.upcommingCommisions?.map((repayment, index) => (
                <tr
                  key={index}
                  onClick={() =>
                    navigate(
                      `/user/affiliateIB/referral/${repayment?.investorId}`,
                    )
                  }
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer text-nowrap whitespace-nowrap"
                >
                  <td className="px-6 py-4 font-medium">
                    {repayment?.investorId}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {repayment?.investorName}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {repayment?.investmentId}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {repayment?.repaymentMonthNumber}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatDateToIST(repayment?.repaymentDate)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatRupee(repayment?.affiliateCommission)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {repayment?.planType}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatRupee(repayment?.capital)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow mt-3">
        <h1 className=" mb-6 font-bold leading-7 text-xl pb-4 border-b border-[#e5e7eb]">
          Referrals
        </h1>

        <div className="relative overflow-x-auto">
          <table className="w-full max-h-full  text-sm text-left rtl:text-right text-gray-500 text-nowrap">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 w-full text-nowrap whitespace-nowrap">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Investor ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Investor Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Fund
                </th>
                <th scope="col" className="px-6 py-3">
                  Investments
                </th>
                <th scope="col" className="px-6 py-3">
                  Next Commision Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Commision %
                </th>
                <th scope="col" className="px-6 py-3">
                  Commision Profit
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.referralUsers.map((referral, key) => (
                <tr
                  key={referral?.investorId}
                  onClick={() =>
                    navigate(
                      `/user/affiliateIB/referral/${referral?.investorId}`,
                    )
                  }
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer text-nowrap whitespace-nowrap"
                >
                  <td className="px-6 py-4 font-medium">
                    {referral?.investorId}
                  </td>
                  <td className="px-6 py-4 font-medium">{referral?.name}</td>

                  <td className="px-6 py-4 font-medium">
                    {formatRupee(referral?.totalFund)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {referral?.totalInvestments}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {referral?.nextCommissionDate
                      ? formatDateToIST(referral?.nextCommissionDate)
                      : "-"}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {referral?.referralCommission}%
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatRupee(referral?.runningEarning)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    <span
                      className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm ${
                        referral.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {referral?.status}
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

export default UserAffiliateIB;
