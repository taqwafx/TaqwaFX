import { api } from "./client";

export const getMe = async () => {
  const res = await api.get("/user/me");
  return res.data;
};

export const loginUser = async (formData) => {
  const res = await api.post("/user/login", formData);
  return res.data;
};

export const logOut = async (formData) => {
  const res = await api.get("/user/logout");
  return res.data;
};

export const updatePassword = async (formData) => {
  const res = await api.put("/user/updatePassword", formData);
  return res.data;
};

export const createInvestor = async (formData) => {
  const res = await api.post("/user/createInvestor", formData);
  return res.data;
};

export const getInvestors = async ({ pageParam = 1, queryKey }) => {
  const [_key, filters] = queryKey;

  const res = await api.get("/user/featch/investores", {
    params: {
      ...filters,
      page: pageParam,
      limit: 15,
    },
  });

  return res.data;
};

export const getInvestorById = async (invId) => {
  const res = await api.get(`/user/featch/investor-details/${invId}`);
  return res.data;
};

export const getAdminDashboard = async () => {
  const res = await api.get("/user/featch/admin/dashboard");
  return res.data;
};

export const getInvestmentById = async (investmentId) => {
  const res = await api.get(
    `/investment/featch/investment-details/${investmentId}`
  );
  return res.data;
};

export const createInvestment = async (dataObj) => {
  const fd = new FormData();

  // convert plain object → real FormData
  Object.keys(dataObj).forEach((key) => {
    if (dataObj[key] !== null && dataObj[key] !== undefined) {
      fd.append(key, dataObj[key]);
    }
  });

  const res = await api.post("/investment/create", fd);
  return res.data;
};

export const uploadInvAgreement = async (dataObj) => {
  const fd = new FormData();

  // convert plain object → real FormData
  Object.keys(dataObj).forEach((key) => {
    if (dataObj[key] !== null && dataObj[key] !== undefined) {
      fd.append(key, dataObj[key]);
    }
  });

  const res = await api.put("/investment/uploadInvAgreement", fd);
  return res.data;
};

export const getInvestorInvBankDetails = async (userId) => {
  const res = await api.get(`investment/featch/investment/AcDetails/${userId}`);
  return res.data;
};

export const markMonthPaid = async (formData) => {
  const res = await api.post(
    `/investment/markmonthpaid/${formData.id}`,
    formData
  );
  return res.data;
};

export const createPlan = async (formData) => {
  const res = await api.post("/plan/create", formData);
  return res.data;
};

export const getPlan = async () => {
  const res = await api.get("/plan/featch");
  return res.data;
};

export const deletePlan = async (planId) => {
  const res = await api.delete(`/plan/delete/${planId}`);
  return res.data;
};

export const getTransactions = async ({ pageParam = 1, queryKey }) => {
  const [_key, filters] = queryKey;

  const res = await api.get("/transactions/featch", {
    params: {
      ...filters,
      page: pageParam,
      limit: 15,
    },
  });

  return res.data;
};

// user Api's
export const getUserDashboard = async () => {
  const res = await api.get("/user/featch/dashboard");
  return res.data;
};

export const getInvestorInvestments = async () => {
  const res = await api.get(`/investment/featch/investores/`);
  return res.data;
};
