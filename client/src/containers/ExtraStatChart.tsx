import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { CircularProgress, CircularProgressLabel, Stack, Text, Tooltip } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getProgressColor } from '../utils';
import AvgMoveAccuracy from './AvgMoveAccuracy';

interface Props {
    danceData : any[]
}

const TOTAL_DANCE_MOVES = 12

const ExtraStatChart: React.FC<Props> = ({danceData}) => {
    const [ avgDelay, setAvgDelay ] = useState<number>(0)
    useEffect(() => {
        let totalDelay = 0
        danceData.forEach((action : any) => {
            totalDelay += action.delay
        })

        setAvgDelay(totalDelay/TOTAL_DANCE_MOVES)
    }, [danceData])

    return (
        <>
            <Stack justify="center" isInline spacing={6}>
                <CircularProgress value={avgDelay ? avgDelay * 10 : 0} size={64} color={getProgressColor(avgDelay)} thickness="10px">
                    <CircularProgressLabel>
                        <Tooltip label="Average time difference between the first dancer to perform the move and the last.">
                            <QuestionOutlineIcon boxSize="0.8em"/>
                        </Tooltip>
                        <Text size="20" fontWeight="bold" fontSize={24} margin="auto" maxWidth="50%" noOfLines={2}>
                            Avg Move Delay
                        </Text>
                        <Text fontSize={24}>
                            {avgDelay ? avgDelay.toFixed(2) : 0} ms
                        </Text>
                    </CircularProgressLabel>
                </CircularProgress>
                <AvgMoveAccuracy chartName="Avg Move Accuracy" danceData={danceData}/>
            </Stack>
        </>
    )
}

export default ExtraStatChart;