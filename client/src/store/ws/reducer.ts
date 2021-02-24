import * as actionTypes from "./actions"
import { MoveState, WsActionTypes } from "./types"

const initialState: MoveState = {
    isConnected: false,
    moves: []
}

export function wsReducer(
    state = initialState, 
    action: WsActionTypes
): MoveState {
    switch (action.type) {
        case actionTypes.WS_MOVE_CONNECT:
            return {
                ...state,
                isConnected: action.payload
            }
        case actionTypes.WS_MOVE_MESSAGE:
            return {
                ...state,
                moves: [action.payload, ...state.moves]
            }
        default:
            return state
    }
}