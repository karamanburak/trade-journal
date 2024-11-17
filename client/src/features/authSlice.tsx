import { createSlice } from "@reduxjs/toolkit"

const initialState: IAuthState = {
    currentUser: null,
    loading: false,
    error: false,
    token: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        fetchStart: (state) => {
            state.loading = true
            state.error = false
        },
        fetchSuccess: (state, { payload }) => {
            state.loading = false
            state.error = false
            state.currentUser = payload?.new
        },
        registerSuccess: (state) => {
            state.loading = false
            state.error = false
        },
        loginSuccess: (state, { payload }) => {
            state.loading = false
            state.currentUser = payload?.user
            state.token = payload?.token
        },
        logoutSuccess: (state) => {
            state.loading = false
            state.currentUser = null
            state.token = null
        },
        fetchFail: (state) => {
            state.loading = false
            state.error = true
        },
    },
})

export const { fetchStart, fetchSuccess, registerSuccess, logoutSuccess, loginSuccess, fetchFail } =
    authSlice.actions
export default authSlice.reducer