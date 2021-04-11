import { IMU_MESSAGE, EMG_MESSAGE, WS_MOVE_CONNECT, WS_MOVE_MESSAGE, WS_NEXT_ACTUAL, WS_POS_MESSAGE, WS_RESET_STATE } from "./actions"

export interface Move {
    move: string
    timestamp: string
    accuracy: string
    delay: number
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

interface WsNextActual {
    type: typeof WS_NEXT_ACTUAL
    payload: number
}

export type WsActionTypes = WsMoveConnect | WsMoveMessage | WsPosMessage | WsNextActual

export interface IMU {
    x: number
    y: number
    z: number
    yaw: number
    pitch: number
    roll: number
    timestamp: number
    dancerId: number
}

interface IMUData {
    type: typeof IMU_MESSAGE
    payload: IMU
}

export type IMUDataType = IMUData

interface EMGData {
    type: typeof EMG_MESSAGE
    payload: number
}
export type EMGDataType = EMGData

export interface WsResetState {
    type: typeof WS_RESET_STATE
    payload: ""
}

export interface WsState {
    isConnected: boolean
    actualMoves: string[]
    actualMoveIndex: number
    moves: Move[]
    positions: Position[]
    imu: {
        [key: number]: IMU[]
        0: IMU[]
        1: IMU[]
        2: IMU[]
    },
    emg: number,
}