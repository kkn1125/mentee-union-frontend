import axios from "axios";
import { API_PATH } from "./global.constants";

export const axiosInstance = axios.create({
  baseURL: API_PATH,
});
