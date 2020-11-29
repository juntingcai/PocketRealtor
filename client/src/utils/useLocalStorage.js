import { useEffect, useState } from "react";

const PREFIX = 'pocket-realtor-';
export default function useLocalStorage(key, initiaValue) {
    const prefixedKey = PREFIX + key;

    const [value, setValue] = useState(() => {
        const item = localStorage.getItem(prefixedKey);
        if (item != null) return JSON.parse(item);
        if (typeof initiaValue === 'function')
            return initiaValue();
        else
            return initiaValue;
    })

    useEffect(() => {
        localStorage.setItem(prefixedKey, JSON.stringify(value))
    }, [prefixedKey, value])

    return [value, setValue];

}