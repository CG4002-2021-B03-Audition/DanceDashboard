import { Divider, Text } from '@chakra-ui/react';
import React from 'react';
import {Polar} from 'react-chartjs-2';

interface Props {
    chartTitle: string
    data: number[]
    labels: string[]
}

const PolarChart: React.FC<Props> = ({data, labels, chartTitle}) => {
    return (
        <>
            <Text fontSize="2xl" textAlign="center">{chartTitle}</Text> 
            <Divider orientation="horizontal"/>
            <Polar data={{
                datasets: [{
                    data: data,
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
                    label: 'My dataset' // for legend
                }],
                labels: labels
            }} options={{
                aspectRatio: 1,
                scale: {
                    ticks: {                        
                        stepSize: 1,
                    }
                },
                legend: {
                    position: 'right'
                }
            }} />
        </>
    );
}

export default PolarChart;