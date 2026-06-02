import api from "./api";
import { AxiosError } from "axios";

// لاگین کاربر – توکن را برمی‌گرداند
export const loginUser = async (username: string, password: string): Promise<{ access: string; refresh: string }> => {
  const baseURL = api.defaults.baseURL || 
                  process.env.NEXT_PUBLIC_API_URL || 
                  "http://localhost:8000/api";

  const candidates = ["token/", "auth/login/", "login/"];

  for (const path of candidates) {
    const cleanBase = baseURL.replace(/\/$/, "");
    const cleanPath = path.replace(/^\//, "");
    const fullUrl = `${cleanBase}/${cleanPath}`;

    try {
      const res = await api.post(path, { username, password });
      return res.data; // { access, refresh }
    } catch (err) {
      const error = err as AxiosError;
      if (error.isAxiosError && error.response?.status === 404) {
        console.warn(`Path ${fullUrl} not found, trying next...`);
        continue;
      }
      throw err;
    }
  }

  throw new Error(`No login endpoint found. Tried: ${candidates.map(p => `${baseURL}/${p}`).join(', ')}`);
};

// ثبت‌نام کاربر – فرض می‌کنیم بک‌اند endpoint ای مثل /auth/register/ دارد
export const registerUser = async (
  usernameOrPayload: string | { username: string; email?: string; password: string },
  password?: string
): Promise<unknown> => {
  let payload: unknown;
  if (typeof usernameOrPayload === "string") {
    payload = { username: usernameOrPayload, password: password! };
  } else {
    payload = usernameOrPayload;
  }

  // مسیرهای احتمالی برای ثبت‌نام
  const candidates = ["auth/register/", "register/", "users/register/"];

  for (const path of candidates) {
    try {
      const res = await api.post(path, payload);
      return res.data; // ممکن است شامل توکن یا پیام موفقیت باشد
    } catch (err) {
      const error = err as AxiosError;
      if (error.isAxiosError && error.response?.status === 404) {
        console.warn(`Register path ${path} not found, trying next...`);
        continue;
      }
      throw err;
    }
  }

  throw new Error(`No register endpoint found. Tried: ${candidates.map(p => `${api.defaults.baseURL}/${p}`).join(', ')}`);
};

// خروج کاربر – فقط توکن را پاک می‌کند (در صورت نیاز می‌توانید به سرور هم درخواست بدهید)
export const logoutUser = async (): Promise<boolean> => {
  // در صورت تمایل به باطل کردن توکن در سرور، می‌توانید یک درخواست POST به /auth/logout/ بفرستید
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  return true;
};