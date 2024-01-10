import { useGetUser } from "../../hooks";
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { RegisterAndLoginPage } from '../RegisterAndLoginPage.jsx'
import { WelcomePage } from '../WelcomePage.jsx'
import { UserHomePage } from '../UserHomePage.jsx'
import { AuthProtector } from "./AuthProtector.jsx";
import { NavigationBar } from '../../components/NavigationBar.jsx';
import { Footer } from '../../components/Footer.jsx';
import { useEffect } from 'react';
import { ProfilePage } from "../ProfilePage.jsx";
import { SettingPage } from "../SettingPage.jsx";
import { PageNotFound } from "../PageNotFound.jsx";

export const DefaultLayout = () => {
    const user = useGetUser()
    const location = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location.pathname])

    return (
        <div className='fullbody'>
            <NavigationBar />
            <Routes>
                <Route path="/" element={user ? <Navigate to='/home' /> : <WelcomePage />} />
                <Route path="/login" element={<RegisterAndLoginPage type='login' />} />
                <Route path="/register" element={<RegisterAndLoginPage type='register' />} />
                <Route element={<AuthProtector />}>
                    <Route path="/home" element={<UserHomePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingPage />} />
                </Route>
                <Route path="*" element={<PageNotFound type='register' />} />
            </Routes>
            <Footer />
        </div>
    )
}
