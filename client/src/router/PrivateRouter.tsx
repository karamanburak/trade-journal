import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../app/store"

const PrivateRouter = () => {
    const { currentUser } = useSelector((state: RootState) => state.auth)
    return currentUser ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRouter
