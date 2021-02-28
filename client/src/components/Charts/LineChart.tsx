import React from 'react'
import { Line } from 'react-chartjs-2'
import { ChartOptions } from 'chart.js'
import { Divider, Stack, Text, Tooltip } from '@chakra-ui/react'
import { QuestionOutlineIcon } from '@chakra-ui/icons'

interface Props {
    options: ChartOptions
    xAxis: (string | number | string[] | number[] | Date | Date[] | moment.Moment | moment.Moment[])[] | undefined
    yAxis: (number | number[] | null | undefined)[] | Chart.ChartPoint[] | undefined
    xLabel: string | undefined
    yLabel: string | undefined
    chartTitle: string | undefined
    info?: string | undefined
}

const LineChart: React.FC<Props> = (props) => {
    return (
        <>
            <Stack isInline={true} align="center" justify="center">
                <Text fontSize="2xl" textAlign="center">{props.chartTitle}</Text>
                <Tooltip label={props.info}>
                    <QuestionOutlineIcon/>
                </Tooltip>
            </Stack>
            <Divider orientation="horizontal" m={4}/>
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