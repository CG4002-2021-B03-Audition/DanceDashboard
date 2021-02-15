import React from 'react'
import { Line } from 'react-chartjs-2'
import { ChartOptions } from 'chart.js'
import { moveSocket } from '../socket'
import { useSelector } from 'react-redux'
import { Move } from '../store/session/types'
import { Button, ButtonGroup } from '@chakra-ui/react'

const options: ChartOptions = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          max: 1.5
        },
      },
    ],
  },
}

const selectMoves = (state: any) => { 
    return state.moveStore
}

const LineChart = () => {
    const moveData = useSelector(selectMoves)

    const handleConnect = () => {
        moveSocket.connect()
    }

    const handleDisconnect = () => {
        moveSocket.disconnect()
    }
    return (
        <>
            <div className='header'>
            <h1>Line Chart</h1>
            </div>
            <ButtonGroup>
                <Button onClick={handleConnect}>Start dance session! (Connect to socket)</Button>
                <Button onClick={handleDisconnect}>Stop dance session!</Button>
            </ButtonGroup>
            <Line 
                data={{
                    labels: moveData.moves.slice(0, 4).map((el: Move) => el.move),
                    datasets: [
                        {
                            label: "Delay (ms)",
                            data: moveData.moves.slice(0, 4).map((el: Move) => el.delay),
                            fill: false,
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgba(255, 99, 132, 0.2)',
                        }
                    ]
                }}
                options={options}
            />
        </>
    )
}

export default LineChart