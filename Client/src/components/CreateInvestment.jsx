import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import {
  useCreateInvestment,
  useGetInvestorInvBankDetails,
} from "../hooks/appHook.js";
import { calculateMonths, validateDateFormat } from "../utils/helper.js";
import toast from "react-hot-toast";

const CreateInvestment = ({ userId, refetch, setInvestor }) => {
  const [showModel, setShowModel] = useState(false);
  const [investorInvAcDetails, setInvestorInvDetails] = useState([]);
  const [AcSelectorValue, setAcSelectorValue] = useState("Select Ac. Details");
  const { plans } = useApp();
  const fileInputRef = useRef();

  const { data, isSuccess } = useGetInvestorInvBankDetails(userId);
  useEffect(() => {
    setInvestorInvDetails(data?.data);
  }, [data, isSuccess]);

  const [formData, setFormData] = useState({
    userId,
    planId: "",
    capital: null,
    returnROI: null,
    startDate: "",
    endDate: "",
    depositDate: "",
    depositType: "",
    totalMonths: null,
    bankName: "",
    bankHolderName: "",
    bankAcNumber: "",
    bankIFSCCode: "",
    agreementFile: null,
  });

  const createInvestment = useCreateInvestment();

  const handleChange = (e) => {
    if (
      e.target.name === "capital" ||
      e.target.name === "returnROI" ||
      e.target.name === "bankAcNumber"
    ) {
      if (/^\d*$/.test(e.target.value)) {
        return setFormData((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      }

      if (e.target.value === "-" && e.target.name === "returnROI")
        return setFormData((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (AcSelectorValue === "Select Ac. Details")
      return toast.error("Please Select Ac. Details");
    createInvestment.mutate(formData);
  };

  const refatchData = async () => {
    refetch().then((r) => setInvestor(r?.data.data));
  };

  const handleBlur = () => {
    if (formData.startDate !== "") {
      const endDate = calculateMonths(formData.startDate, formData.totalMonths);
      setFormData((prev) => ({ ...prev, endDate }));
    }
  };

  useEffect(() => {
    if (AcSelectorValue === "Menule Enter") {
      setFormData((prev) => ({
        ...prev,
        bankName: "",
        bankHolderName: "",
        bankAcNumber: "",
        bankIFSCCode: "",
      }));
    }

    if (AcSelectorValue.startsWith("INV")) {
      const bankDetails = investorInvAcDetails.find(
        (item) => item.investmentId === AcSelectorValue,
      );
      setFormData((prev) => ({
        ...prev,
        bankName: bankDetails.bankName,
        bankHolderName: bankDetails.bankHolderName,
        bankAcNumber: bankDetails.bankAcNumber,
        bankIFSCCode: bankDetails.bankIFSCCode,
      }));
    }
  }, [AcSelectorValue]);

  useEffect(() => {
    if (formData.planId === "") {
      return setFormData((prev) => ({
        ...prev,
        totalMonths: 0,
      }));
    }
    const selectedPlan =
      plans?.find((plan) => plan?._id === formData.planId) || 0;
    setFormData((prev) => ({
      ...prev,
      totalMonths: selectedPlan?.durationMonths,
    }));
  }, [formData.planId]);

  useEffect(() => {
    if (createInvestment.isSuccess) {
      setShowModel(false);
      setFormData({
        userId,
        planId: "",
        capital: null,
        returnROI: null,
        startDate: "",
        endDate: "",
        depositDate: "",
        depositType: "",
        totalMonths: null,
        bankName: "",
        bankHolderName: "",
        bankAcNumber: "",
        bankIFSCCode: "",
        agreementFile: null,
      });

      refatchData();
    }

    if (createInvestment?.data) {
      toast.success(createInvestment?.data?.message);
      refetch();
    }
  }, [createInvestment?.isSuccess, createInvestment?.data]);

  useEffect(() => {
    setFormData({
      userId,
      planId: "",
      capital: "",
      returnROI: "",
      startDate: "",
      endDate: "",
      depositDate: "",
      depositType: "",
      totalMonths: "",
      bankName: "",
      bankHolderName: "",
      bankAcNumber: "",
      bankIFSCCode: "",
      agreementFile: null,
    });
    setAcSelectorValue("Select Ac. Details");
  }, [showModel]);

  return (
    <>
      <div data-dial-init className="fixed end-6 bottom-6 group">
        <button
          onClick={() => {
            setShowModel((prev) => !prev);
          }}
          type="button"
          className="flex items-center justify-center text-white bg-blue-700 rounded-full w-14 h-14 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none cursor-pointer"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:rotate-45"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
          <span className="sr-only">Open actions menu</span>
        </button>
      </div>

      <div
        className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-[#eee5] ${
          showModel ? "flex" : " hidden"
        }`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow-sm ">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 ">
                Create New Investment
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                onClick={() => setShowModel((prev) => !prev)}
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
            </div>

            {/* <!-- Modal body --> */}
            <form onSubmit={handleSubmit} className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                  <label
                    for="planId"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Plan type
                  </label>
                  <select
                    required
                    id="planId"
                    name="planId"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
                    value={formData.planId}
                    onChange={handleChange}
                  >
                    <option selected value="">
                      Select Plan
                    </option>
                    {plans?.map((plan, index) => (
                      <option key={index} value={plan?._id}>
                        {plan.planName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    for="capital"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Capital
                  </label>
                  <input
                    type="text"
                    name="capital"
                    id="capital"
                    placeholder="1,00,000"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.capital}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    for="ROI"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Profit%
                  </label>
                  <input
                    type="text"
                    name="returnROI"
                    id="returnROI"
                    placeholder="5, 6, more..."
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.returnROI}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    for="totalMonths"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Total Months
                  </label>
                  <input
                    type="totalMonths"
                    name="price"
                    id="totalMonths"
                    placeholder="10, 20 more..."
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    readOnly
                    value={formData.totalMonths}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    for="startDate"
                    className="startDate mb-2 text-sm font-medium text-gray-900 "
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    onBlur={handleBlur}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    for="endDate"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    End Date
                  </label>
                  <input
                    type="text"
                    name="endDate"
                    id="endDate"
                    placeholder="MM/DD/YYYY"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.endDate}
                    readOnly
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    for="depositDate"
                    className="startDate mb-2 text-sm font-medium text-gray-900 "
                  >
                    Deposit On
                  </label>
                  <input
                    type="date"
                    name="depositDate"
                    id="depositDate"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.depositDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    for="depositType"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Deposit Type
                  </label>
                  <input
                    type="text"
                    name="depositType"
                    id="depositType"
                    placeholder="CASH, NEFT, UPI"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.depositType}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    for="depositType"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Upload Aggrement
                  </label>
                  <input
                    className="hidden"
                    id="file_input"
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFormData((prev) => ({
                        ...prev,
                        agreementFile: file,
                      }));
                    }}
                  />

                  <span
                    onClick={() => fileInputRef?.current?.click()}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-medium rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-2.5 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {formData.agreementFile ? (
                      <span className=" truncate w-full">
                        {formData.agreementFile?.name}
                      </span>
                    ) : (
                      <>
                        <svg
                          className="w-6 h-6 text-blue-800"
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
                            d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"
                          />
                        </svg>
                        Upload
                      </>
                    )}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    for="planId"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Ac. Details
                  </label>
                  <select
                    required
                    id="planId"
                    name="planId"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
                    value={AcSelectorValue}
                    onChange={(e) => setAcSelectorValue(e.target.value)}
                  >
                    <option selected value="Select Ac. Details">
                      Select Ac. Details
                    </option>
                    <option value="Menule Enter">Menule Enter</option>
                    {investorInvAcDetails?.map((invDetail, index) => (
                      <option key={index} value={invDetail?.investmentId}>
                        {invDetail.investmentId}
                      </option>
                    ))}
                  </select>
                </div>

                {AcSelectorValue !== "Select Ac. Details" && (
                  <>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        for="bankName"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Bank Name
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        id="bankName"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        value={formData.bankName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label
                        for="bankHolderName"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Bank Holder Name
                      </label>
                      <input
                        type="text"
                        name="bankHolderName"
                        id="bankHolderName"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        value={formData.bankHolderName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label
                        for="bankAcNumber"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Account Number
                      </label>
                      <input
                        type="text"
                        name="bankAcNumber"
                        id="bankAcNumber"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        value={formData.bankAcNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label
                        for="bankIFSCCode"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        name="bankIFSCCode"
                        id="bankIFSCCode"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        value={formData.bankIFSCCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                disabled={createInvestment.isPending}
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                <svg
                  className="me-1 -ms-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                {createInvestment.isPending
                  ? "Creating..."
                  : "Create Investment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateInvestment;
