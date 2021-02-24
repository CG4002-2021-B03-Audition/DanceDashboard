import * as actionTypes from "./actions"
import { SessionState, SessionActionType } from "./types"

const initialState: SessionState = {
    sessions: []
}

export function sessionReducer(
    state = initialState, 
    action: SessionActionType
): SessionState {
    switch (action.type) {
        case actionTypes.FETCH_SESSIONS:
            return {
                sessions: [...state.sessions, ...action.payload],
            }
        default:
            return state
    }
}