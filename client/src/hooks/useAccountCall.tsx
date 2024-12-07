import toastNotify from "../utils/toastNotify";
import { handleAxiosError } from "./handleAxiosError";
import useAxios from "./useAxios";

const useAccountCall = () => {
    const axiosWithToken = useAxios();

    const getAccount = async (userId: string) => {
        try {
            const { data } = await axiosWithToken.get(`accounts?filter[userId]=${userId}`);
            // console.log(data.data);
            return data;
        } catch (error) {
            console.error("Error getting account:", error);
            handleAxiosError(error)
            return null;
        }
    };

    const updateAccount = async (depositData: { accountId: string, userId: string, amount: number, transactionType: string }) => {
        try {
            const { data } = await axiosWithToken.post(`deposits`, depositData);
            // toastNotify("success", "Value updated successfully.");
            return data;
        } catch (error) {
            console.error("Error getting account:", error);
            handleAxiosError(error)
            return null;
        }
    };

    return {
        getAccount,
        updateAccount,
    };
};

export default useAccountCall;
