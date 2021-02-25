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

export {
    fetchAllSessions,
}