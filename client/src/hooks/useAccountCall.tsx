import useAxios from "./useAxios";

const useAccountCall = () => {
    const axiosWithToken = useAxios();

    const getAccount = async (userId: string) => {
        try {
            const { data } = await axiosWithToken.get(`/accounts?filter[userId]=${userId}`);
            // console.log(data.data);
            return data;
        } catch (error) {
            console.error("Error getting account:", error);
            return null;
        }
    };

    return {
        getAccount,
    };
};

export default useAccountCall;
