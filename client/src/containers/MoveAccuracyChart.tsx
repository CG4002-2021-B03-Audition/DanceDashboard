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
    return state.moveStore.moves
}

const MoveAccuracyChart = () => {
    const moveData = useSelector(selectMoves)

    const lastMoveData = (moveData.length !== 0) ? moveData.slice(-1)[0] : undefined
    const currentMove = (lastMoveData !== undefined) ? lastMoveData.move : "-"
    const currentMoveLabel = (lastMoveData !== undefined) ? [parseFloat(lastMoveData.accuracy) * 100] : []
    const currentMoveAcc = (lastMoveData !== undefined) ? [lastMoveData.accuracy, 1-lastMoveData.accuracy] : [] 
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