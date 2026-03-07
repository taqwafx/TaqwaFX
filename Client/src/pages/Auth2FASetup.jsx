import React, { useEffect, useRef, useState } from "react";
import Logo from "../components/Logo.jsx";
import { useSetup2FA, useVerify2FASetup } from "../hooks/appHook.js";
import Loader from "../components/Loader.jsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import RedirectingScreen from "../components/RedirectingScreen .jsx";
import NotFound from "./NotFound.jsx";

const Auth2FASetup = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [showRedirect, setShowRedirect] = useState(false);
  const [qrLoading, setQrLoading] = useState(true);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

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

  const verify2FASetup = useVerify2FASetup();
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const otpToken = otp.join("");
    verify2FASetup.mutate({ otp: otpToken });
  };

  const setup2FA = useSetup2FA();

  useEffect(() => {
    if (setup2FA?.isError) {
      toast.error("Something went wrong!");
      navigate(-1);
    }
  }, [setup2FA?.isError]);

  useEffect(() => {
    if (setup2FA?.data?.data?.qrCode) {
      setQrLoading(true);
    }
  }, [setup2FA?.data?.data?.qrCode]);

  useEffect(() => {
    if (verify2FASetup?.data) {
      toast.success(verify2FASetup?.data?.message, {
        duration: 2000,
      });

      setTimeout(() => {
        setShowRedirect(true);
      }, 1000);
    }
  }, [verify2FASetup?.isSuccess, verify2FASetup?.data]);

  if (setup2FA?.isLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  return (
    <>
      <div className="w-full h-full">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Logo />
          </nav>
        </header>

        <div className="w-full flex flex-col items-center justify-center mt-20 px-5 box-border">
          <div className=" flex items-center  justify-center flex-col">
            <h1 className=" font-semibold text-lg">
              Setup 2 Step Authentication
            </h1>
            <span className="mt-1 text-center">
              Scan this QR code with Google Authenticator (or similar) app:
            </span>
          </div>
          <div className="w-[150px] h-[150px] flex items-center justify-center my-8">
            {qrLoading && (
              <div className="absolute">
                <Loader />
              </div>
            )}
            <img
              className="w-[150px] h-[150px] aspect-auto"
              alt="QR Code"
              onLoad={() => setQrLoading(false)}
              onError={() => setQrLoading(false)}
              src={setup2FA?.data?.data?.qrCode}
            />
          </div>
          <div>
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
                      autoFocus={index==0}
                      required
                      className="block border border-[#484545] text-lg rounded-md focus:ring-brand focus:border-brand h-10 w-10 shadow-xs placeholder:text-body text-center"
                    />
                  ))}
                </div>
                <button
                  disabled={verify2FASetup.isPending}
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-800 mt-3"
                >
                  {verify2FASetup.isSuccess
                    ? "Verified!"
                    : verify2FASetup.isPending
                      ? "Verifying..."
                      : "Verify Token"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showRedirect && <RedirectingScreen />}
    </>
  );
};

export default Auth2FASetup;
