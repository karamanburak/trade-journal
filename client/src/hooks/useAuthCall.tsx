import { useDispatch } from "react-redux";
import { fetchStart, fetchFail, loginSuccess, logoutSuccess, registerSuccess } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import useAxios, { axiosWithPublic } from "./useAxios";
import toastNotify from "../utils/toastNotify";

const handleAxiosError = (error: unknown) => {
    if (error instanceof AxiosError && error.response) {
        const message = error.response.data?.message || "An unexpected error occurred";
        toastNotify("error", message);
    } else {
        toastNotify("error", "An unexpected error occurred");
    }
};

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
        } catch (error) {
            dispatch(fetchFail());
            handleAxiosError(error)
        }
    };

    // Login Users
    const login = async (userInfo: object) => {
        dispatch(fetchStart());
        try {
            const { data } = await axiosWithPublic.post(`auth/login`, userInfo);
            dispatch(loginSuccess(data));
            // console.log('Login response:', data);
            toastNotify("success", `Hello ${data.user.username}! Welcome back!`);
            navigate("/");
        } catch (error) {
            console.error('Login error details:', error);
            dispatch(fetchFail());
            handleAxiosError(error)
        }
    };


    // Logout User
    const logout = async () => {
        dispatch(fetchStart());
        try {
            await axiosWithToken(`auth/logout`);
            dispatch(logoutSuccess());
            toastNotify("success", "You have been logged out successfully.");
            navigate("/");
        } catch (error) {
            dispatch(fetchFail());
            handleAxiosError(error)

        }
    };

    return { register, login, logout };
};

export default useAuthCall;