import React, { useEffect } from "react";
import { useGetPlans } from "../../hooks/appHook.js";
import toast from "react-hot-toast";
import Loader from "../../components/Loader.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { formatRupee } from "../../utils/helper.js";

const UserPlans = () => {
  const { plans, setPlans } = useApp();

  const { data, isSuccess, isLoading, isError } = useGetPlans();

  useEffect(() => {
    setPlans(data?.data);
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
                Plans
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {plans?.map((plan, key) => (
          <div
            key={key}
            className="rounded-lg p-8 space-y-6 transition bg-white border border-gray-200 w-full max-w-[360px]"
          >
            <h3 className="text-2xl font-bold text-gray-900">
              {plan?.planName}
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-gray-600 flex flex-wrap">
                  <span className="text-3xl font-bold text-gray-900">
                    {plan?.returnROI + plan?.capitalROI}%
                  </span>
                  <span className="text-gray-600 ml-2">Monthly ROI</span>
                </p>
              </div>

              <div>
                <p className="text-gray-900 font-semibold">
                  {plan?.durationMonths} Months
                </p>
              </div>

              <div>
                <p className="text-gray-900 font-semibold">
                  Min. {formatRupee(plan?.minInvestment)}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                toast.success("Please Contact Admin to Invest.", "Info")
              }
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
            >
              get Started
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default UserPlans