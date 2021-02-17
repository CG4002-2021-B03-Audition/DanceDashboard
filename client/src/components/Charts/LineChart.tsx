import React from 'react'
import { Line } from 'react-chartjs-2'
import { ChartOptions } from 'chart.js'
import { Text } from '@chakra-ui/react'

interface Props {
    options: ChartOptions
    xAxis: (string | number | string[] | number[] | Date | Date[] | moment.Moment | moment.Moment[])[] | undefined
    yAxis: (number | number[] | null | undefined)[] | Chart.ChartPoint[] | undefined
    xLabel: string | undefined
    yLabel: string | undefined
    chartTitle: string | undefined
}

const LineChart: React.FC<Props> = (props) => {
    return (
        <>
            <div className='header'>
            <Text fontSize="2xl">{props.chartTitle}</Text>
            </div>
            <Line 
                data={{
                    labels: props.xAxis,
                    datasets: [
                        {
                            label: props.yLabel,
                            data: props.yAxis,
                            fill: false,
                            backgroundColor: 'rgba(128, 90, 213)',
                            borderColor: 'rgba(128, 90, 213, 0.2)',
                        }
                    ]
                }}
                options={props.options}
            />
        </>
    )
}

export default LineChart