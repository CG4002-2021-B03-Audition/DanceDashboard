import { FETCH_SESSIONS } from "./actions"


export interface SessionActionType {
    type: typeof FETCH_SESSIONS
    payload: Session[]
}

export interface Session {
    sid: number
    aid: number
    timestamp: Date
}

export interface SessionState {
    sessions: Session[]
}