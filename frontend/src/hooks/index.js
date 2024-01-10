import { useContext } from "react";
import { UserContext } from "./ContextProvider";

export function userReducer(state, action) {
    const { type, payload } = action

    switch (type) {
        case "addUser":
            return { ...payload }
        case "removeUser":
            return false
        default:
            return false;
    }
}


export const useGetUser = () => {
    const data = useContext(UserContext)
    return data.user || false
}

export const useGetAccessToken = () => {
    const data = useContext(UserContext)
    return data.token || false
}

export const useUserLoading = () => {
    const data = useContext(UserContext)
    return data.userLoading || false
}

export const useUserFetching = () => {
    const data = useContext(UserContext)
    return data.userFetching || false
}

