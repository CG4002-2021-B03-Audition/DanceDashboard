import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Text } from '@chakra-ui/react'
import { ChartOptions } from 'chart.js'

interface Props {
    move: number[]
    accuracy: number[]
    chartTitle: string
    options: ChartOptions
}


const DoughnutChart: React.FC<Props> = (props) => {
    console.log(props)
    return (
        <>
            <div className='header'>
              <Text fontSize="2xl">{props.chartTitle}</Text>
            </div>
            <Doughnut 
                data={{
                  labels: props.move.map(el => el.toString() + "%"),
                  datasets: [
                    {
                      data: props.accuracy,
                      backgroundColor: [
                        'rgb(128, 90, 213)',
                        'rgb(211,211,211)'
                      ],
                      hoverBackgroundColor:'rgba(128, 90, 213, 0.2)',
                    }
                  ]
                }}
                options={props.options}
            />
        </>
    )
}

export default DoughnutChart