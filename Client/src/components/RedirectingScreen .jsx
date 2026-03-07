import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectingScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(-1);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/40">
      <h1 className="text-2xl font-semibold text-white animate-pulse">
        Redirecting...
      </h1>
    </div>
  );
};

export default RedirectingScreen;