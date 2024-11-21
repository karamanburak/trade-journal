import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRouter from "./PrivateRouter";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import StockDetails from "../pages/StockDetails";

const AppRouter = () => {
    return (
        <Router >
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="*" element={<NotFound />} />

                <Route path="" element={<PrivateRouter />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="profile/:userId" element={<Profile />} />
                    <Route path="/stocks/:stockId" element={<StockDetails />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default AppRouter