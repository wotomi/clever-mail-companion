
import axios from "axios";

// You should update this with your actual backend URL
const API_BASE_URL = "https://api.yourbackend.com";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      // Import auth dynamically to avoid circular dependency
      const { auth } = await import("@/lib/firebase");
      const user = auth.currentUser;
      
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error setting auth token:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Gmail OAuth APIs
export const connectGmail = async () => {
  const response = await api.get("/oauth/connect-gmail");
  return response.data;
};

export const checkGmailStatus = async () => {
  const response = await api.get("/oauth/gmail-status");
  return response.data;
};

export const revokeGmail = async () => {
  const response = await api.post("/oauth/revoke-gmail");
  return response.data;
};

// Slack OAuth APIs
export const connectSlack = async () => {
  const response = await api.get("/oauth/connect-slack");
  return response.data;
};

export const checkSlackStatus = async () => {
  const response = await api.get("/oauth/slack-status");
  return response.data;
};

// Email Processing APIs
export const processEmails = async (maxEmails?: number) => {
  const params = maxEmails ? { max_emails: maxEmails } : {};
  const response = await api.post("/emails/process", {}, { params });
  return response.data;
};

export const getEmailHistory = async (limit?: number) => {
  const params = limit ? { limit } : {};
  const response = await api.get("/emails/history", { params });
  return response.data;
};

export const processSpecificEmail = async (emailId: string) => {
  const response = await api.post(`/emails/${emailId}/process`);
  return response.data;
};

// User Settings APIs
export const getUserSettings = async () => {
  const response = await api.get("/user/settings");
  return response.data;
};

export const updateUserSettings = async (settings: any) => {
  const response = await api.put("/user/settings", settings);
  return response.data;
};

export default api;
