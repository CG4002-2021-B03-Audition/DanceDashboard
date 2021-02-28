import React from 'react'
import { ChartOptions } from 'chart.js'
import { useSelector } from 'react-redux'
import { Move, Position } from '../store/ws/types'
import LineChart from '../components/Charts/LineChart'
import { sortByTimeStampOldest } from '../utils';
import { Badge, Flex, Spacer, Stack } from '@chakra-ui/react'

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
    return state.liveStore.moves.map((item : Move) => {
      return {name: item.move, delay: item.delay, timestamp: item.timestamp}
    })
}

const selectPositions = (state: any) => { 
    return state.liveStore.positions.map((item : Position) => {
      return {name: item.position, delay: item.delay, timestamp: item.timestamp}
    })
}

const DelayChart = () => {
    const moveData = useSelector(selectMoves)
    const positionData = useSelector(selectPositions)
    const combineData = [...moveData, ...positionData].sort(sortByTimeStampOldest)
    return (
        <Stack>
          <LineChart 
              options={options} 
              xAxis={combineData.slice(-5).map((el: any) => el.name)} 
              yAxis={combineData.slice(-5).map((el: any) => el.delay)}
              xLabel="Moves"
              yLabel="Delay (ms)"
              chartTitle="Team Delay (ms)"
              info="Displays the average team delay of every move performed."
          />
          <Flex>
            <Badge colorScheme="purple">Latest</Badge>
            <Spacer/>
            <Badge colorScheme="purple">Newest</Badge>
          </Flex>
        </Stack>
    )
}

export default DelayChart