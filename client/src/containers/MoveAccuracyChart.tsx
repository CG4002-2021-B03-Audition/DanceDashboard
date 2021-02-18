import React from 'react'
import { ChartOptions } from 'chart.js'
import { useSelector } from 'react-redux'
import DoughnutChart from '../components/Charts/DoughnutChart'

const options: ChartOptions = {
  layout: {
    padding: {
      
    }
  },
  legend: {
    display: true,
    position: "right"
  },
  elements: {
    arc: {
      borderWidth: 0,
    }
  },
  cutoutPercentage: 90,
}

const selectMoves = (state: any) => { 
    return state.moveStore
}

const MoveAccuracyChart = () => {
    const moveData = useSelector(selectMoves)
    const currentMoveLabel = (moveData.moves.length !== 0) ? [parseFloat(moveData.moves[0].accuracy) * 100] : []
    const currentMove = (moveData.moves.length !== 0) ? moveData.moves[0].move : "-"
    const currentMoveAcc = (moveData.moves.length !== 0) ? [moveData.moves[0].accuracy, 1-moveData.moves[0].accuracy] : [] 
    return (
        <>  
            <DoughnutChart 
                chartTitle={"Move Accuracy (" + currentMove + ")"}
                legendLabels={currentMoveLabel.map(el => el.toString() + "%")}
                values={currentMoveAcc}
                options={options}
            />
        </>
    )
}

export default MoveAccuracyChart