import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Main from "./pages/Main";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function ProtectedRoutes({ redirectTo }) {
    const isAuthenticated = localStorage.getItem('token');

    return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />
}

function MainRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route element={<ProtectedRoutes redirectTo='/' />}>
                <Route path='/main' element={<Main />} />
            </Route>
        </Routes>

    );
}

export default MainRoutes;