import { post } from "@/services/controllerServices";

export async function loginOrganizer(email: string, password: string) {
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

export async function logoutOrganizer() {
  try {
    // await del("/auth/logout");

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    return true;
  } catch (err: any) {
    throw new Error(err.message || "Logout failed. Please try again.");
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const response = await post("/user/login", { email, password });

    const { user, token } = response.data || {};

    if (!user || !token) {
      throw new Error("Invalid response from server. Missing user or token.");
    }

    // Save to localStorage safely
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", JSON.stringify(token));

    console.log("Login response ----", response);

    return response;
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err.message || "Login failed. Please try again.";
    console.error("Login error ----", message);
    throw new Error(message);
  }
}


export async function logoutUser() {
  try {
    // await del("/user/auth/logout");

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    return true;
  } catch (err: any) {
    throw new Error(err.message || "Logout failed. Please try again.");
  }
}

  
  