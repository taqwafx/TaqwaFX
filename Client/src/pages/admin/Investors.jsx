import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetInvestors } from "../../hooks/appHook.js";
import { useApp } from "../../context/AppContext";
import CreateInvestor from "../../components/CreateInvestor.jsx";
import Loader from "../../components/Loader.jsx";
import { formatRupee } from "../../utils/helper.js";

const Investors = () => {
  const navigate = useNavigate();
  const { investors, setInvestors, plans } = useApp();

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    planType: "",
    repaymentDate: "",
    roi: "",
    capitalMin: "",
    capitalMax: "",
    page: 1,
    limit: 10,
    sort: "createdAt:desc",
  });

  const { data, isLoading, isFetching, refetch } = useGetInvestors(filters);
  console.log(plans);

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (data?.data?.investors) {
      setInvestors(
        (prev) =>
          filters.page === 1
            ? data.data.investors // fresh list
            : [...prev, ...data.data.investors] // append next page
      );
    }
  }, [data]);

  // ✅ Infinite scroll
  const loaderRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          const total = data?.data?.pagination?.total || 0;
          const totalPages = Math.ceil(total / filters.limit);
          if (filters.page < totalPages) {
            setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
          }
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [data, isFetching, filters]);

  useEffect(()=>{
    console.log(filters);
    
  }, [filters])

  // if (isLoading && filters.page === 1) return <p>Loading...</p>;

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
              <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">
                Investors
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-wrap gap-3 bg-white p-3 rounded-lg border border-gray-200">
        <form className="flex items-center w-full">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 "
              placeholder="Search Investor name or ID"
              required
              value={filters.search}
              onChange={handleChange}
              onBlur={()=>setFilters((prev) => ({...prev, search: ""}))}
            />
          </div>
        </form>

        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          <select
            value={filters.status}
            onChange={handleChange}
            id="status"
            name="status"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5  w-full"
          >
            <option selected value="">INV Status</option>
            <option value="Active">Active</option>
            <option value="Complete">Complete</option>
          </select>
          <select
            value={filters.planType}
            onChange={handleChange}
            id="planType"
            name="planType"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5  w-full"
          >
            <option selected value="">
              Select Plan
            </option>
            {plans?.map((plan, index) => (
              <option key={index} value={plan?.planName}>
                {plan.planName}
              </option>
            ))}
          </select>
          <select
            value={filters.repaymentDate}
            onChange={handleChange}
            id="repaymentDate"
            name="repaymentDate"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 w-full"
          >
            <option selected value="">Reapayment Date</option>
            <option value="5">5th</option>
            <option value="10">10th</option>
            <option value="15">15th</option>
            <option value="20">20th</option>
            <option value="25">25th</option>
            <option value="30">30th</option>
          </select>

          <input
            type="text"
            name="roi"
            id="roi"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder="ROI%"
            value={filters.roi}
            onChange={handleChange}
          />
          <input
            type="text"
            name="capitalMin"
            id="capitalMin"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder="Capital Min"
            value={filters.capitalMin}
            onChange={handleChange}
          />
          <input
            type="text"
            name="capitalMax"
            id="capitalMax"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder="Capital Max"
            value={filters.capitalMax}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow mt-3">
        <h1 className=" mb-6 font-bold leading-7 text-xl pb-4 border-b border-[#e5e7eb]">
          Investors
        </h1>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 text-nowrap">
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {investors?.map((investor, index) => {
                return (
                  <tr
                    key={index}
                    onClick={() =>
                      navigate(`/admin/investors/${investor?.investorId}`)
                    }
                    className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium">
                      {investor?.investorId}
                    </td>
                    <td className="px-6 py-4 font-medium">{investor?.name}</td>
                    <td className="px-6 py-4 font-medium">
                      {investor?.joinDate?.split("T")[0]}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatRupee(investor?.totalCapital)}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {investor?.runningInvestments}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {investor?.nextRepaymentDate
                        ? investor?.nextRepaymentDate?.split("T")[0]
                        : "-"}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      <span
                        class={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm ${
                          investor?.hasActiveInvestment
                            ? "bg-green-100 text-green-800 "
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {investor?.hasActiveInvestment ? "Active" : "InActive"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* 🔹 Loader for scroll */}
          <div ref={loaderRef}>
            {isFetching || isLoading && (
              <div className="h-20 flex justify-center items-center relative">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateInvestor refetch={refetch} />
    </main>
  );
};


export default Investors