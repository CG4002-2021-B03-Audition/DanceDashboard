import { IMUDataType, WsActionTypes, WsResetState } from "./types"
export const WS_MOVE_CONNECT = 'WS_CONNECT'
export const WS_MOVE_MESSAGE = 'WS_MOVE_MESSAGE'
export const WS_POS_MESSAGE = 'WS_POS_MESSAGE'
export const WS_NEXT_ACTUAL = 'WS_NEXT_ACTUAL'
export const IMU_MESSAGE = 'IMU_MESSAGE'
export const WS_RESET_STATE = 'WS_RESET_STATE'

export const ws_move_connect = (data : boolean): WsActionTypes => {
    return {
        type: WS_MOVE_CONNECT,
        payload: data
    }
}

export const ws_move_message = (data: any): WsActionTypes => {
    let move = data.move
    let timestamp = data.timestamp
    let delay = parseFloat(data.syncDelay)
    let accuracy = parseFloat(data.accuracy) * 100
    let moveData = {
        move: move,
        timestamp: timestamp,
        delay: delay,
        accuracy: accuracy.toString(),
    }
    return {
        type:  WS_MOVE_MESSAGE,
        payload: moveData
    }
}

export const ws_pos_message = (data: any): WsActionTypes => {
    let position = data.position
    let timestamp = data.timestamp
    let delay = parseFloat(data.syncDelay)
    let posData = {
        position: position,
        timestamp: timestamp,
        delay: delay,
    }
    return {
        type:  WS_POS_MESSAGE,
        payload: posData
    }
}

export const imu_message = (data: any): IMUDataType => {
    data = {
        x: data.accelX,
        y: data.accelY,
        z: data.accelZ,
        yaw: data.gyroYaw,
        pitch: data.gyroPitch,
        roll: data.gyroRoll,
        timestamp: parseInt(data.timestamp),
        dancerId: data.dancerId,
    }
    return {
        type:  IMU_MESSAGE,
        payload: data
    }
}

export const ws_reset_state = () : WsResetState => {
    return {
        type: WS_RESET_STATE,
        payload: ""
    }
}