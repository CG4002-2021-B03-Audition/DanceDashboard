import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { CircularProgress, CircularProgressLabel, Container, Divider, Stack, Text, Tooltip } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Session } from '../store/session/types';
import { getProgressColor } from '../utils';
import { getSessionResult } from '../apiCalls'

interface Props {
    session: Session | undefined
}

const SessionScoreChart: React.FC<Props> = ({ session }) => {
    const [ scores, setScores ] = useState<number[]>([0, 1])
    const [ sessionData, setSessionData ] = useState<any[]>([])

    useEffect(() => {
        async function getSessionData(session : Session) {
            const resp = await getSessionResult(session.sid)
            if (resp.data.success && resp.data.message !== null) {
                const results = [...resp.data.message]
                const totalScore = results.length
                setSessionData(results)
                if (totalScore !== 0) {
                    let currentScore = 0
                    results.forEach((result : any) => {
                        if (result.isCorrect) {
                            currentScore += 1
                        }
                    })
                    console.log("Current score: ", currentScore, totalScore)
                    setScores([currentScore, totalScore])
                }
            } else {
                setSessionData([])
                setScores([0, 1])
            }
        }
        if (session !== undefined) { getSessionData(session) }
    }, [session])

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
                            {(sessionData.length === 0) ? "-" : `${scores[0]} / ${scores[1]}`}
                        </Text>
                        <Text fontWeight="bold">
                            actions were correct!
                        </Text>
                    </CircularProgressLabel>
                </CircularProgress>
            </Container>
        </>
    )
}

export default SessionScoreChart;