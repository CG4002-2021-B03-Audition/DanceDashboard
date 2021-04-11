import { FETCH_SESSIONS, SEARCH_TEXT } from "./actions"


export interface SessionFetchType {
    type: typeof FETCH_SESSIONS
    payload: Session[]
}

export interface SearchTextType {
    type: typeof SEARCH_TEXT
    payload: string
}

export interface Session {
    sid: number
    aid: number
    name: string
    timestamp: Date
}

export interface SessionState {
    searchText: string
    sessions: Session[]
}

export type SessionActionType = SessionFetchType | SearchTextType