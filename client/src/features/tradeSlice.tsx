import { createSlice } from "@reduxjs/toolkit"

const tradeSlice = createSlice({
    name: "trade",

    initialState: {
        trades: [],
        stocks: [],
        singleTrade: null,
        singleStock: null,
        loading: false,
        error: false,
    },
    reducers: {
        fetchTradeStart: (state) => {
            state.loading = true
            state.error = false
        },
        fetchTradeSuccess: (state, { payload: data }) => {
            state.loading = false
            state.error = false
            state.trades = data
        },
        fetchSingleTradeSuccess: (state, { payload: data }) => {
            state.loading = false
            state.error = false
            state.singleTrade = data
        },
        fetchSingleStockSuccess: (state, { payload: data }) => {
            state.loading = false
            state.error = false
            state.singleStock = data
        },
        fetchStockSuccess: (state, { payload: data }) => {
            state.loading = false
            state.error = false
            state.stocks = data
        },
        fetchTradeFail: (state) => {
            state.loading = false
            state.error = true
        },

    },
})

export const {
    fetchTradeStart,
    fetchTradeSuccess,
    fetchSingleTradeSuccess,
    fetchSingleStockSuccess,
    fetchStockSuccess,
    fetchTradeFail,
} = tradeSlice.actions
export default tradeSlice.reducer
