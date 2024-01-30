import { sequence } from '../main'
import {useEffect, useState} from "react";

export function useSessionAddress() {
    const [sessionAddress, setSessionAddress] = useState("")
    const [error, setError] = useState<any>(undefined)

    useEffect(() => {
        sequence.getSessionID()
            .then(sessionAddress => setSessionAddress(sessionAddress))
            .catch(error => { console.error(error); setError(error) })
    }, [])

    return {
        sessionAddress,
        error,
        loading: !!sessionAddress,
    }
}
