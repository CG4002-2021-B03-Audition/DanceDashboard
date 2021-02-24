import { fetchAllSessions } from '../../apiCalls'

export const FETCH_SESSIONS = 'FETCH_SESSIONS'

export async function fetchSessions(dispatch : any, getState : any) {
    const response = await fetchAllSessions()
    dispatch({
        type: FETCH_SESSIONS,
        payload: response.data.message,
    })
}