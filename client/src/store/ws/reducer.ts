import * as actionTypes from "./actions"
import { WsState, WsActionTypes } from "./types"

const initialState: WsState = {
    isConnected: false,
    moves: [],
    positions: [],
}

export function wsReducer(
    state = initialState, 
    action: WsActionTypes
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
        default:
            return state
    }
}