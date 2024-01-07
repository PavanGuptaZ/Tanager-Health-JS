import PropTypes from 'prop-types';
import { createContext, useEffect } from 'react';
import { useReducer } from 'react';
import { userReducer } from './index.js';
import { useQuery } from '@tanstack/react-query';
import refreshApiFunction from '../apis/auth/RefreshApi.js';

export const UserContext = createContext()

export const ContextProvider = ({ children }) => {
    const [data, dispatchData] = useReducer(userReducer, false)

    const userQuery = useQuery({
        queryKey: ['refresh'],
        queryFn: () => refreshApiFunction()
    })

    useEffect(() => {
        if (userQuery.data?.status === "success") {
            dispatchData({ type: 'addUser', payload: userQuery.data })
        }
    }, [userQuery.data])

    return (
        <UserContext.Provider value={{ ...data, dispatchData, userLoading: userQuery.isLoading }}>
            {children}
        </UserContext.Provider>
    )
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}
