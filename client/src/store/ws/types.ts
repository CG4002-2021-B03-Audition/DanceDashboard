import { WS_MOVE_CONNECT, WS_MOVE_MESSAGE } from "./actions"

export interface Move {
    move: string
    timestamp: string
    accuracy: number
    delay: number
}

export interface MoveState {
    isConnected: boolean
    moves: Move[]
}

interface WsMoveConnect {
    type: typeof WS_MOVE_CONNECT
    payload: boolean
}

interface WsMoveMessage {
    type: typeof WS_MOVE_MESSAGE
    payload: Move
}

export type WsActionTypes = WsMoveConnect | WsMoveMessage