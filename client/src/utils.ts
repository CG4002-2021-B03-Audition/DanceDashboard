import { Move, Position } from './store/ws/types';

export type WsObj = Move | Position

export const sortByTimeStampNewest = (item1 : WsObj, item2 : WsObj) => {
    return (item1.timestamp < item2.timestamp) ? 1 : -1
}

export const sortByTimeStampOldest = (item1 : WsObj, item2 : WsObj) => {
    return (item1.timestamp < item2.timestamp) ? -1 : 1
}

export const getProgressColor = (data : any) => {
    switch (true) {
        case (data >= 60):
            return "purple.200"
        case (data >= 40 && data < 60):
            return "purple.400"
        case (data < 40):
            return "purple.800"
        default:
            return "gray.200"
    }
}