import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Divider, Stack, Text, Tooltip } from '@chakra-ui/react'
import { ChartOptions } from 'chart.js'
import { QuestionOutlineIcon } from '@chakra-ui/icons'

interface Props {
    legendLabels: string[]
    values: number[]
    chartTitle: string
    options: ChartOptions
}


const DoughnutChart: React.FC<Props> = (props) => {
    return (
        <>
            <Stack isInline={true} align="center" justify="center">
              <Text fontSize="2xl" textAlign="center">{props.chartTitle}</Text>
              <Tooltip label="Displays how many times each move was performed during the session.">
                <QuestionOutlineIcon/>
              </Tooltip>
            </Stack>
            <Divider orientation="horizontal" mt={4} mb={4}/>
            <Doughnut 
                data={{
                  labels: props.legendLabels,
                  datasets: [
                    {
                      data: props.values,
                      backgroundColor: [
                        '#D0D4F9',
                        '#7A70E2',
                        '#C4B4FC',
                        '#9ABFF6',
                        '#DAD7F6',
                        '#C4D1FE',
                        '#9281AE',
                        '#9D67A3',
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