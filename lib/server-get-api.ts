import axios from "axios";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_KEY } from "@/routes/auth-keys";
import { DEFAULT_API_BASE_URL, DEFAULT_CLIENT_DOMAIN } from "./axios-instance";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export async function serverApiGet<T>(url: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value;

  const res = await axios.get<T>(`${baseURL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      "x-client-domain":
        process.env.NEXT_PUBLIC_CLIENT_DOMAIN ?? DEFAULT_CLIENT_DOMAIN,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  return res.data;
}