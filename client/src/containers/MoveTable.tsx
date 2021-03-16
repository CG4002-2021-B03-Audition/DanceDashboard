import React from 'react';
import { useSelector } from 'react-redux';
import BasicTable from '../components/Tables/BasicTable';
import { WsObj, sortByTimeStampNewest } from '../utils';

const selectMoves = (state: any) => { 
    return state.liveStore.moves
}

const selectPositions = (state: any) => { 
    return state.liveStore.positions
}

const MoveTable = () => {
    const wsMoves = useSelector(selectMoves)
    const wsPositions = useSelector(selectPositions)
    const currentTime = new Date().getTime() / 1000 // current unix time in seconds
    const wsData : WsObj[] = [...wsMoves, ...wsPositions]
    const formatData = wsData.sort(sortByTimeStampNewest).map((obj : WsObj) => {
        let timeOfAction = parseInt(obj.timestamp)
        
        let timeDiff = currentTime - timeOfAction

        // if more than 120 seconds (2 mins), display time difference in minutes instead 
        let isMinutes = false
        if (timeDiff > 120) {
            timeDiff = timeDiff / 60
            isMinutes = true
        }
        let displayTime = timeDiff.toFixed()
        if (timeDiff <= 0) {
            displayTime = "Now"
        } else if (isMinutes === true) {
            displayTime = displayTime + "mins ago..."
        } else {
            displayTime = displayTime + "s ago..."
        }
        console.log(timeDiff, displayTime)
        let formatObj = {
            ...obj, 
            timestamp: displayTime,
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