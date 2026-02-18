import api from "../api/axios";

// AUTH SERVICE = backend communication only
const authService = {
  signup: async (data) => {
    const res = await api.post("/auth/signup", data);
    return res.data;
  },

  login: async (data) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get("/users/profile");
    return res.data;
  },

  logout: async () => {
    await api.post("/auth/logout");
  },
};

export default authService;
