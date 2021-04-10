import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { CircularProgress, CircularProgressLabel, Stack, Text, Tooltip } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getProgressColor } from '../utils';

interface Props {
    danceData : any[]
}

const TOTAL_DANCE_MOVES = 12

const ExtraStatChart: React.FC<Props> = ({danceData}) => {
    const [ avgDelay, setAvgDelay ] = useState<number>(0)
    const [ avgAccuracy, setAvgAccuracy ] = useState<number>(0)
    useEffect(() => {
        // let numDanceData = danceData.length
        let totalDelay = 0
        let totalAccuracy = 0
        let numMoves = 0
        danceData.forEach((action : any) => {
            totalDelay += action.delay
            let accuracy = parseFloat(action.accuracy)
            if(accuracy !== -1) {
                totalAccuracy += accuracy
                numMoves += 1
            }
        })

        setAvgDelay(totalDelay/TOTAL_DANCE_MOVES)
        setAvgAccuracy(totalAccuracy/numMoves * 100)
    }, [danceData])

    return (
        <>
            <Stack justify="center" isInline spacing={6}>
                <CircularProgress value={avgDelay ? avgDelay * 10 : 0} size={64} color={getProgressColor(avgDelay)}>
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
                <CircularProgress value={ avgAccuracy ? avgAccuracy : 0} size={64} color={getProgressColor(avgAccuracy)}>
                    <CircularProgressLabel>
                        <Tooltip label="Resemblance between your move and the actual.">
                            <QuestionOutlineIcon boxSize="0.8em"/>
                        </Tooltip>
                        <Text size="20" fontWeight="bold" fontSize={24} margin="auto" maxWidth="50%" noOfLines={2}>
                            Avg Move Accuracy
                        </Text>                       
                        <Text fontSize={24}>
                            { avgAccuracy ? avgAccuracy.toFixed(1) : 0 }%
                        </Text>
                    </CircularProgressLabel>
                </CircularProgress>
            </Stack>
        </>
    )
}

export default ExtraStatChart;