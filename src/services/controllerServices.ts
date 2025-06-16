import axios, { AxiosRequestConfig, Method } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials; // not needed for axios, kept for compatibility
}

async function request(
  method: Method,
  url: string,
  options: RequestOptions = {}
) {
  try {
    // Get token from localStorage if available
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');

      console.log('token from controleer----',token)
      if (token) token = token.trim().replace(/^"|"$/g, ''); // Remove whitespace and wrapping quotes
    }
    const config: AxiosRequestConfig = {
      method,
      url,
      headers: {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      data: options.body || undefined,
    };

    const res = await axiosInstance(config);
    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Request failed";
    throw new Error(message);
  }
}

export function get(url: string, options: RequestOptions = {}) {
  return request("GET", url, options);
}

export function post(url: string, body?: any, options: RequestOptions = {}) {
  return request("POST", url, { ...options, body });
}

export function put(url: string, body?: any, options: RequestOptions = {}) {
  return request("PUT", url, { ...options, body });
}

export function del(url: string, options: RequestOptions = {}) {
  return request("DELETE", url, options);
}

/**
 * Upload service to send image(s) + text data as multipart/form-data
 * @param url - API endpoint (relative to base URL)
 * @param data - FormData object or plain object to be converted
 */
export async function upload(url: string, data: Record<string, any> | FormData) {
  try {
    let formData: FormData;

    if (data instanceof FormData) {
      // Already FormData (skip conversion)
      formData = data;
    } else {
      // Convert plain object to FormData
      formData = new FormData();
      for (const key in data) {
        const value = data[key];
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      }
    }

    // ✅ Get token from localStorage (if available)
    let token: string | null = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
      if (token) token = token.trim().replace(/^"|"$/g, "");
    }

    const res = await axiosInstance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Upload failed";
    throw new Error(message);
  }
}



export { request };
