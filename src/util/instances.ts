import axios from "axios";
import { API_PATH } from "./global.constants";

export const axiosInstance = axios.create({
  baseURL: API_PATH,
});

export const store: {
  profile: JwtDto | null;
  boards: Board[] | null;
} = { profile: null, boards: null };
