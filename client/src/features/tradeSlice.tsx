import { createSlice } from "@reduxjs/toolkit"

const tradeSlice = createSlice({
    name: "trade",

    initialState: {
        trades: [],
        stocks: [],
        singleTrade: null,
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
    fetchStockSuccess,
    fetchTradeFail,
} = tradeSlice.actions
export default tradeSlice.reducer
