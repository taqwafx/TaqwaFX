import React, { useRef, useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import { useLocation } from "react-router-dom";
import { useDisable2FA, useVerifyLogin2FA } from "../hooks/appHook.js";
import toast from "react-hot-toast";
import RedirectingScreen from "../components/RedirectingScreen .jsx";
import NotFound from "./NotFound.jsx";
import { useApp } from "../context/AppContext.jsx";

const Auth2FACheck = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [showRedirect, setShowRedirect] = useState(false);
  const inputsRef = useRef([]);
  const { user, setUser } = useApp();

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const disable2FA = useDisable2FA();
  const verifyLogin2FA = useVerifyLogin2FA();

  const location = useLocation();
  const mode = location.state?.mode;
  const tempToken = location.state?.tempToken;

  if (!mode || (mode !== "login" && mode !== "disable")) {
    return <NotFound />;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const otpToken = otp.join("");

    if (mode === "login") {
      verifyLogin2FA.mutate({
        otp: otpToken,
        tempToken,
      });
    }
    if (mode === "disable") {
      disable2FA.mutate({
        otp: otpToken,
      });
    }
  };

  useEffect(() => {
    if (disable2FA?.isSuccess || verifyLogin2FA?.isSuccess) {
      toast.success(
        disable2FA?.data?.message || verifyLogin2FA?.data?.message,
        {
          duration: 2000,
        },
      );

      setTimeout(() => {
        setShowRedirect(true);
      }, 1000);
    }
    if (verifyLogin2FA?.data) {
      setUser(verifyLogin2FA?.data?.data?.user);
    }
  }, [disable2FA?.isSuccess, verifyLogin2FA?.isSuccess]);
  return (
    <>
      <div className="w-full h-full">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Logo */}
            <Logo />
          </nav>
        </header>

        <div className="w-full flex flex-col items-center justify-center mt-40 px-5 box-border">
          <div className=" flex items-center  justify-center flex-col">
            <h1 className=" font-semibold text-lg">
              Verify 2 Step Authentication
            </h1>
            <span className="mt-1 text-center">
              Enter the passcode from your Google Authenticator (or similar)
              app:
            </span>
            <span className="mt-1 text-center">
              {mode === "login"
                ? "To Verify your authentication code"
                : "To Verify OTP & disable 2FA"}
            </span>
          </div>

          <div className=" mt-8">
            <div>
              <form onSubmit={handleFormSubmit}>
                <div className="flex mb-2 space-x-2 rtl:space-x-reverse">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      ref={(el) => (inputsRef.current[index] = el)}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      autoFocus={index == 0}
                      required
                      className="block border border-[#484545] text-lg rounded-md focus:ring-brand focus:border-brand h-10 w-10 shadow-xs placeholder:text-body text-center"
                    />
                  ))}
                </div>

                {mode === "login" ? (
                  <button
                    disabled={verifyLogin2FA.isPending}
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-800 mt-3"
                  >
                    {verifyLogin2FA.isSuccess
                      ? "Verified!"
                      : verifyLogin2FA.isPending
                        ? "Verifying..."
                        : "Verify Token"}
                  </button>
                ) : (
                  <button
                    disabled={disable2FA.isPending}
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-800 mt-3"
                  >
                    {disable2FA.isSuccess
                      ? "Verified!"
                      : disable2FA.isPending
                        ? "Verifying..."
                        : "Verify Token"}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {showRedirect && <RedirectingScreen />}
    </>
  );
};

export default Auth2FACheck;
