import { Outlet } from 'react-router-dom'
import { useGetUser, useUserLoading } from '../../hooks'
import { RegisterAndLoginPage } from '../RegisterAndLoginPage'

export const AuthProtector = () => {
    let user = useGetUser()
    let loading = useUserLoading()


    if (loading) {
        return <div>Loading</div>
    }

    return (
        <>
            {user ? <Outlet /> : <RegisterAndLoginPage type='login' />}</>
    )
}
