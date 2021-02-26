import { fetchAllSessions } from '../../apiCalls'

export const FETCH_SESSIONS = 'FETCH_SESSIONS'
export const SEARCH_TEXT = 'SEARCH_TEXT'

export async function fetchSessions(dispatch : any, getState : any) {
    const response = await fetchAllSessions()
    dispatch({
        type: FETCH_SESSIONS,
        payload: response.data.message,
    })
}

export function setSearchText( data : any) {
    return {
        type: SEARCH_TEXT,
        payload: data,
    }
}