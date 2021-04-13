import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { CircularProgress, CircularProgressLabel, Text, Tooltip } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getProgressColor } from '../utils';

interface Props {
    chartName: string
    danceData : any[]
}

const AvgMoveAccuracy: React.FC<Props> = ({ chartName, danceData }) => {
    const [ avgAccuracy, setAvgAccuracy ] = useState<number>(0)
    useEffect(() => {
        let totalAccuracy = 0
        let numMoves = 0
        danceData.forEach((action : any) => {
            let accuracy = parseFloat(action.accuracy)
            if(accuracy !== -1) {
                totalAccuracy += accuracy
                numMoves += 1
            }
        })

        setAvgAccuracy(totalAccuracy/numMoves * 100)
    }, [danceData])

    return (
        <CircularProgress value={ avgAccuracy ? avgAccuracy : 0} size={64} color={getProgressColor(avgAccuracy)} thickness="10px">
            <CircularProgressLabel>
                <Tooltip label="Resemblance between your move and the actual.">
                    <QuestionOutlineIcon boxSize="0.8em"/>
                </Tooltip>
                <Text size="20" fontWeight="bold" fontSize={24} margin="auto" maxWidth="50%" noOfLines={2}>
                    {chartName}
                </Text>                       
                <Text fontSize={24}>
                    { avgAccuracy ? avgAccuracy.toFixed(1) : 0 }%
                </Text>
            </CircularProgressLabel>
        </CircularProgress>
    )
}

export default AvgMoveAccuracy;