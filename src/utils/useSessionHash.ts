import { sequence } from '../main'
import {useEffect, useState} from "react";

export function useSessionHash() {
    const [sessionHash, setSessionHash] = useState("")
    const [error, setError] = useState<any>(undefined)

    useEffect(() => {
        sequence.getSessionHash()
            .then(sessionHash => setSessionHash(sessionHash))
            .catch(error => { console.error(error); setError(error) })
    }, [])

    return {
        sessionHash,
        error,
        loading: !!sessionHash,
    }
}
