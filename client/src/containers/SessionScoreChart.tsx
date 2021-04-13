import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { CircularProgress, CircularProgressLabel, Container, Divider, Radio, RadioGroup, Stack, Text, Tooltip } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Session } from '../store/session/types';
import { getProgressColor, isPosition } from '../utils';
import { getSessionResult } from '../apiCalls'
import AvgMoveAccuracy from './AvgMoveAccuracy';
import ExtraStatChart from './ExtraStatChart';

interface Props {
    session: Session | undefined
    isIndividual: boolean
    danceData: any[]
    callback: () => void
}

const SessionScoreChart: React.FC<Props> = ({ session, isIndividual, danceData, callback }) => {
    const [ scores, setScores ] = useState<number[]>([0, 1])
    const [ positionScore, setPositionScore ] = useState<number[]>([0, 1])
    const [ sessionData, setSessionData ] = useState<any[]>([])

    useEffect(() => {
        async function getSessionData(session : Session) {
            const resp = await getSessionResult(session.sid)
            if (resp.data.success && resp.data.message !== null) {
                const results = [...resp.data.message]
                const totalScore = results.length
                setSessionData(results)
                if (totalScore !== 0) {
                    let totalPositions = 0
                    let currentScore = 0
                    let currentPosScore = 0
                    results.forEach((result : any) => {
                        if (isPosition(result.name)) {
                            totalPositions += 1
                        }
                        if (result.isCorrect && isPosition(result.name)) {
                            currentPosScore += 1
                            currentScore += 1
                        }
                        else if (result.isCorrect) {
                            currentScore += 1
                        }
                    })
                    setScores([currentScore, totalScore])
                    setPositionScore([currentPosScore, totalPositions])
                }
            } else {
                setSessionData([])
                setScores([0, 1])
                setPositionScore([0, 1])
            }
        }
        if (session !== undefined) { getSessionData(session) }
    }, [session])

    const calculateScore = () => {
        if(scores[0] === 0) return 0
        return (scores[0] / scores[1]) * 100 
    }

    const calculatePosScore = () => {
        if(positionScore[0] === 0) return 0
        return (positionScore[0] / positionScore[1]) * 100 
    }

    const individualMoveAccuracy = (
        <>
            <AvgMoveAccuracy chartName={`Dancer 1 Move Acc`} danceData={danceData}/>
            <Stack direction="row">
                <AvgMoveAccuracy chartName={`Dancer 2 Move Acc`} danceData={danceData}/>
                <AvgMoveAccuracy chartName={`Dancer 3 Move Acc`} danceData={danceData}/>
            </Stack>
        </>
    )

    return (
        <>
            <Stack isInline={true} align="center" justify="center">
              <Text fontSize="2xl" textAlign="center">Dance Session Score</Text>
              <Tooltip label="Displays the number of correct moves / position changes.">
                <QuestionOutlineIcon/>
              </Tooltip>
              <RadioGroup defaultValue="1" onChange={callback} colorScheme="purple">
                  <Stack direction="row" spacing={2}>
                    <Radio value="1">Overall</Radio>
                    <Radio value="2">Individual</Radio>
                  </Stack>
              </RadioGroup>
            </Stack>
            <Divider orientation="horizontal" mt={4} mb={4}/>
            <Container centerContent>
                {!isIndividual ?
                <> 
                    <Stack direction="row" mb={6} spacing={6}>
                        <CircularProgress value={calculateScore()} size={64} color={getProgressColor(calculateScore())}>
                            <CircularProgressLabel>
                                <Text>
                                    {(sessionData.length === 0) ? "-" : `${scores[0]} / ${scores[1]}`}
                                </Text>
                                <Text fontWeight="bold">
                                    actions were correct!
                                </Text>
                            </CircularProgressLabel>
                        </CircularProgress>     
                        <CircularProgress value={calculatePosScore()} size={64} color={getProgressColor(calculatePosScore())}>
                            <CircularProgressLabel>
                                <Text>
                                    {(sessionData.length === 0) ? "-" : `${positionScore[0]} / ${positionScore[1]}`}
                                </Text>
                                <Text fontWeight="bold">
                                    positions were correct!
                                </Text>
                            </CircularProgressLabel>
                        </CircularProgress>    
                    </Stack> 
                    <ExtraStatChart danceData={danceData} />
                </>
                : individualMoveAccuracy
                }
            </Container>
        </>
    )
}

export default SessionScoreChart;