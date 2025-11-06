import React, { useEffect, useState } from "react";
import Logo from "../components/Logo.jsx";
import { useLogin } from "../hooks/appHook.js";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { getMe } from "../api/appApi.js";
import Loader from "../components/Loader.jsx";

const Login = () => {
  const [formData, setFormData] = useState({ userId: "", password: "" });
  const [loading, setLoading] = useState(true);

  const login = useLogin();
  const { user, setUser } = useApp();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login.mutate(formData);
  };

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

  useEffect(() => {
    if (user) {
      if (user.role === "admin")
        navigate("/admin/dashboard", { replace: true });
      else navigate("/user/dashboard", { replace: true });
    }
  }, [user, navigate]);

  if (loading)
    return (
      <div className=" w-screen h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="w-full h-full">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Logo />
        </nav>
      </header>
      <div className="w-full h-[calc(100vh-83px)] flex items-center justify-center">
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-lg sm:p-6 md:p-8 m-4 ">
          <form onSubmit={handleSubmit} className="space-y-6" action="#">
            <h5 className="text-xl font-medium text-gray-900 ">
              Log in to our platform
            </h5>
            <div>
              <label
                htmlFor="userId"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Login Id
              </label>
              <input
                type="text"
                name="userId"
                id="userId"
                placeholder="INV000"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                value={formData.userId}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Your password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-start">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300"
                    required
                  />
                </div>
                <label
                  htmlFor="remember"
                  className="ms-2 text-sm font-medium text-gray-900 "
                >
                  Remember me
                </label>
              </div>
              <span
                onClick={() =>
                  toast.error(
                    "Please Contact Admin to Recover Password.",
                    "Info"
                  )
                }
                className="ms-auto text-sm text-blue-700 hover:underline cursor-pointer"
              >
                Lost Password?
              </span>
            </div>
            <button
              type="submit"
              disabled={login.isPending}
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-800 "
            >
              {login.isPending ? "Logging in..." : "Login to your account"}
            </button>
            <div className="text-sm font-medium text-gray-500 ">
              Not registered?{" "}
              <span
                onClick={() =>
                  toast.error("Please Contact Admin to Create Account.", "Info")
                }
                className="text-blue-700 hover:underline cursor-pointer "
              >
                Create account
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login