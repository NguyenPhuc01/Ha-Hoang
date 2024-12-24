import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: "https://chat-app-programer.onrender.com/api/",
  withCredentials: true,
});
