import { WsActionTypes } from "./types"
export const WS_MOVE_CONNECT = 'WS_CONNECT'
export const WS_MOVE_MESSAGE = 'WS_MESSAGE'

export const ws_move_connect = (data : boolean): WsActionTypes => {
    return {
        type: WS_MOVE_CONNECT,
        payload: data
    }
}

export const ws_move_message = (obj: any): WsActionTypes => {
    let data = JSON.parse(obj.body)
    let move = data.move
    let timestamp = data.timestamp
    let delay = parseFloat(data.syncDelay)
    let accuracy = parseFloat(data.accuracy)
    let moveData = {
        move: move,
        timestamp: timestamp,
        delay: delay,
        accuracy: accuracy,
    }
    return {
        type: WS_MOVE_MESSAGE,
        payload: moveData
    }
}