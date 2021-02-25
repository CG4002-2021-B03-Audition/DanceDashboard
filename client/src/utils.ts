import { Move, Position } from './store/ws/types';

export type WsObj = Move | Position

export const sortByTimeStampNewest = (item1 : WsObj, item2 : WsObj) => {
    let t1 = new Date(item1.timestamp)
    let t2 = new Date(item2.timestamp)
    return (t1 < t2) ? 1 : -1
}

export const sortByTimeStampOldest = (item1 : WsObj, item2 : WsObj) => {
    let t1 = new Date(item1.timestamp)
    let t2 = new Date(item2.timestamp)
    return (t1 < t2) ? -1 : 1
}