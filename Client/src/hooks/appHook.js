import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createInvestment,
  createInvestor,
  createPlan,
  deletePlan,
  getAdminDashboard,
  getInvestmentById,
  getInvestorById,
  getInvestorInvestments,
  getInvestors,
  getPlan,
  getUserDashboard,
  loginUser,
  logOut,
  markMonthPaid,
  updatePassword,
} from "../api/appApi.js";
import { toast } from "react-hot-toast";
import { useApp } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { setUser } = useApp();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUser(data.data.user);
      toast.success(data?.message);
    },
    onError: (error) => {
      console.log("AxiosError:", error); // 👈 keep this
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg); // 👈 this is what should show your message
    },
  });
};

export const useCreateInvestor = () => {
  return useMutation({
    mutationFn: createInvestor,
    onError: (error) => {
      console.log("AxiosError:", error); // 👈 keep this
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg); // 👈 this is what should show your message
    },
  });
};

export const useLogOut = () => {
  const { setUser } = useApp();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: logOut,
    onSuccess: (data) => {
      toast.success(data?.message);
      setUser(null);
      navigate("/auth/login");
    },
    onError: (error) => {
      console.log("AxiosError:", error); // 👈 keep this
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg); // 👈 this is what should show your message
    },
  });
};

export const useGetInvestors = (filters) => {
  return useQuery({
    queryKey: ["investors", filters],
    queryFn: () => getInvestors(filters),
    keepPreviousData: true,
    staleTime: 0,
  });
};

export const useCreateInvestment = () => {
  return useMutation({
    mutationFn: createInvestment,
    onError: (error) => {
      console.log("AxiosError:", error); // 👈 keep this
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg); // 👈 this is what should show your message
    },
  });
};

export const useGetInvestorDetails = (invId) => {
  return useQuery({
    queryKey: ["investor", invId], // unique cache key per investor
    queryFn: () => getInvestorById(invId),
    enabled: !!invId, // only fetch if id exists
    staleTime: 0,
  });
};

export const useGetAdminDashboard = () => {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: () => getAdminDashboard(),
    staleTime: 0,
  });
};

export const useGetInvestmentDetails = (investmentId) => {
  return useQuery({
    queryKey: ["investment", investmentId], // unique cache key per investor
    queryFn: () => getInvestmentById(investmentId),
    enabled: true, // only fetch if id exists
    staleTime: 0,
  });
};

export const useCreatePlan = () => {
  return useMutation({
    mutationFn: createPlan,
    onError: (error) => {
      console.log("AxiosError:", error); // 👈 keep this
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg); // 👈 this is what should show your message
    },
  });
};

export const useGetPlans = () => {
  return useQuery({
    queryKey: ["getPlan"],
    queryFn: () => getPlan(),
    staleTime: 0,
  });
};

export const useDeletePlan = () => {
  return useMutation({
    mutationFn: deletePlan,
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (error) => {
      console.log("AxiosError:", error); // 👈 keep this
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg); // 👈 this is what should show your message
    },
  });
};

export const useMarkMonthAsPaid = () => {
  return useMutation({
    mutationFn: markMonthPaid,
    onError: (error) => {
      console.log("AxiosError:", error); // 👈 keep this
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg); // 👈 this is what should show your message
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: updatePassword,
    onError: (error) => {
      console.log("AxiosError:", error); // 👈 keep this
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg); // 👈 this is what should show your message
    },
  });
};


// user Hooks
export const useGetUserDashboard = () => {
  return useQuery({
    queryKey: ["userDashboard"],
    queryFn: () => getUserDashboard(),
    staleTime: 0,
  });
};

export const useGetInvestoInvestments = () => {
  return useQuery({
    queryKey: ["getInvestorInvestments"],
    queryFn: () => getInvestorInvestments(),
    staleTime: 0,
  });
};
