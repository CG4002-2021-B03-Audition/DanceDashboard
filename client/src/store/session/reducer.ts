import { combineReducers } from "redux"
import * as actionTypes from "./actions"
import { MoveState, WsActionTypes } from "./types"

const initialState: MoveState = {
    isConnected: false,
    moves: []
}

export function moveReducer(
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

export const rootReducer = combineReducers({
    moveStore: moveReducer,
})

export type RootState = ReturnType<typeof rootReducer>