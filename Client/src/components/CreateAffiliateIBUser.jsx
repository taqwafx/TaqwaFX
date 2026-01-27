import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import {
  useCreateAffiliateIB,
  useVerifyAffiliateIB,
  useVerifyInvestorForAffiliateIB,
} from "../hooks/appHook";
import toast from "react-hot-toast";

const CreateAffiliateIBUser = () => {
  const [showCreatAffiliateIBUserModel, setshowAffiliateIBUserModel] =
    useState(false);
  const [showAlertModel, setAlertShowModel] = useState(false);

  const verifyInvestor = useVerifyInvestorForAffiliateIB();
  const createAffiliateIBUser = useCreateAffiliateIB();

  const [formData, setFormData] = useState({
    investorId: "",
    bankName: "",
    bankHolderName: "",
    bankAcNumber: "",
    bankIFSCCode: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVerifyInvestor = () => {
    if (verifyInvestor.isSuccess && formData.investorId?.length > 1) {
      if (!verifyInvestor?.data?.data?.isValid)
        toast.error(verifyInvestor?.data?.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createAffiliateIBUser.mutate(formData);
  };

  useEffect(() => {
    if (verifyInvestor.isSuccess && formData.investorId?.length > 1) {
      if (verifyInvestor?.data?.data?.isValid)
        toast.success(verifyInvestor?.data?.message);
    }
  }, [verifyInvestor.data]);

  useEffect(() => {
    if (formData.investorId?.length > 1)
      verifyInvestor?.mutate({ investorId: formData.investorId });
  }, [formData.investorId]);

  useEffect(() => {
    if (createAffiliateIBUser.isSuccess) {
      setshowAffiliateIBUserModel(false);
    }

    if (createAffiliateIBUser?.data) {
      toast.success(createAffiliateIBUser?.data?.message);
      // refetch();
      setAlertShowModel(true);
    }
  }, [createAffiliateIBUser.isSuccess, createAffiliateIBUser?.data]);

  useEffect(() => {
    setFormData({
      investorId: "",
      bankName: "",
      bankHolderName: "",
      bankAcNumber: "",
      bankIFSCCode: "",
    });
  }, [showCreatAffiliateIBUserModel]);
  return (
    <>
      {/* <!-- Modal toggle --> */}
      <div className="fixed end-6 bottom-6 group">
        <button
          onClick={() => setshowAffiliateIBUserModel((prev) => !prev)}
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

      {/* <!-- Main modal --> */}
      <div
        className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-[#eee5] ${
          showCreatAffiliateIBUserModel ? "flex" : " hidden"
        }`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow-sm ">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 ">
                Create Affiliate/IB ID
              </h3>
              <button
                onClick={() => setshowAffiliateIBUserModel((prev) => !prev)}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                data-modal-toggle="crud-modal"
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
                <div className="col-span-2 relative">
                  <label
                    for="investorId"
                    className="block mb-2 text-sm font-medium text-gray-900 relative"
                  >
                    Investor ID
                    {verifyInvestor.isSuccess &&
                      verifyInvestor.data &&
                      verifyInvestor?.data?.data?.isValid &&
                      formData.investorId?.length > 1 && (
                        <span className="w-full absolute right-1 text-right text-sm font-medium">
                          Investor
                          <span className="ms-1 text-green-500">
                            {verifyInvestor?.data?.data?.investorName}
                          </span>
                        </span>
                      )}
                  </label>
                  <input
                    type="text"
                    name="investorId"
                    id="investorId"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.investorId}
                    onChange={handleChange}
                    onBlur={handleVerifyInvestor}
                    required
                  />

                  <div className="absolute right-2 top-9">
                    {(verifyInvestor.isLoading || verifyInvestor.isPending) && (
                      <Loader w={6} h={6} />
                    )}

                    {verifyInvestor.isSuccess &&
                      verifyInvestor?.data?.data?.isValid &&
                      formData.investorId?.length > 1 && (
                        <svg
                          class="w-6 h-6 text-gray-600"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      )}

                    {verifyInvestor.isSuccess &&
                      !verifyInvestor?.data?.data?.isValid &&
                      formData.investorId?.length > 1 && (
                        <span className=" font-medium text-base text-red-800">
                          ❗
                        </span>
                      )}
                  </div>
                </div>

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
              </div>

              <button
                type="submit"
                disabled={createAffiliateIBUser.isPending}
                className="text-white inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-800 w-full"
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
                {createAffiliateIBUser.isPending
                  ? "Creating..."
                  : "Create AffiliateIB ID"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* aleart Model  */}
      <div
        className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-[#eee5] ${
          showAlertModel ? "flex" : " hidden"
        }`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow-sm">
            <button
              onClick={() => setAlertShowModel((prev) => !prev)}
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              data-modal-hide="popup-modal"
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
            <div className="p-4 md:p-5 text-center">
              <h3 className=" text-2xl font-bold">AffiliateIB ID Created!</h3>
              <h3 className="my-5 text-lg font-normal text-gray-800">
                You Have Successfully Created New AffiliateIB ID. For{" "}
                <span className=" font-medium">
                  {createAffiliateIBUser?.data?.data?.investorName}
                </span>{" "}
                & there Investor ID is{" "}
                <span className=" font-medium">
                  {createAffiliateIBUser?.data?.data?.investorId}
                </span>
                , and there AffiliateIB ID is{" "}
                <span className=" font-medium">
                  {createAffiliateIBUser?.data?.data?.affiliateIBId}
                </span>
                , Please use this Id to referre new Users
              </h3>
              <button
                onClick={() => setAlertShowModel((prev) => !prev)}
                type="button"
                className=" w-full py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAffiliateIBUser;
