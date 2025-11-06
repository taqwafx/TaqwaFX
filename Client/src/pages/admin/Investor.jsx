import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetInvestorDetails, useUpdatePassword } from "../../hooks/appHook.js";
import toast from "react-hot-toast";
import Loader from "../../components/Loader.jsx";
import { formatRupee } from "../../utils/helper.js";
import CreateInvestment from "../../components/CreateInvestment.jsx";
import { strongPasswordRegex } from "../../utils/validations.js";

const Investor = () => {
  const [investor, setInvestor] = useState({});
  const [changePassword, setChangePassword] = useState(false);

  const [formData, setFormData] = useState({
    investorId: "",
    newPassword: "",
  });

  const navigate = useNavigate();
  const { investorId } = useParams();
  const updatePassword = useUpdatePassword();
  const passwordRef = useRef();
  const updatePassBtnRef = useRef();

  const { data, isLoading, isSuccess, refetch, isError } =
    useGetInvestorDetails(investorId);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const title = updatePassBtnRef?.current?.innerText;
    if(title === "Cancle") return setChangePassword(false);
    

    if (formData.newPassword !== investor?.loginDetails?.password) {
      if (strongPasswordRegex.test(formData.password)) {
        toast.error(
          "Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number & 1 special symbol."
        );
      } else {
        updatePassword.mutate(formData);
        setChangePassword(false);
      }
    } else {
      setChangePassword(true);
      if (changePassword) {
        passwordRef?.current?.focus();
      }
    }
  };

  useEffect(() => {
    setFormData({
      investorId: investor?.investorId,
      newPassword: investor?.loginDetails?.password,
    });
  }, [investor]);

  useEffect(() => {
    setInvestor(data?.data);
  }, [isSuccess]);

  useEffect(() => {
    if (updatePassword?.isSuccess) {
      refetch().then((r) => setInvestor(r?.data.data));
    }
    if (updatePassword?.data) {
      toast.success(updatePassword?.data?.message);
    }
  }, [updatePassword?.isSuccess, updatePassword?.data]);

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
                Investors
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
                Investor
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow">
          <h1 className=" mb-6 font-bold leading-7 text-xl pb-4 border-b border-[#e5e7eb]">
            Investor Details
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Full Name */}
              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Full name:
                </h3>
                <p className="text-slate-600">{investor?.name}</p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Investor ID:
                </h3>
                <p className="text-slate-600">{investor?.investorId}</p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Contact Details:
                </h3>
                <p className="text-slate-600">
                  {investor?.contactDetails?.phone}
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
                  {investor?.joinDate?.split("T")[0]}
                </p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Runing Investmetns:
                </h3>
                <p className="text-slate-600">{investor?.runningInvestments}</p>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-900 mb-1">
                  Investment Status:
                </h3>
                <span
                  className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm ${
                    investor?.hasActiveInvestment
                      ? "bg-green-100 text-green-800 "
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {investor?.overallStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow">
          <h1 className="mb-6 font-bold leading-7 text-xl pb-4 border-b border-[#e5e7eb]">
            Login Details
          </h1>

          <div className=" space-y-6">
            <form className=" space-y-6">
              <div>
                <label
                  for="investorId"
                  className="block mb-2 text-sm font-medium text-slate-900"
                >
                  Login ID
                </label>
                <input
                  type="investorId"
                  name="investorId"
                  id="text"
                  value={formData.investorId}
                  readOnly
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  required
                />
              </div>
              <div>
                <label
                  for="newPassword"
                  className="block mb-2 text-sm font-medium text-slate-900"
                >
                  Investor password
                </label>
                <input
                  ref={passwordRef}
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                  readOnly={!changePassword}
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>
            </form>

            <button
              ref={updatePassBtnRef}
              onClick={handleSubmit}
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
            >
              {updatePassword?.isPending
                ? "Updating..."
                : formData.newPassword !== investor?.loginDetails?.password
                ? "Update Password"
                : changePassword
                ? "Cancle"
                : "Change Password"}
            </button>
          </div>
        </div>
      </div>

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
            <p className="text-slat text-sm mb-2">Total Investment</p>

            {/* Value */}
            <h3 className="text-whie text-3xl font-bold">
              {formatRupee(investor?.totalCapitalInvested)}
            </h3>
          </div>

          {investor?.investedByPlan?.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 border border-slate-200 shadow transition-colors"
            >
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
              <p className="text-slat text-sm mb-2">{card?.planName}</p>

              {/* Value */}
              <h3 className="text-whie text-3xl font-bold">
                {formatRupee(card?.totalFund)}
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
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M9 15a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm3.845-1.855a2.4 2.4 0 0 1 1.2-1.226 1 1 0 0 1 1.992-.026c.426.15.809.408 1.111.749a1 1 0 1 1-1.496 1.327.682.682 0 0 0-.36-.213.997.997 0 0 1-.113-.032.4.4 0 0 0-.394.074.93.93 0 0 0 .455.254 2.914 2.914 0 0 1 1.504.9c.373.433.669 1.092.464 1.823a.996.996 0 0 1-.046.129c-.226.519-.627.94-1.132 1.192a1 1 0 0 1-1.956.093 2.68 2.68 0 0 1-1.227-.798 1 1 0 1 1 1.506-1.315.682.682 0 0 0 .363.216c.038.009.075.02.111.032a.4.4 0 0 0 .395-.074.93.93 0 0 0-.455-.254 2.91 2.91 0 0 1-1.503-.9c-.375-.433-.666-1.089-.466-1.817a.994.994 0 0 1 .047-.134Zm1.884.573.003.008c-.003-.005-.003-.008-.003-.008Zm.55 2.613s-.002-.002-.003-.007a.032.032 0 0 1 .003.007ZM4 14a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1Zm3-2a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Zm6.5-8a1 1 0 0 1 1-1H18a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-.796l-2.341 2.049a1 1 0 0 1-1.24.06l-2.894-2.066L6.614 9.29a1 1 0 1 1-1.228-1.578l4.5-3.5a1 1 0 0 1 1.195-.025l2.856 2.04L15.34 5h-.84a1 1 0 0 1-1-1Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Title */}
            <p className="text-slat text-sm mb-2">Total Paid till date</p>

            {/* Value */}
            <h3 className="text-whie text-3xl font-bold">
              {formatRupee(investor?.totalPaidTillDate)}
            </h3>
          </div>
        </div>
      </div>

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
                <th scope="col" className="px-6 py-3">
                  Start From
                </th>
                <th scope="col" className="px-6 py-3">
                  End On
                </th>
                <th scope="col" className="px-6 py-3">
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
              {investor?.investments?.map((inv, index) => (
                <tr
                  key={index}
                  onClick={() =>
                    navigate(
                      `/admin/investors/${investor?.investorId}/investment/${inv?.investmentId}`
                    )
                  }
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium">{inv?.investmentId}</td>
                  <td className="px-6 py-4 font-medium">
                    {formatRupee(inv?.capital)}
                  </td>
                  <td className="px-6 py-4 font-medium">{inv?.planType}</td>
                  <td className="px-6 py-4 font-medium">{inv?.roi}%</td>
                  <td className="px-6 py-4 font-medium">
                    {inv?.startDate?.split("T")[0]}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {inv?.endDate?.split("T")[0]}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {inv?.repaymentDate?.split("T")[0]}
                  </td>
                  <td className="px-6 py-4 font-medium">{inv?.completedMonths}</td>
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
      </div>

      <CreateInvestment
        userId={investorId}
        refetch={refetch}
        setInvestor={setInvestor}
      />
    </main>
  );
};


export default Investor