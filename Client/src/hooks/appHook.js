import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createAffiliateIB,
  createInvestment,
  createInvestor,
  createPlan,
  deletePlan,
  getAdminAffiliateIBDashboard,
  getAdminDashboard,
  getAffiliateUserById,
  getInvestmentById,
  getInvestorById,
  getInvestorInvBankDetails,
  getInvestorInvestments,
  getInvestors,
  getPlan,
  getReferralUserInvestments,
  getTransactions,
  getUserDashboard,
  loginUser,
  logOut,
  markMonthPaid,
  updatePassword,
  uploadInvAgreement,
  verifyAffiliateIB,
  verifyInvestorForAffiliateIB,
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
  return useInfiniteQuery({
    queryKey: ["investors", filters],
    queryFn: getInvestors,

    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },

    staleTime: 0,
  });
};

export const useCreateInvestment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInvestment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["gGetInvestorDetails"],
      });
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

export const useUploadInvAgreement = () => {
  return useMutation({
    mutationFn: uploadInvAgreement,
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
    queryKey: ["gGetInvestorDetails", invId], // unique cache key per investor
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

export const useGetInvestorInvBankDetails = (investmentId) => {
  return useQuery({
    queryKey: ["getInvestorInvBankDetails", investmentId],
    queryFn: () => getInvestorInvBankDetails(investmentId),
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

export const useGetTransactions = (filters) => {
  return useInfiniteQuery({
    queryKey: ["getTransactions", filters],
    queryFn: getTransactions,

    getNextPageParam: (lastPage) => {
      const { page, hasMore } = lastPage.data.pagination;
      return hasMore ? page + 1 : undefined;
    },

    staleTime: 0,
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

// affiliate IB
export const useVerifyAffiliateIB = () => {
  return useMutation({
    mutationFn: verifyAffiliateIB,
    onError: (error) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg);
    },
  });
};

export const useVerifyInvestorForAffiliateIB = () => {
  return useMutation({
    mutationFn: verifyInvestorForAffiliateIB,
    onError: (error) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg);
    },
  });
};

export const useCreateAffiliateIB = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAffiliateIB,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAdminAffiliateIBDashboard"],
      });
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg);
    },
  });
};

export const useGetAffiliateAdminDashboard = () => {
  return useQuery({
    queryKey: ["getAdminAffiliateIBDashboard"],
    queryFn: () => getAdminAffiliateIBDashboard(),
    staleTime: 0,
  });
};

export const useGetAffiliateUserDetails = (affiliateIBId) => {
  return useQuery({
    queryKey: ["affiliateIBId", affiliateIBId],
    queryFn: () => getAffiliateUserById(affiliateIBId),
    enabled: !!affiliateIBId, // only fetch if id exists
    staleTime: 0,
  });
};

export const useGetReferralUserInvestments = (investorId) => {
  return useQuery({
    queryKey: ["investorId", investorId],
    queryFn: () => getReferralUserInvestments(investorId),
    enabled: !!investorId, // only fetch if id exists
    staleTime: 0,
  });
};
