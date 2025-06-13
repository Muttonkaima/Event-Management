import { post } from "@/services/controllerServices";

export async function loginUser(email: string, password: string) {
  try {
    const data = await post("/auth/login", { email, password });
    const user = JSON.stringify(data.data.user);
    const token = JSON.stringify(data.data.token);

    localStorage.setItem('user',user);
    localStorage.setItem('token',  token);

    console.log('login response----',data)

    return data;
  } catch (err: any) {
    throw new Error(err.message || "Login failed. Please try again.");
  }
}

export async function logoutUser() {
  try {
    // await del("/auth/logout");

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    return true;
  } catch (err: any) {
    throw new Error(err.message || "Logout failed. Please try again.");
  }
}
  