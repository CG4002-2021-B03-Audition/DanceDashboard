import { api } from './api'
import axios from 'axios'

const fetchAllSessions = async (data? : any) => {
    if (data !== undefined) {
        const { date } = data;
        const resp = await axios.get(api.getAllSessions, {
            params: {
                date: date,
            }
        })
        return resp
    }
    
    const resp = await axios.get(api.getAllSessions)
    return resp
}

// getMovesInSession: (sid: number) => `${BASE_URL}/moves/${sid}`,

const fetchDataInSession = async (sid : number) => {
    return await axios.get(api.getMovesInSession(sid) + `?aid=1&did=1`)
}

const fetchMoveBreakdown = async (sid : number) => {
    return await axios.get(api.getMoveBreakdown(sid))
}

export {
    fetchAllSessions,
    fetchDataInSession,
    fetchMoveBreakdown,
}