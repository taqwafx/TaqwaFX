import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import { useApp } from "../context/AppContext.jsx";
import { getMe } from "../api/appApi.js";
import Loader from "../components/Loader.jsx";
import { useGetPlans, useLogOut } from "../hooks/appHook.js";
import "flowbite";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const { user, setUser, setPlans } = useApp();
  const [loading, setLoading] = useState(true);
  const logOut = useLogOut();

  const { data, isSuccess } = useGetPlans();

  const handleLogOut = () => {
    logOut.mutate();
  };

  useEffect(() => {
    if (isSuccess) setPlans(data?.data);
  }, [isSuccess]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setUser(res.data.user); // ✅ matches your backend structure
        console.log("User session restored");
      } catch (error) {
        console.log("Session expired or not logged in:", error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return (
      <div className=" w-screen h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 ">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                onClick={toggleSidebar}
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <span class="sr-only">Open sidebar</span>
                <svg
                  class="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <div className="flex ms-4 md:me-24 ">
                <Logo />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 
          ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-green mt-10 ">
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to={`${
                  user?.role === "admin"
                    ? "/admin/dashboard"
                    : "/user/dashboard"
                }`}
                className={({ isActive }) =>
                  `flex items-center p-5 text-gray-900 rounded-lg group ${
                    isActive ? "bg-blue-100" : "hover:bg-gray-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition duration-75 ${
                        isActive ? "text-gray-900" : "group-hover:text-gray-900"
                      } `}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 21"
                    >
                      <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                      <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                    </svg>
                    <span className="ms-3">Dashboard</span>
                  </>
                )}
              </NavLink>
            </li>

            <li className={`${user?.role === "investor" ? "block" : "hidden"}`}>
              <NavLink
                to="/user/investments"
                className={({ isActive }) =>
                  `flex items-center p-5 text-gray-900 rounded-lg group ${
                    isActive ? "bg-blue-100" : "hover:bg-gray-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition duration-75 ${
                        isActive ? "text-gray-900" : "group-hover:text-gray-900"
                      } `}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 18"
                    >
                      <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                    </svg>
                    <span className="ms-3">Investments</span>
                  </>
                )}
              </NavLink>
            </li>

            <li className={`${user?.role === "admin" ? "block" : "hidden"}`}>
              <NavLink
                to="/admin/investors"
                className={({ isActive }) =>
                  `flex items-center p-5 text-gray-900 rounded-lg group ${
                    isActive ? "bg-blue-100" : "hover:bg-gray-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition duration-75 ${
                        isActive ? "text-gray-900" : "group-hover:text-gray-900"
                      } `}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 18"
                    >
                      <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                    </svg>
                    <span className="ms-3">Investors</span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to={`${
                  user?.role === "admin" ? "/admin/plans" : "/user/plans"
                }`}
                className={({ isActive }) =>
                  `flex items-center p-5 text-gray-900 rounded-lg group ${
                    isActive ? "bg-blue-100" : "hover:bg-gray-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition duration-75 ${
                        isActive ? "text-gray-900" : "group-hover:text-gray-900"
                      } `}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 17 20"
                    >
                      <path d="M7.958 19.393a7.7 7.7 0 0 1-6.715-3.439c-2.868-4.832 0-9.376.944-10.654l.091-.122a3.286 3.286 0 0 0 .765-3.288A1 1 0 0 1 4.6.8c.133.1.313.212.525.347A10.451 10.451 0 0 1 10.6 9.3c.5-1.06.772-2.213.8-3.385a1 1 0 0 1 1.592-.758c1.636 1.205 4.638 6.081 2.019 10.441a8.177 8.177 0 0 1-7.053 3.795Z" />
                    </svg>
                    <span className="ms-3">Plans</span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <button
                onClick={handleLogOut}
                className={
                  "flex items-center p-5 text-gray-900 rounded-lg group hover:bg-gray-100 w-full cursor-pointer"
                }
              >
                <svg
                  className={
                    "w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                  }
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                  />
                </svg>
                <span className="ms-3">Log Out</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64 mt-[4.5rem] h-full">
        <div className="w-full 2xl:max-w-[1184px] m-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AppLayout