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

const updateSessionName = async (data : any) => {
    const { sid, name } = data
    const resp = await axios({
        url: api.updateSessionName(sid),
        method: 'patch',
        params: {
            name: name
        }
    })
    return resp
}

const fetchLastSession = async () => {
    const resp = await axios.get(api.getLatestSession)
    return resp
}

// getMovesInSession: (sid: number) => `${BASE_URL}/moves/${sid}`,

const fetchDataInSession = async (sid : number) => {
    return await axios.get(api.getMovesInSession(sid) + `?aid=1&did=1`)
}

const fetchMoveBreakdown = async (sid : number) => {
    return await axios.get(api.getMoveBreakdown(sid))
}

const sendSessionResult = async (data : any, sid : number) => {
    const resp = await axios.post(api.sendSessionResult(sid), {
        actions: data
    })
    return resp
}

const getSessionResult = async (sid : number) => {
    const resp = await axios.get(api.sendSessionResult(sid))
    return resp
}

export {
    updateSessionName,
    fetchLastSession,
    fetchAllSessions,
    fetchDataInSession,
    fetchMoveBreakdown,
    sendSessionResult,
    getSessionResult,
}