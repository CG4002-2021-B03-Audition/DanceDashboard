import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { CircularProgress, CircularProgressLabel, Container, Divider, Stack, Text, Tooltip } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getProgressColor } from '../utils';

interface Props {
    danceData : never[]
}

const selectActual = (state : any) => state.liveStore.actualMoves

const SessionScoreChart: React.FC<Props> = ({ danceData }) => {
    // To be refactored when actual dance data can be sent
    const actualActions = useSelector(selectActual)
    const [ scores, setScores ] = useState<number[]>([0, 1])
    useEffect(() => {
        let totalScore = danceData.length
        let currentScore = 0

        
        danceData.forEach((action : any, index : number) => {
            if(action.name === actualActions[index % actualActions.length]) {
                currentScore += 1
            } 
        })

        setScores([currentScore, totalScore])
    }, [danceData])

    const calculateScore = () => {
        if(scores[0] === 0) return 0
        return (scores[0] / scores[1]) * 100 
    }

    return (
        <>
            <Stack isInline={true} align="center" justify="center">
              <Text fontSize="2xl" textAlign="center">Dance Session Score</Text>
              <Tooltip label="Displays the number of correct moves / position changes.">
                <QuestionOutlineIcon/>
              </Tooltip>
            </Stack>
            <Divider orientation="horizontal" mt={4} mb={4}/>
            <Container centerContent>
                <CircularProgress value={calculateScore()} size={72} color={getProgressColor(calculateScore())}>
                    <CircularProgressLabel>
                        <Text>
                            {`${scores[0]} / ${scores[1]}`}
                        </Text>
                        <Text fontWeight="bold">
                            moves were correct!
                        </Text>
                    </CircularProgressLabel>
                </CircularProgress>
            </Container>
        </>
    )
}

export default SessionScoreChart;