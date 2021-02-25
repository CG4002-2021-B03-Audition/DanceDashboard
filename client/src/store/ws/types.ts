import { WS_MOVE_CONNECT, WS_MOVE_MESSAGE, WS_POS_MESSAGE } from "./actions"

export interface Move {
    move: string
    timestamp: string
    accuracy: string
    delay: number
}

export interface WsState {
    isConnected: boolean
    moves: Move[]
    positions: Position[]
}

interface WsMoveConnect {
    type: typeof WS_MOVE_CONNECT
    payload: boolean
}

interface WsMoveMessage {
    type: typeof WS_MOVE_MESSAGE
    payload: Move
}

export interface Position {
    position: string
    timestamp: string
    delay: number
}

interface WsPosMessage {
    type: typeof WS_POS_MESSAGE
    payload: Position
}

export type WsActionTypes = WsMoveConnect | WsMoveMessage | WsPosMessage