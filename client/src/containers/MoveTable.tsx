import React from 'react';
import { useSelector } from 'react-redux';
import BasicTable from '../components/Tables/BasicTable';
import { Move, Position } from '../store/ws/types';

const selectMoves = (state: any) => { 
    return state.liveStore.moves
}

const selectPositions = (state: any) => { 
    return state.liveStore.positions
}

type WsObj = Move | Position

const sortByTimeStamp = (item1 : WsObj, item2 : WsObj) => {
    let t1 = new Date(item1.timestamp)
    let t2 = new Date(item2.timestamp)
    return (t1 < t2) ? 1 : -1
}

const MoveTable = () => {
    const wsMoves = useSelector(selectMoves)
    const wsPositions = useSelector(selectPositions)
    const currentTime = new Date()
    const wsData : WsObj[] = [...wsMoves, ...wsPositions]
    const formatData = wsData.sort(sortByTimeStamp).map((obj : WsObj) => {
        let timeStamp = new Date(obj.timestamp)

        // convert time difference to seconds 
        let timeDiff = (currentTime.getTime() - timeStamp.getTime()) / 1000

        // if more than 120 seconds (2 mins), display time difference in minutes instead 
        let displayTime = (timeDiff < 120 ? timeDiff : timeDiff / 60)
        let formatObj = {
            ...obj, 
            timestamp: (displayTime.toFixed() === "0") ? "Now" : displayTime.toFixed() + "s ago...", 
            accuracy: ("move" in obj) ? obj.accuracy + "%" : "-"
        }
        return formatObj

        // display in normal time format
        // let displayTime = new Date(obj.timestamp)
        // return {...obj, timestamp: `${displayTime.getHours()}:${displayTime.getMinutes()}:${displayTime.getSeconds()}`}
    })
    const rows : string[][] = formatData.map((row : any) => Object.values(row))
    return (
        <BasicTable 
            headers={["move / position", "timestamp", "delay (ms)", "accuracy"]} 
            rowData={rows}
        />
    )
}

export default MoveTable