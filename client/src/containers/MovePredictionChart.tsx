import React from 'react';
import { Box, Divider, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { sortByTimeStampOldest } from '../utils';


const selectMoves = (state: any) => { 
    return state.liveStore.moves
}

const selectPositions = (state: any) => { 
    return state.liveStore.positions
}

const selectActual = (state: any) => { 
    return state.liveStore.actualMoves
}

const MovePredictionChart = () => {
    const moveData = useSelector(selectMoves)
    const positionData = useSelector(selectPositions)
    const actualData = useSelector(selectActual)
    const actualMoveIndex = useSelector((state : any) => state.liveStore.actualMoveIndex)
    const combineData = [...moveData, ...positionData].sort(sortByTimeStampOldest)

    const latestData = (combineData.length !== 0) ? combineData.slice(-1)[0] : undefined
    const getLabels = (obj : any) => {
        if (obj === undefined) {
            return ["-", "-", "-"]    
        }
        else if ("move" in obj) {
            return [latestData.move.toUpperCase(), latestData.accuracy + "%", actualData.slice(actualMoveIndex-1)[0].toUpperCase()]  
        } else if ("position" in obj) {
            return [latestData.position.toUpperCase(), "-", actualData.slice(actualMoveIndex-1)[0].toUpperCase()] 
        }
        return ["-", "-", "-"]    
    }
    const nameLabel = getLabels(latestData)[0]
    const accLabel = getLabels(latestData)[1]
    const correctLabel = getLabels(latestData)[2]
    // const getActual = () => {
    //     let actualMove = actualData[actualMoveIndex]
    //     return actualMove.toUpperCase()
    // }
    const isCorrect = correctLabel === nameLabel
    
    return (
        <>  
            <Box m={4}>
                <Text fontSize="5xl" letterSpacing={2}>
                    {nameLabel}
                </Text>
            </Box>
            <Divider/>
            <Box m={4}>
                <Text fontSize="5xl" letterSpacing={2}>
                    {accLabel}
                </Text>
            </Box>
            <Divider/>
            <Box m={4}>
                <Text fontSize="5xl" fontWeight="bold" letterSpacing={2} textColor={isCorrect ? "green.400" : "red.400"}>
                    {(isCorrect) ? "SUCCESS" : "GOOD TRY"}
                </Text>
                {(!isCorrect) ? <Text fontSize="md" textAlign="center" textColor="red.400">({correctLabel})</Text> : ""}
            </Box>
        </>
    )
}

export default MovePredictionChart