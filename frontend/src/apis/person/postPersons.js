export async function postPersons(data) {
    try {
        const responce = await fetch(import.meta.env.VITE_BACKEND_LINK + "/person", {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const dataRecieved = responce.json()
        return dataRecieved
    } catch (error) {
        return { status: 'error', message: "Posting error" }
    }
}
