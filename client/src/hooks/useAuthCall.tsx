import { useDispatch } from "react-redux";
import { fetchStart, fetchFail, loginSuccess, logoutSuccess, registerSuccess } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import useAxios, { axiosWithPublic } from "./useAxios";
import toastNotify from "../utils/toastNotify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const useAuthCall = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosWithToken = useAxios()


    // Register User
    const register = async (userInfo: object) => {
        dispatch(fetchStart());
        try {
            const { data } = await axiosWithPublic.post(`auth/register`, userInfo);
            console.log(data);
            dispatch(registerSuccess(data.data));
            toastNotify("success", data.message)
            navigate("/");
        } catch (error: unknown) {
            dispatch(fetchFail());
            if (error instanceof AxiosError && error.response) {
                toastNotify("error", error.response.data.message || "An unexpected error occurred");
            } else {
                toastNotify("error", "An unexpected error occurred");
            }
        }
    };

    // Login Users
    const login = async (userInfo: object) => {
        dispatch(fetchStart());
        try {
            const { data } = await axiosWithPublic.post(`auth/login`, userInfo);
            dispatch(loginSuccess(data));
            console.log('Login response:', data);
            toastNotify("success", `Hello ${data.user.username}! Welcome back!`);
            navigate("/");
        } catch (error: unknown) {
            console.error('Login error details:', error);
            dispatch(fetchFail());
            if (error instanceof AxiosError && error.response) {
                toastNotify("error", error.response.data.message || "An unexpected error occurred");
            } else {
                toastNotify("error", "An unexpected error occurred");
            }
        }
    };



    // Logout User
    const logout = async () => {
        dispatch(fetchStart());
        try {
            await axiosWithToken.post(`auth/logout`, {}, { withCredentials: true });
            dispatch(logoutSuccess());
            toastNotify("success", "You have been logged out successfully.");
            navigate("/login");
        } catch (error) {
            dispatch(fetchFail());
            if (error instanceof AxiosError && error.response) {
                toastNotify("error", error.response.data.message || "An unexpected error occurred");
            } else {
                toastNotify("error", "An unexpected error occurred");
            }
        }
    };

    return { register, login, logout };
};

export default useAuthCall;