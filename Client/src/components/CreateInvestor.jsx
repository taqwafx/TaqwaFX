import React from "react";
import {
  emailRegex,
  phoneRegex,
  strongPasswordRegex,
} from "../utils/validations.js";
import { useCreateInvestor } from "../hooks/appHook.js";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const CreateInvestor = ({ refetch }) => {
  const [showCreatInvestorModel, setShowCreatInvestorModel] = useState(false);
  const [showAlertModel, setAlertShowModel] = useState(false);
  const createInvestor = useCreateInvestor();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailRegex.test(formData.email))
      return toast.error("Please enter a valid email address.");
    if (!phoneRegex.test(formData.phone))
      return toast.error("Please enter a valid Indian phone number.");
    if (!strongPasswordRegex.test(formData.password))
      return toast.error(
        "Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number & 1 special symbol."
      );
    if (formData.password !== formData.confirmPassword)
      return toast.error("Please Enter Correct Password!");
    createInvestor.mutate(formData);
  };

  useEffect(() => {
    if (createInvestor.isSuccess) {
      setShowCreatInvestorModel(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    }

    if (createInvestor?.data) {
      toast.success(createInvestor?.data?.message);
      refetch();
      setAlertShowModel(true);
    }
  }, [createInvestor?.isSuccess, createInvestor?.data]);
  return (
    <>
      {/* <!-- Modal toggle --> */}
      <div className="fixed end-6 bottom-6 group">
        <button
          onClick={() => setShowCreatInvestorModel((prev) => !prev)}
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
          showCreatInvestorModel ? "flex" : " hidden"
        }`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow-sm ">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 ">
                Create New Investor
              </h3>
              <button
                onClick={() => setShowCreatInvestorModel((prev) => !prev)}
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
                <div className="col-span-2">
                  <label
                    for="name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Investor Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label
                    for="email"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Investor Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label
                    for="phone"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Mobile Number
                  </label>
                  <input
                    type="phone"
                    name="phone"
                    id="phone"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    for="password"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    for="confirmPassword"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={createInvestor.isPending}
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-800"
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
                {createInvestor.isPending ? "Creating..." : "Create Investor"}
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
              <h3 className=" text-2xl font-bold">Investor Created!</h3>
              <h3 className="my-5 text-lg font-normal text-gray-800">
                You Have Successfully Crated New Investor. Investor Name is{" "}
                <span className=" font-medium">
                  {createInvestor?.data?.data?.name}
                </span>
                , Investor ID is{" "}
                <span className=" font-medium">
                  {createInvestor?.data?.data?.userId}
                </span>
                , and Password is{" "}
                <span className=" font-medium">
                  {createInvestor?.data?.data?.password}
                </span>
                , Please Login to access Investor Profile
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

export default CreateInvestor;
