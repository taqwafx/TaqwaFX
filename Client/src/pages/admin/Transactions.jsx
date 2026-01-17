import React, { useEffect, useRef, useState } from "react";
import { useGetTransactions } from "../../hooks/appHook";
import Loader from "../../components/Loader";
import { formatDateToIST, formatRupee } from "../../utils/helper";

const Transactions = () => {
  const loadMoreRef = useRef(null);
  const [filters, setFilters] = useState({});

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetTransactions(filters);

  const transactions =
    data?.pages.flatMap((page) => page.data.transactions) || [];
  const paidAMTSum = data?.pages?.[0]?.data?.paidAMTSum || 0;

  const onDateChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null, // 👈 body / window
        rootMargin: "100px",
        threshold: 0,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

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
                Transactions
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow mt-3">
        <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b border-[#e5e7eb] mb-6">
          <h1 className="font-bold leading-7 text-xl">Transactions</h1>

          <div className="relative max-w-min mt-2 md:mt-0 flex items-center gap-2">
            <input
              onChange={onDateChange}
              name="fromDate"
              type="date"
              className="block w-full ps-6 pe-2  bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-md focus:ring-brand focus:border-brand  py-2.5 shadow-xs placeholder:text-body"
              placeholder="Select date"
            />
            <span className=" whitespace-nowrap text-base">From - To</span>
            <input
              onChange={onDateChange}
              name="toDate"
              type="date"
              className="block w-full ps-6 pe-2  bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-md focus:ring-brand focus:border-brand  py-2.5 shadow-xs placeholder:text-body"
              placeholder="Select date"
            />
          </div>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 bg-green-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 w-full">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Investor
                </th>
                <th scope="col" className="px-6 py-3">
                  INV. ID
                </th>

                <th scope="col" className="px-6 py-3">
                  Plan
                </th>
                <th scope="col" className="px-6 py-3">
                  M.No
                </th>
                <th scope="col" className="px-6 py-3">
                  M.Date
                </th>
                <th scope="col" className="px-6 py-3 text-nowrap">
                  Profit
                </th>
                <th scope="col" className="px-6 py-3 text-nowrap">
                  Paid At
                </th>
                <th scope="col" className="px-6 py-3 text-nowrap">
                  Payment Type
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions?.map((tran, key) => (
                <tr
                  key={key}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium whitespace-nowrap">
                    {tran?.user?.name}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {tran?.investmentId}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {tran?.plan?.planName}
                  </td>
                  <td className="px-6 py-4 font-medium">{tran?.paidMonthNo}</td>
                  <td className="px-6 py-4 font-medium">
                    {formatDateToIST(tran?.returnDate) || "-"}
                  </td>
                  <td className="px-6 py-4 font-medium text-nowrap">
                    {formatRupee(tran?.paidAMT)}
                  </td>
                  <td className="px-6 py-4 font-medium text-nowrap">
                    {formatDateToIST(tran?.paidAt, true) || "-"}
                  </td>
                  <td className="px-6 py-4 font-medium text-nowrap">
                    {tran?.paymentType}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(isFetchingNextPage || isLoading) && (
          <div className="h-20 flex justify-center items-center relative">
            <Loader />
          </div>
        )}

        {transactions.length < 1 && !isFetchingNextPage && !isLoading &&  (
          <div className="flex justify-center items-center relative pt-5 font-medium">
            You Didn’t make Any Transaction Ye't
          </div>
        )}
      </div>

      <div className=" fixed bottom-10 right-10 bg-white rounded-lg shadow py-2 px-3 border">
        <span className=" font-medium m-1">
          Total Paid :-{" "}
          <span className=" text-blue-700">{formatRupee(paidAMTSum)}</span>
        </span>
      </div>

      <div ref={loadMoreRef} />
    </main>
  );
};

export default Transactions;
