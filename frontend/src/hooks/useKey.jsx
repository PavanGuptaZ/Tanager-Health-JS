import { useEffect } from 'react';

export const useKey = (Key, action) => {
    useEffect(() => {
        function callback(e) {
            if (e.code && e.code.toLowerCase() === Key.toLowerCase()) {
                action()
            }
        }

        document.addEventListener("keydown", callback);

        return function () {
            document.removeEventListener("keydown", callback);
        }
    })
}
