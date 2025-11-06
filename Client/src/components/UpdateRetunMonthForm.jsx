import React, { useEffect, useState } from "react";
import { useMarkMonthAsPaid } from "../hooks/appHook.js";
import toast from "react-hot-toast";
import { formatRupee } from "../utils/helper.js";


const UpdateRetunMonthForm = ({
  showModel,
  setShowModel,
  repaymentData,
  setInvestment,
  refetch,
}) => {
  const markMonth = useMarkMonthAsPaid();

  const [formData, setFormData] = useState({
    monthNo: 0,
    paymentType: "",
    paymentProof: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      confirm(
        "Are You Sure You Want to Mark this Month as Paid after this you can't change it"
      )
    ) {
      markMonth.mutate(formData);
    }
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      monthNo: repaymentData.monthNo,
      id: repaymentData.id,
    }));
  }, [repaymentData]);

  const refatchData = async () => {
    refetch().then((r) => setInvestment(r?.data.data));
  };

  useEffect(() => {
    if (markMonth.isSuccess) {
      setShowModel(false);
      setFormData({
        paymentType: "",
        paymentProof: "",
      });
      refatchData();
    }

    if (markMonth?.data) {
      toast.success(markMonth?.data?.message);
    }
  }, [markMonth?.isSuccess, markMonth?.data]);

  useEffect(() => {
    if (markMonth?.isError) {
      setShowModel(false);
      setFormData({
        monthNo: 0,
        paymentType: "",
        paymentProof: "",
      });
    }
  }, [markMonth?.isError]);
  return (
    <>
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
                Update Investment Month
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
              <div className="flex flex-col mb-3">
                <span>
                  Month No:{" "}
                  <span className=" font-medium">{repaymentData?.monthNo}</span>
                </span>
                <span>
                  Total Return:{" "}
                  <span className=" font-medium">
                    {formatRupee(repaymentData?.totalReturn)}
                  </span>
                </span>
                <span>
                  Repayment Date:{" "}
                  <span className=" font-medium">
                    {repaymentData.returnDate}
                  </span>
                </span>
              </div>
              <div className="mb-4">
                <div className="col-span-2 sm:col-span-1 mb-4">
                  <label
                    for="paymentType"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Payment Type
                  </label>
                  <input
                    type="text"
                    name="paymentType"
                    id="paymentType"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.paymentType}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 mb-4">
                  <label
                    for="paymentProof"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Payment Proof
                  </label>
                  <input
                    type="text"
                    name="paymentProof"
                    id="paymentProof"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.paymentProof}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={markMonth.isPending}
                className="text-white flex items-center justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full cursor-pointer disabled:bg-blue-800"
              >
                {markMonth.isPending ? "Updating..." : "Update Month As Paid"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateRetunMonthForm