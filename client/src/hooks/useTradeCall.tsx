import { useDispatch } from "react-redux";
import toastNotify from "../utils/toastNotify";
import { axiosWithPublic } from "./useAxios";
import {
    fetchSingleTradeSuccess,
    fetchSingleStockSuccess,
    fetchStockSuccess,
    fetchTradeFail,
    fetchTradeStart,
    fetchTradeSuccess,
} from "../features/tradeSlice";
import { useNavigate } from "react-router-dom";
import { handleAxiosError } from "./handleAxiosError";

const useTradeCall = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const getTrades = async (userId: string): Promise<ITrade[]> => {
        dispatch(fetchTradeStart())
        try {
            const { data } = await axiosWithPublic(`trades?filter[userId]=${userId}&sort[transactionDate]=desc`);
            dispatch(fetchTradeSuccess(data.data));
            // console.log(data.data);
            return data.data;
        } catch (error) {
            console.log("Error getting trades:", error);
            handleAxiosError(error)
            dispatch(fetchTradeFail());
            return []
        }
    };

    const getStocks = async (): Promise<IStock[]> => {
        dispatch(fetchTradeStart());
        try {
            const { data } = await axiosWithPublic("stocks");
            dispatch(fetchStockSuccess(data.data));
            // console.log(data.data);
            return data.data;
        } catch (error) {
            console.log("Error getting stocks:", error);
            dispatch(fetchTradeFail());
            handleAxiosError(error)
            return []
        }
    };

    const getSingleTrade = async (tradeId: string): Promise<void> => {
        dispatch(fetchTradeStart());

        try {
            const { data } = await axiosWithPublic(`trades/${tradeId}`);
            // console.log(data.data);
            dispatch(fetchSingleTradeSuccess(data.data));
            return data.data;
        } catch (error) {
            console.log("Error getting single trade:", error);
            dispatch(fetchTradeFail());
            handleAxiosError(error)

        }
    };
    const getSingleStock = async (stockId: string): Promise<void> => {
        dispatch(fetchTradeStart());
        try {
            const { data } = await axiosWithPublic(`stocks/${stockId}`);
            // console.log(data.data);
            dispatch(fetchSingleStockSuccess(data.data));
        } catch (error) {
            console.log("Error getting single trade:", error);
            dispatch(fetchTradeFail());
            handleAxiosError(error)

        }
    };

    const postTrade = async (tradeInfo: ITrade): Promise<void> => {
        dispatch(fetchTradeStart());
        try {
            const { data } = await axiosWithPublic.post("trades", tradeInfo);
            toastNotify("success", data.message);
            navigate(`/?tab=transactions`);
        } catch (error) {
            console.log("Unknown error:", error);
            dispatch(fetchTradeFail());
            handleAxiosError(error)

        }
    };

    const editTrade = async (tradeId: string, tradeInfo: ITrade): Promise<void> => {
        dispatch(fetchTradeStart());
        try {
            const { data } = await axiosWithPublic.put(`trades/${tradeId}`, tradeInfo);
            dispatch(fetchSingleTradeSuccess(data.new));
            toastNotify("success", data.message);
        } catch (error) {
            console.log("Error editing trade:", error);
            dispatch(fetchTradeFail());
        }
    };
    const editStock = async (stockId: string, stockInfo: IStock): Promise<void> => {
        dispatch(fetchTradeStart());
        try {
            const { data } = await axiosWithPublic.put(`stocks/${stockId}`, stockInfo);
            dispatch(fetchSingleStockSuccess(data.data));
            // console.log(data.data);
            toastNotify("success", data.message);
        } catch (error) {
            console.log("Error editing trade:", error);
            dispatch(fetchTradeFail());
        } finally {
            getStocks()
        }
    };

    const deleteTrade = async (stockId: string): Promise<void> => {
        dispatch(fetchTradeStart());
        try {
            const { data } = await axiosWithPublic.delete(`trades/${stockId}`);
            toastNotify("success", data.message);
        } catch (error) {
            console.log("Error deleting trade:", error);
            dispatch(fetchTradeFail());
        }
    };

    return {
        getTrades,
        getStocks,
        getSingleTrade,
        getSingleStock,
        postTrade,
        editTrade,
        editStock,
        deleteTrade,
    };
};

export default useTradeCall;
