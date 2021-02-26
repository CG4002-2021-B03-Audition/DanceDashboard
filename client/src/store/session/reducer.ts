import * as actionTypes from "./actions"
import { SessionState, SessionActionType } from "./types"

const initialState: SessionState = {
    searchText: "",
    sessions: []
}

export function sessionReducer(
    state = initialState, 
    action: SessionActionType
): SessionState {
    switch (action.type) {
        case actionTypes.FETCH_SESSIONS:
            return {
                ...state,
                sessions: [...action.payload],
            }
        case actionTypes.SEARCH_TEXT:
            return {
                ...state,
                searchText: action.payload,
            }
        default:
            return state
    }
}