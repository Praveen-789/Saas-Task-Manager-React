import API from "./api";
// import { useParams } from "react-router-dom";

interface RegisterData {
    email: string;
    name: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface ForgotPassword{
    email:string
}

interface ResetPassword {
  password: string;
}

export const registerUser = async (data: RegisterData) => {
    const res = await API.post("/user/register", data);
    return res.data;
};

export const loginUser = async (data: LoginData) => {
    const res = await API.post("/user/login", data);
    return res.data;
};

export const forgotPassword = async(data:ForgotPassword) =>{
    const res = await API.post("/user/forgot-password", data)
    return res.data;
}

export const resetPassword = async (token: string, data: ResetPassword) => {
  const res = await API.post(`/user/reset-password/${token}`, data);
  return res.data;
};