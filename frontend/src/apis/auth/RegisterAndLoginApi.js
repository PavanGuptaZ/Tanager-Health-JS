async function ApiFunction(type, data) {
    try {
        const responce = await fetch(import.meta.env.VITE_BACKEND_LINK + "/auth/" + type, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ ...data })
        })

        const dataRecieved = responce.json()
        return dataRecieved
    } catch (error) {
        return false
    }
}

export default ApiFunction