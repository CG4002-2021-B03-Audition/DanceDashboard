import { fetchAllSessions } from '../../apiCalls'

export const FETCH_SESSIONS = 'FETCH_SESSIONS'
export const SEARCH_TEXT = 'SEARCH_TEXT'

export async function fetchSessions(dispatch : any, getState : any) {
    const response = await fetchAllSessions()
    let data : string[] = []
    if (response.data.message !== null ) {
        data = response.data.message
    }
    dispatch({
        type: FETCH_SESSIONS,
        payload: data,
    })
}

export function setSearchText( data : any) {
    return {
        type: SEARCH_TEXT,
        payload: data,
    }
}