import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const Settings = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  const handleBtnClick = () => {
    if (user?.twoFactorEnabled) {
      navigate("/auth/2fa-check/", {
        state: {
          mode: "disable",
        },
      });
    } else {
      navigate("/auth/2fa-setup/");
    }
  };

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
                Settings
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        <div
          id="informational-banner"
          tabindex="-1"
          class="flex flex-col justify-between w-full p-4 border-b border-default md:flex-row bg-white rounded-md"
        >
          <div class="mb-4 md:mb-0 md:me-4">
            <h2 class="mb-1 text-base font-semibold text-heading">
              Add 2FA Security
            </h2>
            <p class="flex items-center text-sm font-normal text-body">
              You can Add Two Step Authentication to secure Your Investment Data
            </p>
          </div>

          <div class="flex items-center shrink-0 space-x-2">
            <button
              onClick={handleBtnClick}
              class="text-white bg-red-500 shadow-xs font-medium leading-5 rounded-md text-md px-5 py-2"
            >
              {user?.twoFactorEnabled ? "Disable 2FA Auth" : "Add 2FA Auth"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Settings;
