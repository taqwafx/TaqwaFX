import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetReferralUserInvestments } from "../../hooks/appHook";
import Loader from "../../components/Loader";
import { formatDateToIST, formatRupee } from "../../utils/helper";

const UserAffiliateIBInvestments = () => {
  const { investorId } = useParams();

  const { data, isLoading, isSuccess, isError } =
    useGetReferralUserInvestments(investorId);

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
                Affiliate/IB
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
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">
                TFX5011
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow mt-3">
        <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b border-[#e5e7eb] mb-6">
          <h1 className="font-bold leading-7 text-xl">Investments</h1>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 w-full text-nowrap whitespace-nowrap">
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
                  Start From
                </th>
                <th scope="col" className="px-6 py-3">
                  End ON
                </th>
                <th scope="col" className="px-6 py-3">
                  Comming Payment
                </th>
                <th scope="col" className="px-6 py-3">
                  Completed Month
                </th>
                <th scope="col" className="px-6 py-3">
                  Profit Commision
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.investments?.map((inv, key) => (
                <tr
                  key={key}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer text-nowrap whitespace-nowrap"
                >
                  <td className="px-6 py-4 font-medium">{inv?.investmentId}</td>
                  <td className="px-6 py-4 font-medium">
                    {formatRupee(inv?.capital)}
                  </td>
                  <td className="px-6 py-4 font-medium">{inv?.planType}</td>
                  <td className="px-6 py-4 font-medium">
                    {formatDateToIST(inv?.startFrom)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatDateToIST(inv?.endOn)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatDateToIST(inv?.upcomingRepaymentDate)}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {inv?.completedMonths}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {inv?.commissionProfit == 0
                      ? "-"
                      : formatRupee(inv?.commissionProfit)}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
                      {inv?.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isLoading && (
          <div className="h-20 w-full flex justify-center items-center relative mx-auto">
            <Loader />
          </div>
        )}
      </div>
    </main>
  );
};

export default UserAffiliateIBInvestments;
