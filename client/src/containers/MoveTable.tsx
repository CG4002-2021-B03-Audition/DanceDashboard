import React from 'react';
import { useSelector } from 'react-redux';
import BasicTable from '../components/Tables/BasicTable';

const selectMoves = (state: any) => { 
    return state.moveStore
}

const MoveTable = () => {
    const moveData = useSelector(selectMoves)
    const rows = moveData.moves.map((row : any) => Object.values(row))
    return (
        <BasicTable 
            headers={["move", "timestamp", "delay", "accuracy"]} 
            rowData={rows}
        />
    )
}

export default MoveTable