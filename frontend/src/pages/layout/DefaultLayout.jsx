// import { useGetAccessToken } from "../../hooks";
import { Routes, Route, useLocation } from 'react-router-dom'
import { RegisterAndLoginPage } from '../RegisterAndLoginPage.jsx'
import { WelcomePage } from '../WelcomePage.jsx'
import { UserHomePage } from '../UserHomePage.jsx'
import { AuthProtector } from "./AuthProtector.jsx";
import { NavigationBar } from '../../components/NavigationBar.jsx';
import { Footer } from '../../components/Footer.jsx';
import { useEffect } from 'react';

export const DefaultLayout = () => {
    // console.log(useGetAccessToken())
    const location = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location.pathname])

    return (
        <div className='fullbody'>
            <useScrollTop />
            <NavigationBar />
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<RegisterAndLoginPage type='login' />} />
                <Route path="/register" element={<RegisterAndLoginPage type='register' />} />
                <Route element={<AuthProtector />}>
                    <Route path="/home" element={<UserHomePage />} />
                </Route>
            </Routes>
            <Footer />
        </div>
    )
}
