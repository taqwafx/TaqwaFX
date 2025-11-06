import React, { useEffect, useState } from "react";
import { useCreatePlan } from "../hooks/appHook.js";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext.jsx";

const CreatePlan = () => {
  const [showModel, setShowModel] = useState(false);
  const { setPlans } = useApp();
  const createPlan = useCreatePlan();

  const [formData, setFormData] = useState({
    planName: "",
    capitalROI: "",
    returnROI: "",
    durationMonths: "",
    minInvestment: "",
    description: "",
  });

  const handleChange = (e) => {
    if (e.target.name === "planName")
      return setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));

    if (/^\d*$/.test(e.target.value)) {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.capitalROI >= 10 || formData.returnROI >= 10) {
      if (confirm("Are You Sure this ROI's correct ??")) {
        createPlan.mutate(formData);
      }
    } else createPlan.mutate(formData);
  };

  useEffect(() => {
    if (createPlan.isSuccess) {
      setShowModel(false);
      setFormData({
        planName: "",
        capitalROI: "",
        returnROI: "",
        durationMonths: "",
        minInvestment: "",
        description: "",
      });
    }

    if (createPlan?.data) {
      toast.success(createPlan?.data?.message);
      setPlans((prev) => [...prev, createPlan?.data?.data]);
    }
  }, [createPlan?.isSuccess, createPlan?.data]);

  return (
    <>
      {/* <!-- Modal toggle --> */}
      <div data-dial-init className="fixed end-6 bottom-6 group">
        <button
          onClick={() => setShowModel((prev) => !prev)}
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
                Create New Plan
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
              <div className="mb-4">
                <div className="col-span-2 sm:col-span-1 mb-4">
                  <label
                    htmlFor="planName"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Plan Name
                  </label>
                  <input
                    type="text"
                    name="planName"
                    id="planName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.planName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="capitalROI"
                      className="startDate mb-2 text-sm font-medium text-gray-900 "
                    >
                      Capital ROI%
                    </label>
                    <input
                      type="text"
                      name="capitalROI"
                      id="capitalROI"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      value={formData.capitalROI}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="returnROI"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Return ROI%
                    </label>
                    <input
                      type="text"
                      name="returnROI"
                      id="returnROI"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      value={formData.returnROI}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="durationMonths"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Duration In Month
                    </label>
                    <input
                      type="text"
                      name="durationMonths"
                      id="durationMonths"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      value={formData.durationMonths}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="minInvestment"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Min Investment
                    </label>
                    <input
                      type="text"
                      name="minInvestment"
                      id="minInvestment"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      value={formData.minInvestment}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={createPlan.isPending}
                className="text-white flex items-center justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full cursor-pointer disabled:bg-blue-800"
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
                {createPlan.isPending ? "Creating..." : "Create Plan"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePlan;
