import * as actionTypes from "./actions"
import { WsState, WsActionTypes, IMUDataType, WsResetState, EMGDataType } from "./types"

const actualMoves = [
    "pointhigh", 
    "dab", 
    "3 1 2", 
    "wipetable", 
    "2 1 3", 
    "gun", 
    "elbowkick", 
    "3 2 1", 
    "hair", 
    "listen", 
    "1 2 3", 
    "sidepump",
    "elbowkick", 
    "3 2 1", 
    "hair", 
    "listen", 
    "1 2 3", 
    "sidepump",
    "dab",
    "dab",
]

const initialState: WsState = {
    isConnected: false,
    actualMoves: actualMoves,
    actualMoveIndex: 0,
    moves: [],
    positions: [],
    imu: {
        0: [],
        1: [],
        2: [],
    },
    emg: 0,
}

export function wsReducer(
    state = initialState, 
    action: WsActionTypes | IMUDataType | EMGDataType | WsResetState
): WsState {
    switch (action.type) {
        case actionTypes.WS_MOVE_CONNECT:
            return {
                ...state,
                isConnected: action.payload
            }
        case actionTypes.WS_MOVE_MESSAGE:
            return {
                ...state,
                moves: [...state.moves, action.payload]
            }
        case actionTypes.WS_POS_MESSAGE:
            return {
                ...state,
                positions: [...state.positions, action.payload]
            }
        case actionTypes.WS_NEXT_ACTUAL:
            return {
                ...state,
                actualMoveIndex: (state.actualMoveIndex + action.payload) % 20
            }
        case actionTypes.IMU_MESSAGE:
            const newState = {
                ...state
            }
            newState.imu[action.payload.dancerId] = [...newState.imu[action.payload.dancerId], action.payload]
            return newState
        case actionTypes.EMG_MESSAGE:
            return {
                ...state,
                emg: action.payload
            }
        case actionTypes.WS_RESET_STATE:
            return {
                isConnected: false,
                actualMoves: actualMoves,
                actualMoveIndex: 0,
                moves: [],
                positions: [],
                imu: {
                    0: [],
                    1: [],
                    2: [],
                },
                emg: 0,
            }            
        default:
            return state
    }
}