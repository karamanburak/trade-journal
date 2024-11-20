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
            return null;
        }
    };
    const updateAccount = async (accountId: string) => {
        try {
            const { data } = await axiosWithToken.get(`accounts/${accountId}`);
            console.log(data.data);
            return data;
        } catch (error) {
            console.error("Error getting account:", error);
            return null;
        }
    };

    return {
        getAccount,
        updateAccount
    };
};

export default useAccountCall;
